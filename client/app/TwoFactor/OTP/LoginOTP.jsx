import React from 'react';
import PropTypes from 'prop-types';
import Transition from '../../Transition';

import { withStore } from '../../store';
import { loginOTP } from '../../actions';

class LoginOTP extends React.Component {
    static propTypes = { loginOTP: PropTypes.func.isRequired }

    state =
        {
            password: { value: 'password' },
            error: null,
        }

    onSubmit = (e) => {
        e.preventDefault();
        const { loginOTP: login } = this.props;
        const { password } = this.state;
        login(password.value)
            .catch(() => {
                this.setState({ error: 'Не удалось проверить одноразовый пароль' });
            });
    }

    handleInputChange = ({ target: { name, value } }) => {
        this.setState({ [name]: { value: value }, error: null });
    }


    render() {
        const { error } = this.state;
        return (
            <Transition>
                <div className="background">
                    <div className="login-area">
                        <form className="w-100" onSubmit={this.onSubmit}>
                            <p className="heading-large">
                                Двухфакторная аутентификация
                            </p>
                            <p className="heading-small">
                                Используйте одноразовый пароль, чтобы войти в кабинет, для этого:
                            </p>
                            <div className="bg__input d-flex flex-row justify-content-between align-items-center w-100">
                                <span>
                                    Подключите Рутокен
                                    <br />
                                    OTP к компьютеру
                                </span>
                                <span className="font-large p-1">
                                    →
                                </span>
                                <span>
                                    Нажмите на сенсорную
                                    <br />
                                    кнопку Рутокен OTP
                                </span>
                            </div>
                            <div className="bg__input">
                                <input
                                    name="password"
                                    id="password"
                                    type="text"
                                    className=""
                                    placeholder="Одноразовый пароль"
                                    onChange={this.handleInputChange}
                                    autoFocus
                                    maxLength={6}
                                />
                            </div>
                            <div className="bg__input">
                                <button type="submit" className="bg__savebutton">
                                    Проверить одноразовый пароль и войти
                                </button>
                            </div>
                            <div className="bg__input footer">
                                {
                                    error ? <span>{error}</span> : <span />
                                }
                            </div>
                        </form>
                        <div className="w-100">
                            <div className="otp_bg" />
                        </div>
                    </div>
                </div>
                <div className="text-align-center mt-1">
                    <span className="styled heading-large">
                        ←
                        <a href="/">Назад</a>
                    </span>
                </div>
            </Transition>
        );
    }
}

const mapActions = (dispatch) =>
    ({
        loginOTP: (password) =>
            dispatch(loginOTP(password)),
    });

export default withStore(null, mapActions)(LoginOTP);
