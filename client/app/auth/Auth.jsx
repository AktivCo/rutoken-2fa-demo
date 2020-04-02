
import React from 'react';
import PropTypes from 'prop-types';
import Transition from '../Transition';

import { withStore } from '../store';

import Login from './Login';
import TwoFactor from '../TwoFactor';

const AuthRenderer = ({ twoFactorType }) =>
    (twoFactorType && <TwoFactor type={twoFactorType} login />) || <Login />;


const Auth = ({ twoFactorType }) =>
    (
        <Transition
            transitionName="example"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
        >
            <div className="login-page">
                <h1>Вход в личный кабинет</h1>
                <AuthRenderer twoFactorType={twoFactorType} />
            </div>
        </Transition>
    );


const mapState = (store) =>
    ({ twoFactorType: store.get('twoFactor') });


AuthRenderer.propTypes = { twoFactorType: PropTypes.string };
AuthRenderer.defaultProps = { twoFactorType: null };


Auth.propTypes = { twoFactorType: PropTypes.string };
Auth.defaultProps = { twoFactorType: null };

export default withStore(mapState)(Auth);
