import { filter_subscribe, filter_unsubscribe } from './actions/filter_subscribe';
import { push } from 'react-router-redux';
/* Listen pal, we're just gonna pretend this import isn't happening */
import { dispatch, getState } from './store';

export function activeTorrents() {
  const { pathname } = getState().router.location;
  if (pathname.indexOf("/torrents/") !== 0) {
    return [];
  } else {
    return pathname.slice("/torrents/".length).split(",");
  }
}

// TODO: invoke on page load for /torrents/:id
export function updateSubscriptions(added, removed) {
  if (added.length > 0) {
    added.forEach(t => {
      const criteria = [
        { field: "torrent_id", op: "==", value: t }
      ];
      dispatch(filter_subscribe("peer", criteria));
      dispatch(filter_subscribe("file", criteria));
      dispatch(filter_subscribe("piece", criteria));
      dispatch(filter_subscribe("tracker", criteria));
    });
  }
  if (removed.length > 0) {
    const subscriptions = getState().filter_subscribe;
    removed.forEach(t => {
      const serials = subscriptions
        .filter(sub => sub.criteria[0] && sub.criteria[0].value == t)
        .map(sub => sub.serial);
      serials.forEach(serial => dispatch(filter_unsubscribe(serial)));
    });
  }
}

export const selectop = {
  EXCLUSIVE: 1,
  UNION: 2,
  SUBTRACT: 3
};

export function selectTorrent(t, action = UNION) {
  let active = activeTorrents(getState().router);
  let removed = [], added = [];
  switch (action) {
    case selectop.EXCLUSIVE:
      removed = active.slice();
      active = [t.id];
      added = [t.id];
      break;
    case selectop.UNION:
      if (active.indexOf(t.id) === -1) {
        active = [...active, t.id];
        added = [t.id];
      }
      break;
    case selectop.SUBTRACT:
      if (active.indexOf(t.id) !== -1) {
        removed = [t.id];
        active = active.filter(a => a != t.id);
      }
      break;
  }
  const url = active.length === 0 ? "/" : `/torrents/${active.join(',')}`;
  if (url !== getState().router.location) {
    dispatch(push(url));
  }
  updateSubscriptions(added, removed);
}
