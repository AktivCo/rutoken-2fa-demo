import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { withStore } from './store';
import { setLoginState as setLoginStateAction, checkLoginState as checkLoginStateAction } from './actions';

import Auth from './auth/Auth';
import Personal from './Personal/PersonalIndex';

class CheckLogin extends Component {
    componentDidMount() {
        const { setLoginState, checkLoginState } = this.props;
        axios.interceptors.response.use(
            (response) =>
                response,
            (error) => {
                if (error.response.status === 403) setLoginState(false);
                return Promise.reject();
            },
        );

        checkLoginState();
    }

    render() {
        const { loginState } = this.props;
        if (loginState == null) return null;
        if (loginState) return <Personal />;
        return <Auth />;
    }
}

const mapState = (store) =>
    ({ loginState: store.get('loginState') });

const mapActions = (dispatch) =>
    ({
        setLoginState: (loginState) =>
            dispatch(setLoginStateAction(loginState)),
        checkLoginState: () =>
            dispatch(checkLoginStateAction()),
    });

CheckLogin.propTypes = {
    setLoginState: PropTypes.func.isRequired,
    checkLoginState: PropTypes.func.isRequired,
    loginState: PropTypes.bool,
};

CheckLogin.defaultProps = { loginState: null };

export default withStore(mapState, mapActions)(CheckLogin);
