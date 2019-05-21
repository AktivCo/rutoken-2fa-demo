import React from 'react';
import PropTypes from 'prop-types';
import Transition from '../../Transition';

import { registerOTP as registerOtpAction, changeSecret as changeSecretAction } from '../../actions';
import { withStore } from '../../store';

const copyCommand = (secret) =>
    `rutoken-otp-personalize.exe -1 -o oath-hotp -a ${secret}`;

const copyToClipboard = (secret) => {
    const el = document.createElement('textarea');
    el.value = secret;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

class RegisterOTP extends React.Component {
    static propTypes = {
        changeSecret: PropTypes.func,
        registerOTP: PropTypes.func,
        otpSecret: PropTypes.string.isRequired,
    };

    static defaultProps = { changeSecret: null, registerOTP: null };

    componentDidMount() {
        const { changeSecret } = this.props;
        changeSecret();
    }

    render() {
        const { changeSecret, registerOTP, otpSecret } = this.props;
        if (!otpSecret) return null;

        return (
            <Transition>
                <div className="background">
                    <p className="heading-large text-align-center">
                        Добавление второго фактора для повышения безопасности учетной записи
                    </p>
                    <ol>
                        <li>
                            Подключите Рутокен OTP к компьютеру
                        </li>
                        <li>
                            <a href="https://download.rutoken.ru/Rutoken/Utilites/rutoken-otp.zip" className="styled">
                                Скачайте утилиту  управления токеном
                            </a>
                        </li>
                        <li>
                            Распакуйте zip-архив, запустите из командной строки утилиту с параметрами:
                            <p>
                                {copyCommand(otpSecret)}
                            </p>
                            <div className="d-flex flex-row justify-content-start align-items-start mt-1">
                                <div>
                                    <span className="otp-copy" />
                                    <a
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            copyToClipboard(copyCommand(otpSecret))}
                                    >
                                        скопировать команду
                                    </a>
                                </div>
                                <div>
                                    <span className="otp-detailed" />
                                    <a
                                        href="https://www.rutoken.ru/download/manual/Rutoken_OTP_How_To_Use.pdf"
                                        target="__blank"
                                    >
                                        подробная инструкция
                                    </a>
                                </div>
                                <div>
                                    <span className="otp-refresh" />
                                    <a onClick={changeSecret} role="button" tabIndex={0}>
                                        новый ключ
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li>
                            Проверьте процесс генерации одноразовых паролей: поставьте курсор в поле ввода,
                            затем нажмите сенсорную кнопку на токене
                            <div className="bg__input">
                                <input
                                    name="login"
                                    id="login"
                                    type="text"
                                    className=""
                                    placeholder="Одноразовый пароль"
                                    maxLength={6}
                                />
                            </div>
                        </li>
                        <li>
                            Если в поле появился одноразовый пароль &#8211; устройство готово
                        </li>
                    </ol>
                    <div className="userinfo-loginned">
                        <button type="button" className="bg__savebutton" onClick={registerOTP}>
                            Защитить с Рутокен OTP
                        </button>
                    </div>
                </div>
            </Transition>
        );
    }
}


const mapState = (store) =>
    ({ otpSecret: store.get('otpSecret') });

const mapActions = (dispatch) =>
    ({
        registerOTP: () =>
            dispatch(registerOtpAction()),
        changeSecret: () =>
            dispatch(changeSecretAction()),
    });

export default withStore(mapState, mapActions)(RegisterOTP);
