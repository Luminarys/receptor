import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { formatBitrate } from '../bitrate';
import { ws_disconnect } from '../socket';
import date from '../date';

const throttle = _ => _ === null ? "Unlimited" : formatBitrate(_);

function Server({ server }) {
  if (!server.id) {
    return null;
  }
  return (
    <div>
      <h3>
        Server
        <button
          className="btn btn-sm btn-outline-danger pull-right"
          onClick={() => {
            localStorage.removeItem("autoconnect");
            localStorage.removeItem("password");
            ws_disconnect();
          }}
        >Disconnect</button>
      </h3>
      <dl>
        <dt>Running since</dt>
        <dd>{date(moment(server.started))}</dd>
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
