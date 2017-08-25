import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

function formatBitrate(bitrate) {
  if (bitrate > 1000000000) {
    return `${(bitrate / 1000000000).toFixed(2)} Gb/s`;
  } else if (bitrate > 1000000) {
    return `${(bitrate / 1000000).toFixed(2)} Mb/s`;
  } else if (bitrate > 1000) {
    return `${(bitrate / 1000).toFixed(2)} Kb/s`;
  } else {
    return `${bitrate} b/s`;
  }
}

function activeTorrents(router) {
  const { pathname } = router.location;
  if (pathname.indexOf("/torrents/") !== 0) {
    return [];
  } else {
    return pathname.slice("/torrents/".length).split(",");
  }
}

const EXCLUSIVE = 1, UNION = 2, SUBTRACT = 3;

function selectTorrent(dispatch, t, router, action = UNION) {
  let active = activeTorrents(router);
  switch (action) {
    case EXCLUSIVE:
      active = [t.id];
      break;
    case UNION:
      if (active.indexOf(t.id) === -1) {
        active = [...active, t.id];
      }
      break;
    case SUBTRACT:
      if (active.indexOf(t.id) !== -1) {
        active = active.filter(a => a != t.id);
      }
      break;
  }
  const url = active.length === 0 ? "/" : `/torrents/${active.join(',')}`;
  if (url !== router.location) {
    dispatch(push(url));
  }
}

class TorrentTable extends Component {
  render() {
    const { torrents, router, dispatch } = this.props;
    const active = activeTorrents(router);
    return (
      <table className="table">
        <thead>
          <tr>
            <th style={{width: "1px"}}></th>
            <th>name</th>
            <th>up</th>
            <th>down</th>
            <th>ratio</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(torrents).map(t =>
            <tr
              key={t.id}
              className={`torrent ${
                t.status
              } ${
                active.indexOf(t.id) !== -1 ? "selected" : ""
              }`}
              style={{
                backgroundSize: `${t.progress * 100}% 3px`
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={active.indexOf(t.id) !== -1}
                  onChange={e =>
                    selectTorrent(dispatch,
                      t, router, e.target.checked ? UNION : SUBTRACT)}
                />
              </td>
              <td>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    selectTorrent(dispatch, t, router, EXCLUSIVE);
                  }}
                >
                  {t.name}
                </a>
              </td>
              <td>{formatBitrate(t.rate_up)}</td>
              <td>{formatBitrate(t.rate_down)}</td>
              <td>{(t.transferred_up / t.transferred_down).toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default connect(state => ({
  torrents: state.torrents,
  router: state.router
}))(TorrentTable);
