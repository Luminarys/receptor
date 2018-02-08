import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { formatBitrate, formatAmount } from '../bitrate';
import { ws_disconnect } from '../socket';
import DateDisplay from './date';
import Ratio from './ratio';
import Throttle from './throttle';
import { updateResource } from '../actions/resources';

function Server({ server, dispatch }) {
  if (!server.id) {
    return null;
  }
  return (
    <div>
      <h3>
        Synapse
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
        <dd><DateDisplay when={moment(server.started)} /></dd>
        <dt>Disk space free</dt>
        <dd>{formatAmount(server.free_space)}</dd>
        <dt>Current network use</dt>
        <dd>
          {`${
          formatBitrate(server.rate_up)
          } up, ${
          formatBitrate(server.rate_down)
          } down`}
        </dd>
        <dt>Global download throttle</dt>
        <dd>
          <Throttle
            prop={"dl-throttle-server"}
            global={false}
            limit={server.throttle_down}
            onChange={throttle_down => dispatch(updateResource({
              id: server.id,
              throttle_down
            }))}
          />
        </dd>
        <dt>Global upload throttle</dt>
        <dd>
          <Throttle
            prop={"ul-throttle-server"}
            global={false}
            limit={server.throttle_up}
            onChange={throttle_up => dispatch(updateResource({
              id: server.id,
              throttle_up
            }))}
          />
        </dd>
        <dt>Lifetime ratio</dt>
        <dd>
          <Ratio up={server.transferred_up} down={server.transferred_down} />
        </dd>
        <dt>Session ratio</dt>
        <dd>
          <Ratio
            up={server.ses_transferred_up}
            down={server.ses_transferred_down}
          />
        </dd>
      </dl>
    </div>
  );
}

export default connect(state => ({ server: state.server }))(Server);
