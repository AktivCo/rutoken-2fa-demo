import React from 'react';
import PropTypes from 'prop-types';

import TwoFactorInfo from './TwoFactorInfo';
import PersonalNoTwoFactor from './PersonalNoTwoFactor';
import TwoFactor from '../TwoFactor';

import viewStates from '../PersonalViewStates';
import { withStore } from '../store';

const PersonalViewMap = {
    [viewStates.NO_TWOFACTOR]: <PersonalNoTwoFactor />,
    [viewStates.U2F_REGISTER]: <TwoFactor type="U2F" register />,
    [viewStates.OTP_REGISTER]: <TwoFactor type="OTP" register />,
    [viewStates.TWOFACTOR]: <TwoFactorInfo />,
};

const PersonalTwoFactor = ({ viewState }) => PersonalViewMap[viewState] || null;

const mapState = (store) =>
    ({ viewState: store.get('viewState') });

PersonalTwoFactor.propTypes = { viewState: PropTypes.number };

export default withStore(mapState, null)(PersonalTwoFactor);
