
import React from 'react';
import PropTypes from 'prop-types';

import { withStore } from './store';
import { logout as logoutAction } from './actions';


const Header = ({ loginState, logout, children }) =>
    (
        <div className="container d-flex flex-column">
            <header className="d-flex flex-row justify-content-between">
                <div className="header__img">
                    <a><span className="img__logo" /></a>
                </div>
                <div className="header__menu">
                    <ul className="d-flex flex-row justify-content-end">
                        <li>
                            {
                                loginState && (
                                    <a
                                        onClick={() =>
                                            logout()}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        Выход
                                    </a>
                                )
                            }
                        </li>
                    </ul>
                </div>
            </header>
            <React.Fragment>
                {children}
            </React.Fragment>
        </div>
    );

const mapState = (store) =>
    ({ loginState: store.get('loginState') });

const mapActions = (dispatch) =>
    ({
        logout: () =>
            dispatch(logoutAction()),
    });

Header.propTypes = {
    loginState: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};
Header.defaultProps = { loginState: null };

export default withStore(mapState, mapActions)(Header);
