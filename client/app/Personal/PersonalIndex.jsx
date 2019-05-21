import React from 'react';
import PropTypes from 'prop-types';

import PersonalTwoFactor from './PersonalTwoFactor';
import PersonalInfo from './PersonalInfo';

import { withStore } from '../store';
import { getUserInfo as getUserInfoAction } from '../actions';

class PersonalIndex extends React.Component {
    static propTypes = {
        getUserInfo: PropTypes.func.isRequired,
        userinfo: PropTypes.shape(),
    }

    static defaultProps = { userinfo: null }

    componentDidMount() {
        const { getUserInfo } = this.props;
        getUserInfo();
    }

    render() {
        const { userinfo } = this.props;

        if (!userinfo) return null;
        return (
            <PersonalInfo>
                <PersonalTwoFactor />
            </PersonalInfo>
        );
    }
}

const mapState = (store) =>
    ({ userinfo: store.get('userinfo') });

const mapActions = (dispatch) =>
    ({
        getUserInfo: () =>
            dispatch(getUserInfoAction()),
    });

export default withStore(mapState, mapActions)(PersonalIndex);
