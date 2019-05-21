import React from 'react';
import PropTypes from 'prop-types';

import U2FCommon from './U2FCommon';
import { withStore } from '../../store';
import { loginU2F } from '../../actions';

class LoginU2F extends React.Component {
    static propTypes = { loginU2F: PropTypes.func.isRequired }

    componentDidMount() {
        const { loginU2F: login } = this.props;
        login();
    }

    render() {
        return <U2FCommon />;
    }
}

const mapActions = (dispatch) =>
    ({
        loginU2F: () =>
            dispatch(loginU2F()),
    });

export default withStore(null, mapActions)(LoginU2F);
