import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import scss from '../scss/main.scss';
import { ws_init } from './socket';
import { filter_subscribe } from './actions/filter_subscribe';

import Nav from './ui/navigation';
import Main from './ui/main';

ws_init(() => {
  store.dispatch(filter_subscribe());
  store.dispatch(filter_subscribe('server'));
});

render(
  <Provider store={store}>
    <div>
      <Nav />
      <div className="container">
        <Main />
      </div>
    </div>
  </Provider>,
  document.getElementById('root')
);
