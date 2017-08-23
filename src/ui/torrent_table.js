import React, { Component } from 'react';
import { connect } from 'react-redux';

class TorrentTable extends Component {
  render() {
    const { torrents } = this.props;
    return (
      <table className="table">
        <thead>
          <tr>
            <th style={{width: "1px"}}></th>
            <th>name</th>
            <th>up</th>
            <th>down</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(torrents).map(t =>
            <tr
              key={t.id}
              className={`torrent ${t.status}`}
              style={{
                backgroundSize: `${t.progress * 100}% 3px`
              }}
            >
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <a href="#">
                  {t.name}
                </a>
              </td>
              <td>{t.rate_up}</td>
              <td>{t.rate_down}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default connect(state => ({ torrents: state.torrents }))(TorrentTable);
