import React from 'react';
import PropTypes from 'prop-types';
import { withStore } from '../store';
import { login } from '../actions';

class Login extends React.Component {
    static propTypes = { login: PropTypes.func.isRequired };

    state =
        {
            register: false,
            userName: { value: '' },
            password: { value: 'password' },
            error: null,
        };

    onSubmit = (e) => {
        e.preventDefault();
        const { login: loginAction } = this.props;
        const { userName, password, register } = this.state;

        loginAction(userName.value, password.value, register)
            .catch(() => {
                this.setState({
                    error: register
                        ? 'Произошла ошибка регистрации'
                        : 'Неправильный логин или пароль',
                });
            });
    };

    handleInputChange = ({ target: { name, value } }) => {
        this.setState({ [name]: { value: value }, error: null });
    }

    registerToggle = () => {
        const { register } = this.state;
        this.setState({ register: !register, error: null });
    }

    render() {
        const { register, error } = this.state;
        return (
            <div className="background">
                <div className="login-area">
                    <form className="w-100" onSubmit={this.onSubmit}>
                        <p className="heading-large">
                            {
                                register
                                    ? 'Создание учетной записи'
                                    : 'Вход в учетную запись'
                            }
                        </p>
                        <p className="heading-small">
                            {
                                register
                                    ? 'Добавить второй фактор можно будет внутри кабинета'
                                    : 'После ввода логина-пароля потребуется второй фактор, если вы включили защиту'
                            }
                        </p>
                        <div className="bg__input">
                            <input
                                name="userName"
                                id="userName"
                                type="text"
                                className=""
                                placeholder="Логин"
                                autoFocus
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="bg__input">
                            <input
                                name="password"
                                id="password"
                                type="password"
                                className=""
                                placeholder="Пароль"
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="bg__input">
                            <button type="submit" className="bg__savebutton">
                                {
                                    register
                                        ? 'Создать учетную запись'
                                        : 'Войти в учетную запись'
                                }
                            </button>
                        </div>
                        <div className="bg__input footer">
                            <a className="styled" onClick={this.registerToggle} role="button" tabIndex={0}>
                                {
                                    register
                                        ? 'У меня уже есть учетная запись'
                                        : 'У меня нет учетной записи'
                                }
                            </a>
                            {
                                error ? <span>{error}</span> : <span />
                            }
                        </div>
                    </form>
                    <div className="w-100">
                        <div className="u2f_otp_bg" />
                    </div>
                </div>
            </div>
        );
    }
}

const mapActions = (dispatch) =>
    ({
        login: (userName, password, register) =>
            dispatch(login(userName, password, register)),
    });

export default withStore(null, mapActions)(Login);
