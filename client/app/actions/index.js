
import axios from 'axios';
import u2fApi from 'u2f-api';
import viewStates from '../PersonalViewStates';

const u2fTimeout = 60;

const login = (userName, password, register) =>
    (store) => {
        let sequense;
        if (register) {
            sequense = axios.post('/register', {
                login: userName,
                password,
            });
        } else {
            sequense = axios.post('/login', {
                login: userName,
                password,
            });

            sequense = sequense
                .then(({ data: result }) => {
                    if (result.twoFactorType) {
                        store.set('twoFactor', result.twoFactorType);
                    }
                });
        }

        sequense = sequense.then(() => {
            if (store.get('twoFactor')) return;
            store.set('loginState', true);
        });

        return sequense;
    };

const loginU2F = () =>
    (store) => {
        let sequense = axios.get('/login/u2f');

        const response = { challenge: null, sig: null };

        sequense = sequense.then(({ data: signRequest }) => {
            response.challenge = signRequest;
            return u2fApi.sign(signRequest, u2fTimeout);
        });

        sequense = sequense.then((loginResponse) => {
            response.sig = loginResponse;
            return axios.post('/login/u2f', response);
        });

        sequense = sequense
            .then(() =>
                store.set('loginState', true))
            .catch((err) => {
                window.console.warn(err);
                store.set('u2fError', true);
            });

        return sequense;
    };


const loginOTP = (password) =>
    (store) => {
        let sequense = axios.post('/login/otp', { password });

        sequense = sequense.then(() =>
            store.set('loginState', true));

        return sequense;
    };


const logout = () =>
    () => {
        let sequense = axios.post('/logout', {});

        sequense = sequense
            .then(() => {
                window.location.reload();
            });

        return sequense;
    };

const checkLoginState = () =>
    (store) => {
        let sequense = u2fApi.isSupported();

        sequense = sequense.then((result) => {
            store.set('isU2FSupported', result);
            return axios.get('/loginstate', {});
        });

        sequense = sequense
            .then(() =>
                store.set('loginState', true))
            .catch(() => { });

        return sequense;
    };

const getUserInfo = () =>
    (store) => {
        let sequense = axios.get('/getuserinfo/');

        sequense = sequense
            .then(({ data: userinfo }) => {
                store.set('userinfo', userinfo);

                if (userinfo.twoFactorRegistered) {
                    store.set('viewState', viewStates.TWOFACTOR);
                } else {
                    store.set('viewState', viewStates.NO_TWOFACTOR);
                }
            })
            .catch(() => { });

        return sequense;
    };


const setLoginState = (loginState = false) =>
    (store) => {
        store.set('loginState', loginState);
        store.set('twoFactor', null);
    };

const startRegisterU2F = () =>
    (store) =>
        store.set('viewState', viewStates.U2F_REGISTER);


const registerU2F = () =>
    (store) => {
        let sequense = axios.get('/register/u2f');

        const response = { challenge: null, registerResponse: null };
        sequense = sequense.then(({ data: challenge }) => {
            response.challenge = challenge;
            return u2fApi.register(challenge, u2fTimeout);
        });


        sequense = sequense.then((result) => {
            response.registerResponse = result;
            return axios.post('/register/u2f', response);
        });


        sequense = sequense
            .then(() =>
                getUserInfo()(store))
            .catch((err) => {
                window.console.warn(err);
                store.set('u2fError', true);
            });


        return sequense;
    };


const startRegisterOTP = () =>
    (store) => {
        store.set('viewState', viewStates.OTP_REGISTER);
    };

const changeSecret = () =>
    (store) => {
        let sequense = axios.get('/register/otp');

        sequense = sequense.then(({ data: result }) => {
            store.set('otpSecret', result.otpSecret);
        });

        return sequense;
    };

const registerOTP = () =>
    (store) => {
        const secret = store.get('otpSecret');
        let sequense = axios.post('/register/otp', { otpSecret: secret });

        sequense = sequense.then(() =>
            getUserInfo()(store));

        return sequense;
    };


const unRegister = () =>
    (store) => {
        let sequense = axios.get('/unregister');

        sequense = sequense.then(() =>
            getUserInfo()(store));

        return sequense;
    };


export {
    checkLoginState, setLoginState,
    login, loginU2F, loginOTP, logout,
    getUserInfo,
    startRegisterU2F, registerU2F,
    startRegisterOTP, registerOTP,
    changeSecret,
    unRegister,
};
