import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatBitrate } from '../bitrate';

function throttle(v) {
  return v === null ? "Unlimited" : formatBitrate(v);
}

function Server({ server }) {
  if (!server.id) {
    // TODO: websocket status?
    return null;
  }
  return (
    <div>
      <h3>Server</h3>
      <dl>
        <dt>Running since</dt>
        {/* TODO: pretty print dates */}
        <dd>{server.started}</dd>
        <dt>Rate up</dt>
        <dd>{formatBitrate(server.rate_up)}</dd>
        <dt>Rate down</dt>
        <dd>{formatBitrate(server.rate_down)}</dd>
        {/* TODO: Editable */}
        <dt>Throttle up</dt>
        <dd>{throttle(server.throttle_up)}</dd>
        <dt>Throttle down</dt>
        <dd>{throttle(server.throttle_down)}</dd>
      </dl>
    </div>
  );
}

export default connect(state => ({ server: state.server }))(Server);
