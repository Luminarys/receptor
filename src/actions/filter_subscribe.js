import ws_send from '../socket';

export const FILTER_SUBSCRIBE = 'FILTER_SUBSCRIBE';
export const FILTER_UNSUBSCRIBE = 'FILTER_UNSUBSCRIBE';

export function filter_subscribe(kind='torrent', criteria=[], _serial=null) {
  return dispatch => {
    const serial = ws_send(FILTER_SUBSCRIBE, { kind, criteria }, null, _serial);
    dispatch({ type: FILTER_SUBSCRIBE, serial, kind, criteria });
  };
}

export function filter_unsubscribe(serial) {
  return dispatch => {
    ws_send(FILTER_UNSUBSCRIBE, { filter_serial: serial });
    dispatch({ type: FILTER_UNSUBSCRIBE, serial });
  };
}
