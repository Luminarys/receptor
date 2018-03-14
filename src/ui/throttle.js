import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { convertFromBitrate, convertToBitrate } from '../bitrate';

export default class Throttle extends Component {
  constructor() {
    super();
    this.setLimit = this.setLimit.bind(this);
    this.setUnit = this.setUnit.bind(this);
    this.state = { custom: 1024 * 1024, unit: "MiB/s" };
  }

  setLimit(limit) {
    const { onChange } = this.props;
    const { unit } = this.state;
    let custom = this.props.limit;
    if (custom <= 0 || custom === null) {
      custom = this.state.custom;
    }
    if (isNaN(limit)) {
      limit = 0;
    }
    const converted = limit <= 0 || limit === null ?
      limit : convertToBitrate(limit, unit);
    onChange && onChange(converted);
    this.setState({ unit, custom });
  }

  setUnit(unit) {
    const limit = convertFromBitrate(this.props.limit, this.state.unit);
    this.setState({ unit, custom: this.state.custom });
    this.setLimit(limit);
  }

  render() {
    const { global, limit, legend, prop } = this.props;
    const { unit, custom } = this.state;
    return (
      <div>
        <FormGroup tag="fieldset">
          <legend>{legend}</legend>
          {typeof global === "undefined" || global &&
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
          }
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
                onChange={e => this.setLimit(convertFromBitrate(custom, unit))}
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
