
import React from 'react';
import PropTypes from 'prop-types';

import RegisterOTP from './OTP/RegisterOTP';
import LoginOTP from './OTP/LoginOTP';

import RegisterU2F from './U2F/RegisterU2F';
import LoginU2F from './U2F/LoginU2F';

const TwoFactorContainer = ({ type, register, login }) => {
    if (login && register) throw new Error('Component must be either login or register');
    if (!type) throw new Error('Two factor type must be specidied');

    if (type === 'U2F' && register) return <RegisterU2F />;
    if (type === 'U2F' && login) return <LoginU2F />;

    if (type === 'OTP' && register) return <RegisterOTP />;
    if (type === 'OTP' && login) return <LoginOTP />;

    return null;
};

TwoFactorContainer.propTypes = {
    type: PropTypes.string.isRequired,
    register: PropTypes.bool,
    login: PropTypes.bool,
};

TwoFactorContainer.defaultProps = {
    login: false,
    register: false,
};

export default TwoFactorContainer;
