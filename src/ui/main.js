import React, { Component } from 'react';
import { Route, DefaultRoute } from 'react-router';
import { connect } from 'react-redux';
import TorrentTable from './torrent_table';
import AddTorrent from './add_torrent';
import TorrentDetails from './torrent_details';
import Server from './server';
import ConnectionOverlay from './connection';

class Main extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <TorrentTable />
        </div>
        <div className="col-md-4">
          <Route exact path="/add-torrent" component={AddTorrent} />
          <Route path="/add-torrent/:magnet" component={AddTorrent} />
          <Route path="/torrents/:ids" component={TorrentDetails} />
          <Route exact path="/" component={Server} />
        </div>
        {this.props.socket.connected || <ConnectionOverlay />}
      </div>
    );
  }
}

export default connect(state => ({ socket: state.socket }))(Main);
