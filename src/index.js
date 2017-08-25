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

ws_init(() => {
  store.dispatch(filter_subscribe());
  store.dispatch(filter_subscribe('server'));
});

const render = App => ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Nav />
        <div className="container">
          <App />
        </div>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'));

render(Main);

if (module.hot) {
  module.hot.accept('./ui/main', () => render(Main));
}
