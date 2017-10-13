import { SOCKET_STATE, SOCKET_UPDATE, SOCKET_URI } from '../actions/socket';

export default function socket(_state = {
  state: SOCKET_STATE.DISCONNECTED,
  reason: null,
  uri: null,
  password: null,
}, action) {
  const { state, reason, uri } = action;
  switch (action.type) {
    case SOCKET_UPDATE:
      return { ..._state, state, reason };
    case SOCKET_URI:
      return { ..._state, ...uri, };
    default:
      return _state;
  }
}
