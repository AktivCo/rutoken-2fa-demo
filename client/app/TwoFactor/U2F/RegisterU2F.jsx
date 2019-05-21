import React from 'react';
import PropTypes from 'prop-types';

import U2FCommon from './U2FCommon';
import { withStore } from '../../store';
import { registerU2F } from '../../actions';


class RegisterU2F extends React.Component {
    static propTypes = { registerU2F: PropTypes.func.isRequired }

    componentDidMount() {
        const { registerU2F: register } = this.props;
        register();
    }

    render() {
        return <U2FCommon register />;
    }
}

const mapActions = (dispatch) =>
    ({
        registerU2F: () =>
            dispatch(registerU2F()),
    });

export default withStore(null, mapActions)(RegisterU2F);
