import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Transition = ({ children }) =>
    (
        <ReactCSSTransitionGroup
            transitionName="example"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
        >
            {children}
        </ReactCSSTransitionGroup>
    );

export default Transition;

Transition.propTypes = { children: PropTypes.node.isRequired };
