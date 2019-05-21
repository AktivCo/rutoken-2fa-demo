import React from 'react';

const StoreContext = React.createContext();

const createStore = (WrappedComponent) =>
    class extends React.Component {
        state = {
            get: (key) => {
                const state = { ...this.state };
                return state[key];
            },
            set: (key, value) => {
                const param = { [key]: value };
                this.setState(param);
            },
        };

        render() {
            return (
                <StoreContext.Provider value={this.state}>
                    <WrappedComponent {...this.props} />
                </StoreContext.Provider>
            );
        }
    };


const withStore = (mapState, mapActions) =>
    (WrappedComponent) =>
        class extends React.Component {
            render() {
                const dispatch = (state) =>
                    (func) =>
                        func(state);

                const disp = (context, tProps) => {
                    let props = { ...tProps };
                    if (mapActions) {
                        props = { ...props, ...mapActions(dispatch(context)) };
                    }
                    if (mapState) {
                        props = { ...props, ...mapState(context) };
                    }
                    return props;
                };

                return (
                    <StoreContext.Consumer>
                        {
                            (context) =>
                                <WrappedComponent {...disp(context, this.props)} />
                        }
                    </StoreContext.Consumer>
                );
            }
        };

export { createStore, withStore };
