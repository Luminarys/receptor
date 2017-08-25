import React, { Component } from 'react';
import { connect } from 'react-redux';
import { activeTorrents, selectTorrent, selectop } from '../torrent_state';
import { formatBitrate } from '../bitrate';

class TorrentTable extends Component {
  render() {
    const { torrents } = this.props;
    const active = activeTorrents();
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
              className={`torrent progress-row ${
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
                    selectTorrent(t,
                      e.target.checked ? selectop.UNION : selectop.SUBTRACT)}
                />
              </td>
              <td>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    selectTorrent(t, selectop.EXCLUSIVE);
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
