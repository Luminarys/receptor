import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { convertFromBitrate, convertToBitrate } from '../bitrate';

class Throttle extends Component {
  constructor() {
    super();
    this.setLimit = this.setLimit.bind(this);
    this.setUnit = this.setUnit.bind(this);
    this.state = { unit: "MiB/s" };
  }

  setLimit(limit) {
    const { onChange } = this.props;
    const { unit } = this.state;
    const converted = limit <= 0 || limit === null ?
      limit : convertToBitrate(limit, unit);
    onChange && onChange(converted);
  }

  setUnit(unit) {
    const limit = convertFromBitrate(this.props.limit, this.state.unit);
    this.setState({ unit });
    this.setLimit(limit);
  }

  render() {
    const { limit, legend, prop } = this.props;
    const { unit } = this.state;
    return (
      <div>
        <FormGroup tag="fieldset">
          <legend>{legend}</legend>
          <FormGroup check className="form-check-inline">
            <Label for={`${prop}-global`} check>
              <Input
                type="radio"
                name={prop}
                id={`${prop}-global`}
                onChange={e => this.setLimit(null)}
                checked={limit === null}
              /> Global
            </Label>
          </FormGroup>
          <FormGroup check className="form-check-inline">
            <Label for={`${prop}-unlimited`} check>
              <Input
                type="radio"
                name={prop}
                id={`${prop}-unlimited`}
                onChange={e => this.setLimit(-1)}
                checked={limit === -1}
              /> Unlimited
            </Label>
          </FormGroup>
          <FormGroup check className="form-check-inline">
            <Label for={`${prop}-custom`} check>
              <Input
                type="radio"
                name={prop}
                id={`${prop}-custom`}
                onChange={e => this.setLimit(1)}
                checked={limit !== -1 && limit !== null}
              /> Custom
            </Label>
          </FormGroup>
        </FormGroup>
        {limit !== -1 && limit !== null &&
          <div className="row">
            <FormGroup className="col-md-6">
              <Input
                type="number"
                value={convertFromBitrate(limit, unit)}
                onChange={e => this.setLimit(parseFloat(e.target.value))}
              />
            </FormGroup>
            <FormGroup className="col-md-6">
              <Input
                type="select"
                id="unit"
                value={unit}
                onChange={e => this.setUnit(e.target.value)}
              >
                <option value="b/s">b/s</option>
                <option value="KiB/s">KiB/s</option>
                <option value="MiB/s">MiB/s</option>
                <option value="GiB/s">GiB/s</option>
              </Input>
            </FormGroup>
          </div>
        }
      </div>
    );
  }
}

export default class TorrentOptions extends Component {
  render() {
    const {
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
        {typeof start !== undefined &&
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
          prop="dl-throttle"
          legend="Download throttle"
          limit={downloadThrottle}
          onChange={limit => downloadThrottleChanged(limit)}
        />
        <Throttle
          prop="ul-throttle"
          legend="Upload throttle"
          limit={uploadThrottle}
          onChange={limit => uploadThrottleChanged(limit)}
        />
      </div>
    );
  }
}
