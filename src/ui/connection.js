import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Card,
  CardHeader,
  CardBlock,
  FormGroup,
  Progress,
  Label,
  Input
} from 'reactstrap';
import { initialize } from '..';
import { SOCKET_STATE } from '../actions/socket';

class ConnectionOverlay extends Component {
  constructor() {
    super();
    this.state = {
      uri: "ws://127.0.0.1:8412",
      autoconnect: false,
      connecting: false
    };
    // TODO: "connecting..." UI
    // TODO: autoconnect
    // TODO: gracefully handle dis/reconnections
  }

  render() {
    const { socket } = this.props;
    if (socket.state === SOCKET_STATE.CONNECTED) {
      return null;
    }
    if (socket.state === SOCKET_STATE.CONNECTING) {
      return (
        <div className="connection-overlay">
          <Card>
            <CardHeader>Connect to synapse</CardHeader>
            <CardBlock>
              <p className="text-center">Connecting...</p>
              <Progress value={100} animated />
            </CardBlock>
          </Card>
        </div>
      );
    }
    const { uri, autoconnect } = this.state;
    return (
      <div className="connection-overlay">
        <Card>
          <CardHeader>Connect to synapse</CardHeader>
          <CardBlock>
            {socket.reason && <Alert color="info">{socket.reason}</Alert>}
            <FormGroup>
              <Label for="socket-uri">Server URI</Label>
              <Input
                id="socket-uri"
                value={uri}
                onChange={e => this.setState({ uri: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="autoconnect" check>
                <Input
                  id="autoconnect"
                  type="checkbox"
                  checked={autoconnect}
                  onChange={e => this.setState({ autoconnect: !autoconnect })}
                  check
                /> Autoconnect to this server
              </Label>
            </FormGroup>
            <button
              className="btn btn-primary"
              onClick={() => initialize(this.state.uri)}
            >{socket.reason ? "Reconnect" : "Connect"}</button>
          </CardBlock>
        </Card>
      </div>
    );
  }
}

export default connect(state => ({ socket: state.socket }))(ConnectionOverlay);
