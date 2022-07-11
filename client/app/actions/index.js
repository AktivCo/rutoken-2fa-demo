
import axios from 'axios';
import viewStates from '../PersonalViewStates';
import base64url from '../base64url-front';

const u2fTimeout = 60;

const publicKeyCredentialToJSON = (pubKeyCred) => {
    /* eslint-disable */

    if (pubKeyCred instanceof Array) {
        let arr = [];
        for (let i of pubKeyCred) {
            arr.push(publicKeyCredentialToJSON(i));
        }
        return arr;
    }

    if (pubKeyCred instanceof ArrayBuffer) {
        return base64url.encode(pubKeyCred);
    }

    if (pubKeyCred instanceof Object) {
        let obj = {};

        for (const key in pubKeyCred) {
            obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
        }

        return obj;
    }
    /* eslint-enable */
    return pubKeyCred;
};


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

        if (store.get('isU2FSupported')) {
            sequense = sequense.then(({ data: signRequest }) => {
                const publicKey = {
                    challenge: Uint8Array.from(
                        signRequest.challenge, (c) => c.charCodeAt(0),
                    ),
                    allowCredentials: [{
                        id: base64url.decode(signRequest.keyHandle),
                        type: 'public-key',
                    }],
                    timeout: u2fTimeout * 1000,
                };

                return navigator.credentials.get({ publicKey });
            });

            sequense = sequense.then((result) => {
                const credentials = publicKeyCredentialToJSON(result);
                return axios.post('/login/u2f', credentials);
            });
        }

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
        let sequense = Promise.resolve();

        sequense = sequense.then(() => {
            store.set('isU2FSupported', !!window.PublicKeyCredential);

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
        const user = store.get('userinfo');

        let sequense = axios.get('/register/u2f');

        sequense = sequense.then(({ data }) => {
            const { challenge, appId } = data;

            const publicKeyCredentialCreationOptions = {
                challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
                rp: {
                    name: 'Rutoken',
                    id: appId,
                },
                user: {
                    id: Uint8Array.from(user.username, (c) => c.charCodeAt(0)),
                    name: user.username,
                    displayName: user.username,
                },
                pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
                authenticatorSelection: { authenticatorAttachment: 'cross-platform' },
                timeout: 60000,
                attestation: 'direct',
            };

            const opts = { publicKey: publicKeyCredentialCreationOptions };
            return navigator.credentials.create(opts);
        });

        sequense = sequense.then((result) => {
            const credential = publicKeyCredentialToJSON(result);
            return axios.post('/register/u2f', credential);
        });


        sequense = sequense
            .then(() =>
                getUserInfo()(store))
            .catch((err) => {
                window.console.log(err);
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
