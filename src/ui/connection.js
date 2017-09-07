import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardBlock,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { initialize } from '..';

export default class ConnectionOverlay extends Component {
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
    const { uri, autoconnect } = this.state;
    return (
      <div className="connection-overlay">
        <Card>
          <CardHeader>Connect to synapse</CardHeader>
          <CardBlock>
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
            >Connect</button>
          </CardBlock>
        </Card>
      </div>
    );
  }
}
