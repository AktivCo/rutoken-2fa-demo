import React from 'react';
import PropTypes from 'prop-types';

import Transition from '../../Transition';
import { withStore } from '../../store';


class U2FCommon extends React.Component {
    static propTypes = {
        register: PropTypes.bool,
        u2fError: PropTypes.bool,
    };

    static defaultProps = { u2fError: null, register: null };

    state = { showInfo: false }

    showInfo = () => {
        const { showInfo } = this.state;
        this.setState({ showInfo: !showInfo });
    }

    render() {
        const { register, u2fError } = this.props;
        const { showInfo } = this.state;
        return (
            <Transition>
                <div className="background">
                    {
                        register
                            ? (
                                <p className="heading-large text-align-center">
                                    Добавление второго фактора для повышения безопасности учетной записи
                                </p>
                            )
                            : (
                                <React.Fragment>
                                    <p className="heading-large text-align-center">
                                        Двухфакторная аутентификация
                                    </p>
                                    <p className="heading-small text-align-center">
                                        Используйте ваш Рутокен U2F, чтобы войти в кабинет
                                    </p>
                                </React.Fragment>
                            )
                    }
                    <div className="factor-area">
                        <div className="factor-area-item">
                            <div className="u2f_connect" />
                            <p className="heading-small bold text-align-center">
                                Подключите Рутокен U2F
                                <br />
                                к компьютеру
                            </p>
                        </div>
                        <div className="factor-area-item arrow">
                            <span className="arrow" />
                        </div>
                        <div className="factor-area-item">
                            <div className="u2f_touch" />
                            <p className="heading-small bold text-align-center">
                                Когда светодиод начнет
                                <br />
                                мерцать &#8211; нажмите на него
                            </p>
                        </div>
                    </div>
                    {
                        (
                            u2fError
                            && (
                                <div className="overlay">
                                    <div className="info
                                        error d-flex flex-column justify-content-around align-items-center"
                                    >
                                        <h2>Что-то пошло не так</h2>
                                        <p>
                                            Не удается продолжить работу с токеном
                                        </p>
                                        <p>
                                            <a href="/" className="styled heading-large">Попробовать снова</a>
                                        </p>
                                    </div>
                                </div>
                            )
                        ) || (
                            showInfo
                            && (
                                <div className="overlay">
                                    <div className="info d-flex flex-column justify-content-around">
                                        <div>
                                            <h2 className="text-align-center">
                                                Мы не видим токен
                                            </h2>
                                            <p>
                                                Возможно, компьютер не настроен для работы с токенами стандарта U2F
                                            </p>
                                            <p>
                                                Проверьте, что:
                                            </p>
                                            <ul>
                                                <li>
                                                    <a
                                                        href="https://dev.rutoken.ru/display/KB/LN1003"
                                                        className="styled"
                                                        target="__blank"
                                                    >
                                                    Включено обнаружение Рутокен U2F в Linux
                                                    </a>
                                                </li>
                                                <li className="mt-1">
                                                    Браузер был перезапущен, если вносились настройки в браузер или ОС
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="text-align-center mt-1">
                                            <p>
                                                <a
                                                    className="styled heading-large"
                                                    onClick={this.showInfo}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    Понятно
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="text-align-center mt-1">
                    <a className="styled heading-large" onClick={this.showInfo} role="button" tabIndex={0}>
                        Почему Рутокен U2F не мерцает?
                    </a>
                    <br />
                    <span className="styled heading-large">
                        ←
                        <a href="/">Назад</a>
                    </span>
                </div>
            </Transition>
        );
    }
}

const mapState = (state) =>
    ({ u2fError: state.u2fError });

export default withStore(mapState)(U2FCommon);
