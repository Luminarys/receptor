import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import scss from '../scss/base.scss';
import { ws_init } from './socket';
import { filter_subscribe } from './actions/filter_subscribe';

ws_init(() => {
  store.dispatch(filter_subscribe());
  store.dispatch(filter_subscribe('server'));
});

render(
  <Provider store={store}>
    <h1>
      Hello world!
    </h1>
  </Provider>,
  document.getElementById('root')
);
