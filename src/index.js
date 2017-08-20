import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import scss from '../scss/base.scss';

render(
  <Provider store={store}>
    <h1>
      Hello world!
    </h1>
  </Provider>,
  document.getElementById('root')
);
