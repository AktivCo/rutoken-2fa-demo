import React from 'react';
import PropTypes from 'prop-types';

import { withStore } from '../store';
import { unRegister as unRegisterAction, logout as logoutAction } from '../actions';


const TwoFactorInfo = ({ userinfo, logout, unRegister }) => {
    let stateMessage = '';

    if (userinfo.twoFactorRegistered) {
        stateMessage = `Ваша учетная запись защищена вторым фактором - Рутокен ${userinfo.twoFactorRegistered}`;
    } else if (userinfo.twoFactorType) {
        stateMessage = `Вы вошли с помощью второго фактора - Рутокен ${userinfo.twoFactorType}`;
    }

    return (
        <div>
            <div className="background">
                <p className="heading-small text-align-center">
                    <span className="icon_done" />
                    {stateMessage}
                </p>
                <div className="userinfo-loginned">
                    <button type="button" className="bg__savebutton" onClick={logout}>
                        Выйти и войти с использованием второго фактора
                    </button>
                    <a className="styled" onClick={unRegister} role="button" tabIndex={0}>
                        Отключить защиту вторым фактором
                    </a>
                </div>
            </div>
        </div>
    );
};

const mapState = (store) =>
    ({ userinfo: store.get('userinfo') });

const mapActions = (dispatch) =>
    ({
        logout: () =>
            dispatch(logoutAction()),
        unRegister: () =>
            dispatch(unRegisterAction()),
    });

export default withStore(mapState, mapActions)(TwoFactorInfo);

TwoFactorInfo.propTypes = {
    userinfo: PropTypes.shape().isRequired,
    logout: PropTypes.func.isRequired,
    unRegister: PropTypes.func.isRequired,
};
