import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';
import Transition from '../Transition';

import { withStore } from '../store';

const PersonalInfo = ({ children, userinfo }) =>
    (
        <Transition>
            <div className="login-page">
                <h1>Личный кабинет</h1>
                <div className="userinfo">
                    <div className="userlogo" />
                    <p className="heading-small text-align-center bold">
                        {userinfo.username}
                    </p>
                    {
                        userinfo.registerDate
                        && (
                            <p className="heading-small text-align-center">
                                Зарегистрирован&nbsp;
                                <span className="bold">
                                    <FormattedDate
                                        value={userinfo.registerDate}
                                        day="numeric"
                                        month="long"
                                        year="numeric"
                                    />
                                    &nbsp;в&nbsp;
                                    <FormattedTime value={userinfo.registerDate} />
                                </span>
                            </p>
                        )
                    }
                    <p className="heading-small text-align-center">
                        {
                            userinfo && (
                                userinfo.twoFactorRegistered
                                    ? (
                                        <React.Fragment>
                                            <span>Защита учетной записи вторым фактором: </span>
                                            <span className="green bold">
                                                &nbsp;включена&nbsp;
                                                {`(${userinfo.twoFactorRegistered})`}
                                            </span>
                                        </React.Fragment>
                                    )
                                    : (
                                        <React.Fragment>
                                            <span>Защита учетной записи вторым фактором: </span>
                                            <span className="red bold">&nbsp;выключена</span>
                                        </React.Fragment>
                                    )
                            )
                        }
                    </p>
                </div>
                {children}
            </div>
        </Transition>
    );


PersonalInfo.propTypes = {
    children: PropTypes.node.isRequired,
    userinfo: PropTypes.shape().isRequired,
};

const mapState = (store) =>
    ({ userinfo: store.get('userinfo') });

export default withStore(mapState)(PersonalInfo);
