import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './environment';
import users from './users';

const checkToken = (req, res, next) => {
    if (!req.cookies.access_token) return res.status(403).send();

    const accessToken = req.cookies.access_token;

    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send();

        req.userId = decoded.userId;
        req.requireTwoFactor = decoded.requireTwoFactor;
        req.twoFactorType = decoded.twoFactorType;

        return next();
    });
};

const withTwoFactor = (req, res, next) => {
    if (req.requireTwoFactor) return res.status(403).send();
    return next();
};

const withUser = (req, res, next) => {
    if (!req.userId) return res.status(403).send();
    users.getById(req.userId)
        .then((user) => {
            if (!user) return res.status(403).send();
            if (user.otpAttempt > 3) return res.status(403).send();
            req.user = user;
            return next();
        });
};

export { checkToken, withTwoFactor, withUser };
