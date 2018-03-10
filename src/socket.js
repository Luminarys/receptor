import { dispatch } from './store';
import { subscribe, unsubscribe } from './actions/subscribe';

let ws;
let serial = 0;
let transactions = {};
let connected = false;
let queue = [];

const getURI = ({ uri, password }) => `${uri}${password ?
  `?password=${encodeURIComponent(password)}` : ''}`;

export default function ws_send(type, body, callback = null, __serial = null) {
  const _serial = __serial !== null ? __serial : serial++;
  if (callback) {
    transactions[_serial] = callback;
  }
  const obj = {
    type,
    serial: _serial,
    ...body
  };
  const msg = JSON.stringify(obj);
  console.log("->", type, obj);
  if (!connected) {
    queue.push(msg);
  } else {
    ws.send(msg);
  }
  return _serial;
}

function _resources_removed(msg) {
  dispatch(unsubscribe(...msg.ids));
  dispatch(msg);
}

const handlers = {
  RESOURCES_EXTANT: msg => dispatch(subscribe(...msg.ids)),
  UPDATE_RESOURCES: msg => dispatch(msg),
  RESOURCES_REMOVED: msg => _resources_removed(msg),
};

function ws_recv(e) {
  const msg = JSON.parse(e.data);
  console.log("<-", msg.type, msg);
  const cb = transactions[msg.serial];
  cb && cb(msg);
  const handler = handlers[msg.type];
  handler && handler(msg);
}

export function ws_init(uri, open, close) {
  ws = new WebSocket(getURI(uri));
  ws.addEventListener("open", () => {
    connected = true;
    open.apply(this, arguments);
    while (queue.length > 0) {
      ws.send(queue.pop());
    }
  });
  ws.addEventListener("message", ws_recv);
  ws.addEventListener("close", () => {
    connected = false;
    close.apply(this, arguments);
  });
}

export function ws_disconnect() {
  ws.close();
}
