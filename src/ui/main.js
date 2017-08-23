import React, { Component } from 'react';
import TorrentTable from './torrent_table';

export default class Main extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <TorrentTable />
        </div>
        <div className="col-md-4">
          <h3>archlinux-2017.08.01-x86_64.iso</h3>
          <p>TODO details</p>
        </div>
      </div>
    );
  }
}
