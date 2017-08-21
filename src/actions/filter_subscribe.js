import ws_send from '../socket';

export const FILTER_SUBSCRIBE = 'FILTER_SUBSCRIBE';
export const FILTER_UNSUBSCRIBE = 'FILTER_UNSUBSCRIBE';

export function filter_subscribe(kind='torrent', criteria=[]) {
  return dispatch => {
    const serial = ws_send(FILTER_SUBSCRIBE, { criteria, kind });
    dispatch({ type: FILTER_SUBSCRIBE, serial });
  };
}

export function filter_unsubscribe(serial) {
  return dispatch => {
    ws_send(FILTER_UNSUBSCRIBE, { serial });
    dispatch({ type: FILTER_UNSUBSCRIBE, serial });
  };
}
