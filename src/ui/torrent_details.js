import React, { Component } from 'react';
import { connect } from 'react-redux';
import { activeTorrents } from '../torrent_state';
import {
  Button,
  ButtonGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

// TODO: use component lifecycle functions here to invoke
// torrent_state.updateSubscriptions

function Torrent(props) {
  return (
    <div>
      <h3>{props.torrent.name}</h3>
    </div>
  );
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
          <Button color="info">Pause all</Button>{' '}
          <Button color="success">Resume all</Button>{' '}
          <ButtonDropdown
            isOpen={this.state.removeDropdown}
            toggle={() => this.setState({ removeDropdown: !this.state.removeDropdown })}
          >
            <DropdownToggle color="danger" caret>
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
    return (
      <div>
        {active.length > 1 ? this.renderHeader(active) : null}
        {active.map(id => <Torrent torrent={torrents[id]} />)}
      </div>
    );
  }
}

export default connect(state => ({
  router: state.router,
  torrents: state.torrents
}))(TorrentDetails);
