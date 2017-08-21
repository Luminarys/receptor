import ws_send from '../socket';

export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';

export function subscribe(...ids) {
  return dispatch => {
    const serial = ws_send(SUBSCRIBE, { ids });
    dispatch({
      type: SUBSCRIBE,
      serial,
      ids
    });
  };
}

export function unsubscribe(...ids) {
  return dispatch => {
    ws_send(UNSUBSCRIBE, { ids });
    dispatch({
      type: UNSUBSCRIBE,
      ids
    });
  };
}
