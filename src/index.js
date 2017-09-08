import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'preact/devtools';
import './polyfills';

import store, { history } from './store';
import scss from '../scss/main.scss';
import { ws_init } from './socket';
import { filter_subscribe } from './actions/filter_subscribe';
import { socket_connected, socket_disconnected } from './actions/socket';

import Nav from './ui/navigation';
import Main from './ui/main';
import Connection from './ui/connection';

export function initialize(uri) {
  ws_init(uri, () => {
    store.dispatch(socket_connected());
    store.dispatch(filter_subscribe());
    store.dispatch(filter_subscribe('server'));
  });
}

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
  </Provider>, document.getElementById('root'));

navigator.registerProtocolHandler("magnet",
  window.location.origin + "/add-torrent/%s",
  "Open magnet link with receptor");
