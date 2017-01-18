import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators, createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { ReduxAsyncConnect, reducer as reduxAsyncConnect, asyncConnect } from 'redux-async-connect';
import { connect, Provider } from 'react-redux';
import ReactRouter, { replace, routerMiddleware, syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { hashHistory, Router, Route } from 'react-router';

function reducer(state = {}, action) {
    switch (action.type) {
        case 'action': {
            return {
                ...state,
                thing: new Date()
            };
        }
        default: {
            return state;
        }
    }
}

function setThing() {
    return { type: 'action' };
}

function replaceRoute() {
    return (dispatch) => {
        dispatch(replace('/'));
    };
}

function dispatchMiddleware({ dispatch, getState }) {
    return next => (action) => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        return next(action);
    };
}

const routeMiddleware = routerMiddleware(hashHistory);
const store = createStore(
    combineReducers({
        routing: routerReducer,
        reduxAsyncConnect,
        reducer
    }),
    applyMiddleware(routeMiddleware, dispatchMiddleware)
);

@asyncConnect([{
    promise: ({ params, store: { dispatch, getState } }) => {
        console.log('async connect starting');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                dispatch(setThing());
                resolve();
            }, 500);
        }).then(() => {
            console.log('async connect finishing');
        });
    }
}])
@connect(
    (state, ownProps) => ({
        thing: state.reducer.thing
    }),
    dispatch => bindActionCreators({ replaceRoute }, dispatch)
)
class Main extends Component {
    render() {
        console.log('Main rendered');
        return (
            <div
                onClick={this.props.replaceRoute}
            >
                Hi
            </div>
        );
    }
}

const app = document.getElementById('app');
ReactDOM.render(
    (<Provider store={store}>
        <Router history={hashHistory} render={props => <ReduxAsyncConnect {...props} />}>
            <Route path="/" component={Main} />
        </Router>
    </Provider>
), app);

