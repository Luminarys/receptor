import React, { Component } from 'react';
import { Route } from 'react-router';
import TorrentTable from './torrent_table';
import AddTorrent from './add_torrent';
import TorrentDetails from './torrent_details';

export default class Main extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <TorrentTable />
        </div>
        <div className="col-md-4">
          <Route path="/add-torrent" component={AddTorrent} />
          <Route path="/torrents/:id" component={TorrentDetails} />
        </div>
      </div>
    );
  }
}
