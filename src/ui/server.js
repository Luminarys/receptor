import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { formatBitrate, formatAmount } from '../bitrate';
import { ws_disconnect } from '../socket';
import date from '../date';
import Throttle from './throttle';
import { updateResource } from '../actions/resources';

const ratio = (up, down) => {
  const ratio = up / down;
  if (isNaN(ratio)) {
    return <dd>0</dd>;
  }
  return (
    <dd>
      {`${
        ratio.toFixed(3)
      } (${
        formatAmount(up)
      } up, ${
        formatAmount(down)
      } down)`}
    </dd>
  );
};

class Server extends Component {
  componentDidMount() {
    this.interval = setInterval(this.forceUpdate, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { server, dispatch } = this.props;
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
          <dd>{date(moment(server.started))}</dd>
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
          {ratio(server.transferred_up, server.transferred_down)}
          <dt>Session ratio</dt>
          {ratio(server.ses_transferred_up, server.ses_transferred_down)}
        </dl>
      </div>
    );
  }
}

export default connect(state => ({ server: state.server }))(Server);
