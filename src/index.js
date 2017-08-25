import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'preact/devtools';

import store, { history } from './store';
import scss from '../scss/main.scss';
import { ws_init } from './socket';
import { filter_subscribe } from './actions/filter_subscribe';

import Nav from './ui/navigation';
import Main from './ui/main';
import Connection from './ui/connection';

const root = document.getElementById('root');
ReactDOM.render(<Connection />, root);

ws_init(() => {
  store.dispatch(filter_subscribe());
  store.dispatch(filter_subscribe('server'));
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Nav />
          <div className="container">
            <Main />
          </div>
        </div>
      </ConnectedRouter>
    </Provider>, root);
});
