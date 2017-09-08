export const SOCKET_STATE = {
  CONNECTED: "SOCKET_CONNECTED",
  CONNECTING: "SOCKET_CONNECTING",
  DISCONNECTED: "SOCKET_DISCONNECTED"
};

export const SOCKET_UPDATE = "SOCKET_UPDATE";

export const socket_update = (state, reason=null) =>
  ({ type: SOCKET_UPDATE, state, reason });
