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
      startChanged,
      priority,
      priorityChanged,
      downloadThrottle,
      downloadThrottleChanged,
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
        <Throttle
          prop={`dl-throttle-${id}`}
          legend="Download throttle"
          limit={downloadThrottle}
          onChange={limit => downloadThrottleChanged(limit)}
        />
        <Throttle
          prop={`ul-throttle-${id}`}
          legend="Upload throttle"
          limit={uploadThrottle}
          onChange={limit => uploadThrottleChanged(limit)}
        />
      </div>
    );
  }
}
