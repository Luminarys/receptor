import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import selectTorrent, { UNION, SUBTRACT, EXCLUSIVE } from '../actions/selection';
import { formatBitrate, formatAmount } from '../bitrate';
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
    const up = t.transferred_up;
    const down = t.transferred_down;
    const ratio = up / down;
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
        <td>{isFinite(ratio) ? `${ratio.toFixed(2)}` : "∞"}</td>
        <td>{formatAmount(up)}</td>
        <td>{formatAmount(down)}</td>
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

const comparators = {
  "name": (a, b) => a.name.localeCompare(b.name),
  "up": (a, b) => a.up - b.up,
  "down": (a, b) => a.down - b.down,
  "ul": (a, b) => a.transferred_up - b.transferred_up,
  "dl": (a, b) => a.transferred_down - b.transferred_down,
  "ratio": (a, b) => {
    const ratioA = a.transferred_up/a.transferred_down;
    const ratioB = b.transferred_up/b.transferred_down;
    if (!isFinite(ratioA - ratioB)) {
      return !isFinite(ratioA) ? 1 : -1;
    } else {
      return ratioA - ratioB;
    }
  },
  "progress": (a, b) => a.progress - b.progress,
}

class TorrentTable extends Component {
  constructor() {
    super();
    this.state = {
      sortBy: "name",
      sortAsc: true,
    };
  }

  updateSort(column) {
    if (column === this.state.sortBy) {
      this.setState({ sortBy: column, sortAsc: !this.state.sortAsc});
    } else {
      this.setState({ sortBy: column, sortAsc: this.state.sortAsc});
    }
  }

  render() {
    const { selection, torrents, dispatch } = this.props;
    const { sortBy, sortAsc } = this.state;

    const comparator = (a, b) => comparators[sortBy](a, b) * (sortAsc ? 1 : -1);
    const arrowStyle = { marginLeft: "5px", marginRight: "5px" };
    const sortArrow = sortAsc === true
      ? <FontAwesome name="angle-up" style={arrowStyle} />
      : <FontAwesome name="angle-down" style={arrowStyle} />;

    const sortCol = (name, minWidth) => <th
      style={{ minWidth }}
      onClick={e => {
        e.preventDefault();
        this.updateSort(name)
      }}
    >
      {name}
      {sortBy === name ? sortArrow : null}
    </th>;

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
            <th
              style={name_style}
              onClick={e => {
                e.preventDefault();
                this.updateSort("name");
              }}
            >
              name
              {sortBy === "name" ? sortArrow : null}
            </th>
            {sortCol("up", "65px")}
            {sortCol("down", "85px")}
            {sortCol("ratio", "95px")}
            {sortCol("ul", "65px")}
            {sortCol("dl", "75px")}
            {sortCol("progress", "115px")}
          </tr>
        </thead>
        <tbody>
          {Object.values(torrents).slice().sort(comparator).map(t =>
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
