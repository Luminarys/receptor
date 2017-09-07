export const SOCKET_CONNECTED = "SOCKET_CONNECTED";
export const SOCKET_DISCONNECTED = "SOCKET_DISCONNECTED";

export const socket_connected = () => ({ type: SOCKET_CONNECTED });
export const socket_disconnected = () => ({ type: SOCKET_DISCONNECTED });
