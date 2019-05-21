import React from 'react';
import PropTypes from 'prop-types';

import { withStore } from '../store';
import { startRegisterU2F as startRegisterU2FAction, startRegisterOTP as startRegisterOTPAction } from '../actions';

const PersonalNoTwoFactor = ({ startRegisterU2F, startRegisterOTP, isU2FSupported }) =>
    (
        <div className="background">
            <p className="heading-large text-align-center">
                Включение защиты учетной записи вторым фактором
            </p>
            <p className="heading-small text-align-center">
                <span className="icon_done" />
                Ваша учетная запись успешно создана,
                осталось защитить ее вторым фактором
            </p>
            <div className="userinfo-area">
                <div className="userinfo-area-item">
                    <div className="u2f_single" />
                    <button type="button" className="bg__savebutton" onClick={startRegisterU2F}>
                        Защитить с Рутокен U2F
                    </button>
                    {
                        !isU2FSupported
                        && (
                            <div className="overlay">
                                <div className="unsupportedBrowser">
                                    <p className="bold">
                                        Рутокен U2F не работает в вашем браузере
                                    </p>
                                    <p className="bold">
                                        Но работает в:&nbsp;
                                        <a className="styled">Mozilla FireFox</a>
                                        ,&nbsp;
                                        <a className="styled">Google Chrome</a>
                                        &nbsp;и&nbsp;
                                        <a className="styled">Opera</a>
                                    </p>
                                    <p>
                                        <a href=" https://dev.rutoken.ru/display/KB/RU1068" className="styled" target="__blank">
                                            Возможно,  Mozilla Firefox не настроен
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="userinfo-area-item">
                    <div className="otp_single" />
                    <button type="button" className="bg__savebutton" onClick={startRegisterOTP}>
                        Защитить с Рутокен OTP
                    </button>
                </div>
            </div>
        </div>
    );


const mapState = (store) =>
    ({ isU2FSupported: store.get('isU2FSupported') });

const mapActions = (dispatch) =>
    ({
        startRegisterU2F: () =>
            dispatch(startRegisterU2FAction()),
        startRegisterOTP: () =>
            dispatch(startRegisterOTPAction()),
    });

PersonalNoTwoFactor.propTypes = {
    startRegisterU2F: PropTypes.func.isRequired,
    startRegisterOTP: PropTypes.func.isRequired,
    isU2FSupported: PropTypes.bool.isRequired,
};

export default withStore(mapState, mapActions)(PersonalNoTwoFactor);
