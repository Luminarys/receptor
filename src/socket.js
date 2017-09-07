import { dispatch } from './store';
import { subscribe } from './actions/subscribe';

let ws;
let serial = 0;
let transactions = {};

export default function ws_send(type, body, callback = null) {
  const _serial = serial++;
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
  ws.send(msg);
  return _serial;
}

const handlers = {
  RESOURCES_EXTANT: msg => dispatch(subscribe(...msg.ids)),
  UPDATE_RESOURCES: msg => dispatch(msg)
};

function ws_recv(e) {
  const msg = JSON.parse(e.data);
  console.log("<-", msg.type, msg);
  const cb = transactions[msg.serial];
  cb && cb(msg);
  const handler = handlers[msg.type];
  handler && handler(msg);
}

export function ws_init(uri, cb) {
  ws = new WebSocket(uri);
  ws.addEventListener("open", cb);
  ws.addEventListener("message", ws_recv);
  ws.addEventListener("close", () => console.log("ws closed"));
}
