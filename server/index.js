
import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import CookieParser from 'cookie-parser';

import jwt from 'jsonwebtoken';

import crypto from 'crypto';
import U2F from 'u2f';
import hotp from 'otplib/hotp';

import { withUser, withTwoFactor, checkToken } from './middleware';

import { APP_ID, NODE_PATH, JWT_SECRET } from './environment';

import users from './users';

const HOTP = new hotp.HOTP();
HOTP.options = { crypto, encoding: 'hex' };

const HOTPcounterLimit = 15;

const app = Express();

app.use(BodyParser.json());
app.use(Cors());
app.use(CookieParser());

const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 1000000000,
};

function setAuthCookie(userId, response, requireTwoFactor = false, twoFactorType = null) {
    const userData = { userId };

    if (requireTwoFactor) userData.requireTwoFactor = true;
    if (twoFactorType) userData.twoFactorType = twoFactorType;

    const token = jwt.sign(
        userData,
        JWT_SECRET,
        { expiresIn: '1h' },
    );

    response.cookie('access_token', token, cookieConfig);
}


app.use(Express.static(`${NODE_PATH}/public`));

app.get('/', (request, response) =>
    response.sendFile('index.html'));

app.post('/login', (request, response, next) => {
    const logindata = request.body;

    users.login(logindata.login, logindata.password)
        .then((user) => {
            if (!user) return response.status(400).send();

            if (user.publicKey && user.keyHandle) {
                setAuthCookie(user.userId, response, true);
                return response.send({ twoFactorType: 'U2F' });
            }
            if (user.otpSecret && user.otpCounter != null) {
                setAuthCookie(user.userId, response, true);
                return response.send({ twoFactorType: 'OTP' });
            }
            setAuthCookie(user.userId, response);
            return response.send();
        })
        .catch(next);
});

app.get('/loginstate', checkToken, (request, response) =>
    response.send());

app.post('/register', (request, response, next) => {
    const logindata = request.body;

    users
        .register(logindata.login, logindata.password)
        .then((userId) => {
            if (!userId) return response.status(400).send();
            setAuthCookie(userId, response);
            return response.send();
        })
        .catch(next);
});

app.get('/getuserinfo/', checkToken, withTwoFactor, withUser, (request, response) => {
    const { user } = request;

    let twoFactor = null;

    if (user.keyHandle && user.publicKey) {
        twoFactor = 'U2F';
    }
    if (user.otpSecret && user.otpCounter != null) {
        twoFactor = 'OTP';
    }

    response.send(
        {
            username: user.username,
            twoFactorRegistered: twoFactor,
            twoFactorType: request.twoFactorType,
            registerDate: user.registerDate,
        },
    );
});


app.get('/login/u2f', checkToken, withUser, (request, response) => {
    const { user } = request;
    const u2fRequest = U2F.request(APP_ID, user.keyHandle);
    response.send(u2fRequest);
});

app.post('/login/u2f', checkToken, withUser, (request, response) => {
    const { user } = request;

    const signature = U2F.checkSignature(request.body.challenge, request.body.sig, user.publicKey);
    if (!signature.successful) return response.status(400).send();
    setAuthCookie(user.userId, response, false, 'U2F');
    return response.send();
});

app.get('/register/u2f', checkToken, withTwoFactor, withUser, (request, response) => {
    const u2fRequest = U2F.request(APP_ID);
    response.send(u2fRequest);
});

app.post('/register/u2f', checkToken, withUser, (request, response, next) => {
    const { user } = request;
    const registration = U2F.checkRegistration(request.body.challenge, request.body.registerResponse);
    if (!registration.successful) return response.status(400);

    users.registerU2F(user, registration.publicKey, registration.keyHandle)
        .then(() => response.send())
        .catch(next);
});

app.get('/register/otp', checkToken, withUser, (request, response) => {
    const otpSecret = crypto.randomBytes(20).toString('hex');

    response.send({ otpSecret });
});

app.post('/register/otp', checkToken, withUser, (request, response, next) => {
    users.registerOTP(request.user, request.body.otpSecret)
        .then(() => response.send())
        .catch(next);
});

app.post('/login/otp', checkToken, withUser, (request, response, next) => {
    const { user } = request;
    let currentCounter = user.otpCounter;
    console.log(user.otpAttempt);
    while (currentCounter <= user.otpCounter + HOTPcounterLimit) {
        const hotpCheck = HOTP.check(request.body.password, user.otpSecret, currentCounter);
        if (hotpCheck) {
            return users.saveOTPCounter(user, currentCounter)
                .then(() => {
                    setAuthCookie(user.userId, response, false, 'OTP');
                    return response.send();
                });
        }
        currentCounter += 1;
    }
    users.saveOTPAttempt(user)
        .then(() => response.status(400).send())
        .catch(next);
});

app.get('/unregister', checkToken, withUser, (request, response, next) => {
    users.unregister(request.user)
        .then(() => response.send())
        .catch(next);
});

app.post('/logout', (request, response) => {
    response.clearCookie('access_token');
    response.send();
});

app.listen(3000);
