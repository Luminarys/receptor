import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import 'preact/devtools';
import './polyfills';

import store, { create, history } from './store';
import scss from '../scss/main.scss';
import { ws_init } from './socket';
import { filter_subscribe } from './actions/filter_subscribe';
import { socket_uri, socket_update, SOCKET_STATE } from './actions/socket';

import Nav from './ui/navigation';
import Main from './ui/main';
import Connection from './ui/connection';

let skip_init = false;

export function initialize(uri) {
  if (skip_init) {
    skip_init = false;
    return;
  }
  store.dispatch(socket_uri(uri));
  store.dispatch(socket_update(SOCKET_STATE.CONNECTING));
  ws_init(uri, () => {
    store.dispatch(socket_update(SOCKET_STATE.CONNECTED));
    store.dispatch(filter_subscribe());
    store.dispatch(filter_subscribe('server'));
  }, () => {
    store.dispatch(socket_update(SOCKET_STATE.DISCONNECTED,
      "You were disconnected."));
  });
}

const render = main =>
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Nav />
          <div className="container-fluid">
            {main}
          </div>
        </div>
      </ConnectedRouter>
    </Provider>, document.getElementById('root'));

render(<Main />);

if (module.hot) {
  module.hot.accept('./ui/main.js', () => {
   const NextMain = require('./ui/main.js').default;
   skip_init = true;
   render(<NextMain />, document.getElementById('react-root'));
  });
}

navigator.registerProtocolHandler("magnet",
  window.location.origin + "/add-torrent/%s",
  "Open magnet link with receptor");

Notification && Notification.requestPermission();
