import React, { Component } from 'react';
import TorrentTable from './torrent_table';

export default class Main extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <h3>Filter</h3>
          <p>TODO</p>
        </div>
        <div className="col-md-8">
          <h3>Torrents</h3>
          <TorrentTable />
        </div>
      </div>
    );
  }
}
