import { SOCKET_CONNECTED, SOCKET_DISCONNECTED } from '../actions/socket';

export default function socket(state = { connected: false }, action) {
  switch (action.type) {
    case SOCKET_CONNECTED:
      return { ...state, connected: true };
    case SOCKET_DISCONNECTED:
      return { ...state, connected: false };
    default:
      return state;
  }
}
