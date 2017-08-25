import React, { Component } from 'react';
import { connect } from 'react-redux';
import { activeTorrents } from '../torrent_state';
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
import ws_send from '../socket';

// TODO: use component lifecycle functions here to invoke
// torrent_state.updateSubscriptions
// TODO: fix navigating directly to torrent pages

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
        name={`chevron-${open ? "up" : "down"}`}
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
      peersShown: false
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
    const { torrent, files } = this.props;
    const status = s => s[0].toUpperCase() + s.slice(1);

    return (
      <div>
        <h3>{torrent.name}</h3>
        <Progress value={torrent.progress * 100} style={{marginBottom: "0.5rem"}}>
          {(torrent.progress * 100).toFixed(0)}%
        </Progress>
        <p>
          <strong>State:</strong>
          <span style={{marginLeft: "1rem"}}>
            {status(torrent.status)}
          </span>
          <button
            className="btn btn-sm btn-very-sm btn-info"
            style={{marginLeft: "1rem"}}
            onClick={() => this.toggleTorrentState(torrent)}
          >
            {torrent.status === "paused" ? "Resume" : "Pause"}
          </button>
        </p>
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
          <dl>
            <dt>Downloading to</dt>
            <dd>{torrent.path}</dd>
            <dt>Created</dt>
            <dd>{torrent.created}</dd>
          </dl>
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

  renderHeader(active) {
    return (
      <div>
        <h3>{active.length} torrents</h3>
        <ButtonGroup>
          <button className="btn btn-default btn-sm">Pause all</button>
          <button className="btn btn-default btn-sm">Resume all</button>
          <ButtonDropdown
            isOpen={this.state.removeDropdown}
            toggle={() => this.setState({ removeDropdown: !this.state.removeDropdown })}
          >
            <DropdownToggle color="default" caret>
              Remove
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Remove torrent</DropdownItem>
              <DropdownItem>Delete files</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
      </div>
    );
  }

  render() {
    const active = activeTorrents();
    const { torrents } = this.props;
    const { files } = this.props;
    const _files = Object.values(files).reduce((s, f) => ({
      ...s, [f.torrent_id]: [...(s[f.torrent_id] || []), f]
    }), {});
    return (
      <div>
        {active.length > 1 ? this.renderHeader(active) : null}
        {active.map(id => <Torrent
          torrent={torrents[id]}
          files={_files[id] || []}
        />)}
      </div>
    );
  }
}

export default connect(state => ({
  router: state.router,
  torrents: state.torrents,
  files: state.files
}))(TorrentDetails);
