export const SOCKET_STATE = {
  CONNECTED: "SOCKET_CONNECTED",
  CONNECTING: "SOCKET_CONNECTING",
  DISCONNECTED: "SOCKET_DISCONNECTED"
};

export const SOCKET_UPDATE = "SOCKET_UPDATE";
export const SOCKET_URI = "SOCKET_URI";

export const socket_update = (state, reason=null) =>
  ({ type: SOCKET_UPDATE, state, reason });

export const socket_uri = uri => ({ type: SOCKET_URI, uri });
