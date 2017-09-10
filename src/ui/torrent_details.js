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
  Progress
} from 'reactstrap';
import moment from 'moment';
import TorrentOptions from './torrent_options';
import ws_send from '../socket';
import date from '../date';
import selectTorrent, {
  EXCLUSIVE,
  UNION,
  SUBTRACT,
  NONE
} from '../actions/selection';
import { updateResource } from '../actions/resources';

function File({ file }) {
  // TODO: show progress bar
  // TODO: edit priority
  return (
    <tr>
      <td>{file.path}</td>
      <td>{file.priority}</td>
      <td>{file.availability}</td>
    </tr>
  );
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

  toggleTorrentState(torrent) {
    if (torrent.status === "paused") {
      ws_send("RESUME_TORRENT", { id: torrent.id });
    } else {
      ws_send("PAUSE_TORRENT", { id: torrent.id });
    }
  }

  render() {
    const { dispatch, torrent, files, trackers } = this.props;
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
          <Progress
            value={torrent.progress * 100}
          >{(torrent.progress * 100).toFixed(0)}%</Progress>
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
              <DropdownItem>Remove and delete files</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <ButtonGroup>
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
          <Card>
            <CardBlock>
              <dl>
                <dt>Downloading to</dt>
                <dd>{torrent.path}</dd>
                <dt>Created</dt>
                <dd>{date(moment(torrent.created))}</dd>
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
            <CardBlock>
              <table className="table table-striped" style={{marginBottom: "0"}}>
                <tbody>
                  {files.map(file => <File file={file} />)}
                </tbody>
              </table>
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
                    {/* TODO: wire up this button: */}
                    <button
                      className="btn btn-sm btn-outline-primary pull-right"
                    >Report</button>
                  </h5>
                  <dl>
                    <dt>URL</dt>
                    <dd>{tracker.url}</dd>
                    <dt>Last report</dt>
                    <dd>{date(moment(tracker.last_report))}</dd>
                    {tracker.error && <dt>Error</dt>}
                    {tracker.error &&
                      <dd className="text-danger">{tracker.error}</dd>}
                  </dl>
                </div>
              )}
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
                <DropdownItem>Remove selected torrents and delete files</DropdownItem>
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
    const _files = Object.values(files).reduce((s, f) => ({
      ...s, [f.torrent_id]: [...(s[f.torrent_id] || []), f]
    }), {});
    const _trackers = Object.values(trackers).reduce((s, t) => ({
      ...s, [t.torrent_id]: [...(s[t.torrent_id] || []), t]
    }), {});
    const _peers = Object.values(peers).reduce((s, p) => ({
      ...s, [p.torrent_id]: [...(s[p.torrent_id] || []), p]
    }), {});
    return (
      <div>
        {selection.length > 1 ? this.renderHeader.bind(this)() : null}
        {selection.slice(0, 3).map(id => <Torrent
          dispatch={dispatch}
          torrent={torrents[id]}
          files={_files[id] || []}
          trackers={_trackers[id] || []}
          peers={_peers[id] || []}
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
