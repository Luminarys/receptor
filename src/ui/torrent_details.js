import React from 'react';
import { connect } from 'react-redux';

function torrent_details(props) {
  return (
    <div>
      <h3>Torrent details</h3>
    </div>
  );
}

export default connect(state => ({ router: state.router }))(torrent_details);
