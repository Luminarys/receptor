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
  const msg = JSON.stringify({
    type,
    serial: _serial,
    ...body
  });
  console.log("->", msg);
  ws.send(msg);
  return _serial;
}

const handlers = {
  RESOURCES_EXTANT: msg => dispatch(subscribe(...msg.ids)),
  UPDATE_RESOURCES: msg => dispatch(msg)
};

function ws_recv(e) {
  const msg = JSON.parse(e.data);
  console.log("<-", msg);
  const cb = transactions[msg.serial];
  cb && cb(msg);
  const handler = handlers[msg.type];
  handler && handler(msg);
}

export function ws_init(cb) {
  ws = new WebSocket("ws://127.0.0.1:8412");
  ws.addEventListener("open", cb);
  ws.addEventListener("message", ws_recv);
  ws.addEventListener("close", () => console.log("ws closed"));
}
