import React, { Component } from 'react';
import { connect } from 'react-redux';
import selectTorrent, { UNION, SUBTRACT, EXCLUSIVE } from '../actions/selection';
import { formatBitrate } from '../bitrate';
import Ratio from './ratio';
import TorrentProgress from './torrent_progress';

class TorrentTable extends Component {
  render() {
    const { selection, torrents, dispatch } = this.props;
    return (
      <table className="table">
        <thead>
          <tr>
            <th style={{width: "1px"}}>
              <input
                type="checkbox"
                checked={selection.length === Object.values(torrents).length}
                onChange={e => {
                  if (selection.length > 0) {
                    dispatch(selectTorrent([], EXCLUSIVE));
                  } else {
                    dispatch(selectTorrent(Object.keys(torrents), EXCLUSIVE));
                  }
                }}
              />
            </th>
            <th>name</th>
            <th>up</th>
            <th>down</th>
            <th>ratio</th>
            <th>progress</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(torrents).map(t =>
            <tr
              key={t.id}
              className={`torrent ${
                t.status
              } ${
                selection.indexOf(t.id) !== -1 ? "selected" : ""
              }`}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selection.indexOf(t.id) !== -1}
                  onChange={e =>
                    dispatch(selectTorrent([t.id], e.target.checked ? UNION : SUBTRACT))
                  }
                />
              </td>
              <td>
                <a
                  href={`/torrents/${t.id}`}
                  onClick={e => {
                    e.preventDefault();
                    dispatch(selectTorrent([t.id], EXCLUSIVE));
                  }}
                >{t.name}</a>
              </td>
              <td>{formatBitrate(t.rate_up)}</td>
              <td>{formatBitrate(t.rate_down)}</td>
              <td><Ratio up={t.transferred_up} down={t.transferred_down} /></td>
              <td><TorrentProgress torrent={t} /></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default connect(state => ({
  torrents: state.torrents,
  selection: state.selection,
  router: state.router
}))(TorrentTable);
