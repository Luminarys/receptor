import { filter_subscribe, filter_unsubscribe } from './filter_subscribe';
import { unsubscribe } from './subscribe';
import { push } from 'react-router-redux';

export const UNION = 'UNION';
export const SUBTRACT = 'SUBTRACT';
export const EXCLUSIVE = 'EXCLUSIVE';
export const NONE = 'NONE';

Set.prototype.difference = function(set) {
  var diff = new Set(this);
  for (var v of set) {
    diff.delete(v);
  }
  return diff;
}

export default function selectTorrent(id, action) {
  return (dispatch, getState) => {
    const previous = new Set(getState().selection);
    dispatch({ type: action, id });

    const state = getState();
    const next = new Set(state.selection);
    const filter_subscriptions = state.filter_subscribe;
    const subscriptions = state.subscribe;
    const { peers, files, pieces, trackers } = state;

    const added = next.difference(previous);
    const removed = previous.difference(next);

    added.forEach(t => {
      const criteria = [
        { field: "torrent_id", op: "==", value: id }
      ];
      dispatch(filter_subscribe("peer", criteria));
      dispatch(filter_subscribe("file", criteria));
      dispatch(filter_subscribe("piece", criteria));
      dispatch(filter_subscribe("tracker", criteria));
    });

    removed.forEach(t => {
      /* Remove filter subscriptions */
      const serials = filter_subscriptions
        .filter(sub => sub.criteria[0] && sub.criteria[0].value === t)
        .map(sub => sub.serial);
      serials.forEach(serial => dispatch(filter_unsubscribe(serial)));
      /* Remove resource subscriptions */
      const ids = [
        ...Object.values(files)
          .filter(file => file.torrent_id === t)
          .map(file => file.id)
        //...Object.values(peers)
        //  .filter(peer => peer.torrent_id === t)
        //  .map(peer => peer.id),
        //...Object.values(trackers)
        //  .filter(tracker => tracker.torrent_id === t)
        //  .map(tracker => tracker.id),
        //...Object.values(pieces)
        //  .filter(piece => piece.torrent_id === t)
        //  .map(piece => piece.id),
      ];
      if (ids.length > 0) {
        dispatch(unsubscribe(...ids));
      }
    });

    const url_torrents = state.selection.slice(0, 3);
    if (url_torrents.length > 0) {
      dispatch(push(`/torrents/${url_torrents}`));
    } else {
      dispatch(push("/"));
    }
  };
}
