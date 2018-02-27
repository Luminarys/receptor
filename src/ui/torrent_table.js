import React, { Component } from 'react';
import { connect } from 'react-redux';
import selectTorrent, { UNION, SUBTRACT, EXCLUSIVE } from '../actions/selection';
import { formatBitrate } from '../bitrate';
import Ratio from './ratio';
import TorrentProgress from './torrent_progress';

const name_style = {
  maxWidth: `${window.innerWidth * 0.25}px`,
  textOverflow: 'ellipsis',
  overflowX: 'hidden',
  whiteSpace: 'nowrap'
};

class _Torrent extends Component {
  shouldComponentUpdate(nextProps, _) {
    const { selection, torrent } = this.props;
    const nt = nextProps.torrent;
    const active = selection.indexOf(torrent.id);
    const nActive = nextProps.selection.indexOf(torrent.id);
    return active !== nActive || torrent !== nt;
  }

  render() {
    const { dispatch, selection, torrent } = this.props;
    const t = torrent;
    return (
      <tr
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
        <td style={name_style}>
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
    );
  }
}

const Torrent = connect((state, props) => {
  return {
    torrent: state.torrents[props.id],
    selection: state.selection,
  };
})(_Torrent);

class TorrentTable extends Component {
  render() {
    const { selection, torrents, dispatch } = this.props;
    return (
      <table className="table torrents">
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
            <th style={name_style}>name</th>
            <th style={{ minWidth: '75px' }}>up</th>
            <th style={{ minWidth: '75px' }}>down</th>
            <th style={{width: "18rem"}}>
              <span className="ratio">
                <span>ratio</span>
                <span></span>
                <span></span>
              </span>
            </th>
            <th>progress</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(torrents).slice().sort((a, b) => a.name.localeCompare(b.name)).map(t =>
            <Torrent
              dispatch={dispatch}
              id={t.id}
              key={t.id}
            />
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
