import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { createHashHistory } from 'history';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from 'reducers';
import { routes } from 'utils';
import App from './app';

const history = createHashHistory();
const middleware = [thunk, routerMiddleware(history), createLogger({})];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;    // eslint-disable-line no-underscore-dangle
const store = createStore(
    combineReducers(Object.assign({}, reducers, { router: connectRouter(history) })),
    composeEnhancers(applyMiddleware(...middleware))
);

function getContainer(Component) {
    return (
        <AppContainer>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Component>
                        <Switch>
                            {routes.map((route) => (
                                <Route
                                    key={route.path}
                                    exact={route.path === '/'}
                                    path={route.path}
                                    component={route.Component}
                                />
                            ))}
                            <Route render={() => <Redirect to="/" />}/>
                        </Switch>
                    </Component>
                </ConnectedRouter>
            </Provider>
        </AppContainer>
    );
}

render(getContainer(App), document.querySelector('#app'));

if (module.hot) {
    module.hot.accept('./app', () => {
        const App = require('./app').default;
        render(getContainer(App), document.querySelector('#app'));
    });
}
