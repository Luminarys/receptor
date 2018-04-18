import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Throttle from './throttle';

export default class TorrentOptions extends Component {
  render() {
    const {
      id,
      start,
      strategy,
      startChanged,
      path,
      pathChanged,
      priority,
      priorityChanged,
      downloadThrottle,
      downloadThrottleChanged,
      strategyChanged,
      uploadThrottle,
      uploadThrottleChanged,
    } = this.props;
    return (
      <div>
        {typeof start !== "undefined" &&
          <FormGroup>
            <Label for="start-immediately" check style={{paddingLeft: 0}}>
              <input
                type="checkbox"
                checked={start}
                onChange={e => startChanged(!start)}
                id="start-immediately"
              /> Start immediately
            </Label>
          </FormGroup>
        }
        {typeof path !== "undefined" &&
          <FormGroup>
            <Input
              type="text"
              placeholder="Path"
              value={path}
              onChange={e => pathChanged(e.target.value)}
            />
          </FormGroup>
        }
        <FormGroup>
          <Label for="priority">Priority</Label>
          <Input
            type="select"
            id="priority"
            value={priority}
            onChange={e => priorityChanged(parseInt(e.target.value))}
          >
            <option value="1">Lowest</option>
            <option value="2">Low</option>
            <option value="3">Normal</option>
            <option value="4">High</option>
            <option value="5">Highest</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="strategy">Download Strategy</Label>
          <Input
            type="select"
            id="strategy"
            value={strategy}
            onChange={e => strategyChanged(e.target.value)}
          >
            <option value="rarest">Rarest</option>
            <option value="sequential">Sequential</option>
          </Input>
        </FormGroup>
        <Throttle
          prop={`dl-throttle-${id}`}
          legend="Download throttle"
          limit={downloadThrottle}
          global={true}
          onChange={limit => downloadThrottleChanged(limit)}
        />
        <Throttle
          prop={`ul-throttle-${id}`}
          legend="Upload throttle"
          limit={uploadThrottle}
          global={true}
          onChange={limit => uploadThrottleChanged(limit)}
        />
      </div>
    );
  }
}
