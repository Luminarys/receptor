import { SOCKET_STATE, SOCKET_UPDATE } from '../actions/socket';

export default function socket(_state = {
  state: SOCKET_STATE.DISCONNECTED,
  reason: null
}, action) {
  const { state, reason } = action;
  switch (action.type) {
    case SOCKET_UPDATE:
      return { ..._state, state, reason };
    default:
      return _state;
  }
}
