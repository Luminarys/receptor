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

const getURI = (uri, password) => ({ uri, password });

class ConnectionOverlay extends Component {
  constructor() {
    super();
    this.connect = this.connect.bind(this);
    const uri = localStorage.getItem("autoconnect");
    const password = localStorage.getItem("password");
    this.state = {
      uri: uri || "ws://127.0.0.1:8412",
      password: null,
      autoconnect: !!uri
    };
    if (uri) {
      initialize(getURI(this.state.uri, this.state.password));
    }
  }

  connect() {
    if (this.state.autoconnect) {
      localStorage.setItem("autoconnect", this.state.uri);
      localStorage.setItem("password", this.state.password);
    }
    initialize(getURI(this.state.uri, this.state.password));
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
    const { uri, password, autoconnect } = this.state;
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
                onKeyPress={e => e.keyCode === 13 && this.connect()}
                onChange={e => this.setState({ uri: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="socket-password">Server Password</Label>
              <Input
                id="socket-password"
                value={password}
                type="password"
                onKeyPress={e => e.keyCode === 13 && this.connect()}
                onChange={e => this.setState({ password: e.target.value })}
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
              onClick={this.connect}
            >{socket.reason ? "Reconnect" : "Connect"}</button>
          </CardBlock>
        </Card>
      </div>
    );
  }
}

export default connect(state => ({ socket: state.socket }))(ConnectionOverlay);
