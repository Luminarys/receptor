import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {
  ButtonGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Card,
  CardBlock,
  Progress,
  Input,
} from 'reactstrap';
import moment from 'moment';
import TorrentOptions from './torrent_options';
import TorrentProgress from './torrent_progress';
import ws_send from '../socket';
import store from '../store';
import DateDisplay from './date';
import selectTorrent, {
  EXCLUSIVE,
  UNION,
  SUBTRACT,
  NONE
} from '../actions/selection';
import { updateResource } from '../actions/resources';
import { formatBitrate } from '../bitrate';

const dlURI = (uri, token, id) => `${uri.replace('ws', 'http')}/dl/${id}?token=${encodeURIComponent(token)}`;

function basename(path) {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

class File extends Component {
  shouldComponentUpdate(nextProps, _) {
    return nextProps.file !== this.props.file;
  }

  render() {
    const { dispatch, file } = this.props;
    const { uri } = store.getState().socket;
    const { download_token } = store.getState().server;
    return (
      <div className="file">
        <Progress
          value={file.progress * 100}
          color={file.progress != 1.0 ? "success" : "primary"}
        >
          {file.progress === 1.0 ?
            "done" : `${(file.progress * 100).toFixed(0)}%`}
        </Progress>
        <div className="path" title={file.path}>
          {file.progress === 1.0 ?
            <a href={dlURI(uri, download_token, file.id)} target="_new">
              {basename(file.path)}
            </a> : basename(file.path)}
        </div>
        <div>
          <Input
            type="select"
            id="priority"
            value={file.priority}
            onChange={e => dispatch(updateResource({
              id: file.id,
              priority: parseInt(e.target.value)
            }))}
          >
            <option value="0">Skip</option>
            <option value="1">Lowest</option>
            <option value="2">Low</option>
            <option value="3">Normal</option>
            <option value="4">High</option>
            <option value="5">Highest</option>
          </Input>
        </div>
      </div>
    );
  }
}

class Peer extends Component {
  shouldComponentUpdate(nextProps, _) {
    return nextProps.peer !== this.props.peer;
  }

  render() {
    const { peer } = this.props;
    return (
      <div className="peer">
        <div style={{flexGrow: 5}}>{peer.ip}</div>
        <div style={{flexBasis: "18%"}}>{formatBitrate(peer.rate_up)} up</div>
        <div style={{flexBasis: "18%"}}>{formatBitrate(peer.rate_down)} down</div>
        <div style={{flexBasis: "18%"}}>has {`${(peer.availability * 100).toFixed(0)}%`}</div>
      </div>
    );
  }
}

// TODO: move to separate component
function CollapseToggle({ text, onToggle, open }) {
  return (
    <button
      className="btn btn-sm btn-default"
      onClick={onToggle}
    >
      {text}
      <FontAwesome
        name={`caret-${open ? "up" : "down"}`}
        style={{marginLeft: "0.25rem"}}
      />
    </button>
  );
}

class Torrent extends Component {
  constructor() {
    super();
    this.state = {
      infoShown: false,
      filesShown: false,
      trackersShown: false,
      peersShown: false,
      removeDropdown: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.torrent !== this.props.torrent
      || nextState.peersShown !== this.state.peersShown
      || nextState.trackersShown !== this.state.trackersShown
      || nextState.filesShown !== this.state.filesShown
      || nextState.infoShown !== this.state.infoShown;
  }

  toggleTorrentState(torrent) {
    if (torrent.status === "paused") {
      ws_send("RESUME_TORRENT", { id: torrent.id });
    } else {
      ws_send("PAUSE_TORRENT", { id: torrent.id });
    }
  }

  render() {
    const { dispatch, torrent, files, trackers, peers } = this.props;
    const status = s => s[0].toUpperCase() + s.slice(1);

    if (!torrent || !files) {
      return (
        <p>Loading...</p>
      );
    }

    return (
      <div>
        <h4>{torrent.name}</h4>
        <div className="torrent-controls">
          <a
            href="#"
            style={{margin: "auto 0.5rem"}}
            title={torrent.status === "paused" ? "Resume" : "Pause"}
            onClick={e => {
              e.preventDefault();
              this.toggleTorrentState(torrent);
            }}
          >
            <FontAwesome name={torrent.status === "paused" ? "play" : "pause"} />
          </a>
          <div class="status">{status(torrent.status)}</div>
          <TorrentProgress torrent={torrent} />
          <ButtonDropdown
            isOpen={this.state.removeDropdown}
            toggle={() => this.setState({ removeDropdown: !this.state.removeDropdown })}
          >
            <DropdownToggle color="danger" caret>
              Remove
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  dispatch(selectTorrent([torrent.id], SUBTRACT));
                  ws_send("REMOVE_RESOURCE", { id: torrent.id });
                }}
              >Remove</DropdownItem>
              <DropdownItem
                onClick={() => {
                  dispatch(selectTorrent([torrent.id], SUBTRACT));
                  ws_send("REMOVE_RESOURCE", { id: torrent.id, artifacts: true });
                }}
              >Remove and delete files</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <ButtonGroup className="toggles">
          <CollapseToggle
            text="Info"
            onToggle={() => this.setState({ infoShown: !this.state.infoShown })}
            open={this.state.infoShown}
          />
          <CollapseToggle
            text="Files"
            onToggle={() => this.setState({ filesShown: !this.state.filesShown })}
            open={this.state.filesShown}
          />
          <CollapseToggle
            text="Trackers"
            onToggle={() => this.setState({ trackersShown: !this.state.trackersShown })}
            open={this.state.trackersShown}
          />
          <CollapseToggle
            text="Peers"
            onToggle={() => this.setState({ peersShown: !this.state.peersShown })}
            open={this.state.peersShown}
          />
        </ButtonGroup>
        <Collapse isOpen={this.state.infoShown}>
          <Card style={{marginBottom: "1rem"}}>
            <CardBlock>
              <dl>
                <dt>Downloading to</dt>
                <dd>{torrent.path}</dd>
                <dt>Created</dt>
                <dd><DateDisplay when={moment(torrent.created)} /></dd>
              </dl>
              <TorrentOptions
                id={torrent.id}
                priority={torrent.priority}
                priorityChanged={priority =>
                  dispatch(updateResource({ id: torrent.id, priority }))}
                downloadThrottle={torrent.throttle_down}
                downloadThrottleChanged={throttle_down =>
                  dispatch(updateResource({ id: torrent.id, throttle_down }))}
                uploadThrottle={torrent.throttle_up}
                uploadThrottleChanged={throttle_up =>
                  dispatch(updateResource({ id: torrent.id, throttle_up }))}
              />
            </CardBlock>
          </Card>
        </Collapse>
        <Collapse isOpen={this.state.filesShown}>
          <Card style={{marginBottom: "1rem"}}>
            <CardBlock style={{padding: "0"}}>
              <div className="files flex-table" style={{marginBottom: "0"}}>
                {this.state.filesShown
                  ? files.slice()
                    .sort((a, b) => a.path.localeCompare(b.path))
                    .map(file => <File dispatch={dispatch} file={file}/>)
                  : null}
              </div>
            </CardBlock>
          </Card>
        </Collapse>
        <Collapse isOpen={this.state.trackersShown}>
          <Card style={{marginBottom: "1rem"}}>
            <CardBlock>
              {trackers.map(tracker =>
                <div>
                  <h5>{(() => {
                      const a = document.createElement("a");
                      a.href = tracker.url;
                      return a.hostname;
                    })()}
                    <button
                      className="btn btn-sm btn-outline-primary pull-right"
                      onClick={() => {
                        ws_send("UPDATE_TRACKER", { id: tracker.id })
                      }}
                    >Report</button>
                  </h5>
                  <dl>
                    <dt>URL</dt>
                    <dd>{tracker.url}</dd>
                    <dt>Last report</dt>
                    <dd><DateDisplay when={moment(tracker.last_report)} /></dd>
                    {tracker.error && <dt>Error</dt>}
                    {tracker.error &&
                      <dd className="text-danger">{tracker.error}</dd>}
                  </dl>
                </div>
              )}
            </CardBlock>
          </Card>
        </Collapse>
        <Collapse isOpen={this.state.peersShown}>
          <Card style={{marginBottom: "1rem"}}>
            <CardBlock style={{padding: "0"}}>
              <div className="peers flex-table" style={{marginBottom: "0"}}>
                {this.state.peersShown ? peers.map(peer => <Peer peer={peer} />) : null}
              </div>
              {peers.length === 0 &&
                <div style={{padding: "0.5rem 0 0 0.5rem"}}>
                  <p>No connected peers.</p>
                </div>}
            </CardBlock>
          </Card>
        </Collapse>
      </div>
    );
  }
}

class TorrentDetails extends Component {
  constructor() {
    super();
    this.state = {
      removeDropdown: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { ids } = this.props.match.params;
    const _ids = ids.split(",");
    dispatch(selectTorrent(_ids, UNION));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(selectTorrent([], EXCLUSIVE, false));
  }

  renderHeader() {
    const { dispatch, selection } = this.props;
    return (
      <div>
        <h3>
          {selection.length} torrents
          <div className="bulk-controls">
            <a
              href="#"
              title="Resume all"
              onClick={e => {
                e.preventDefault();
                selection.forEach(id => ws_send("RESUME_TORRENT", { id }));
              }}
            ><FontAwesome name="play" /></a>
            <a
              href="#"
              title="Pause all"
              onClick={e => {
                e.preventDefault();
                selection.forEach(id => ws_send("PAUSE_TORRENT", { id }));
              }}
            ><FontAwesome name="pause" /></a>
            <ButtonDropdown
              isOpen={this.state.removeDropdown}
              toggle={() => this.setState({ removeDropdown: !this.state.removeDropdown })}
            >
              <DropdownToggle color="danger" caret>
                Remove all
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    dispatch(selectTorrent(selection, SUBTRACT));
                    selection.forEach(id => ws_send("REMOVE_RESOURCE", { id }));
                  }}
                >Remove selected torrents</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    dispatch(selectTorrent(selection, SUBTRACT));
                    selection.forEach(id => ws_send("REMOVE_RESOURCE", {
                      id,
                      artifacts: true
                    }));
                  }}
                >Remove selected torrents and delete files</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </h3>
      </div>
    );
  }

  render() {
    const {
      torrents,
      files,
      trackers,
      peers,
      selection,
      dispatch
    } = this.props;
    const index_by_tid = (res)  => {
      let _indexed = {};
      Object.values(res).map(r => {
        if (!(r.torrent_id in _indexed)) {
          _indexed[r.torrent_id] = [];
        }
        _indexed[r.torrent_id].push(r);
      });
      return _indexed;
    };

    const _files = index_by_tid(files);
    const _trackers = index_by_tid(trackers);
    const _peers = index_by_tid(peers);

    return (
      <div>
        {selection.length > 1 ? this.renderHeader.bind(this)() : null}
        {selection.slice(0, 3).map(id => <Torrent
          dispatch={dispatch}
          torrent={torrents[id]}
          files={_files[id] || []}
          trackers={_trackers[id] || []}
          peers={_peers[id] || []}
          key={id}
        />)}
        {selection.length > 3 ?
          <p class="text-center text-muted">
            <strong>
              ...{selection.length - 3} more hidden...
            </strong>
          </p>
        : null}
      </div>
    );
  }
}

export default connect(state => ({
  router: state.router,
  torrents: state.torrents,
  files: state.files,
  trackers: state.trackers,
  peers: state.peers,
  selection: state.selection,
  server: state.server
}))(TorrentDetails);
