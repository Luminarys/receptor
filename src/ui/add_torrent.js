import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  Progress,
  Card,
  CardBlock,
  CardTitle,
  CardText,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import ToggleContainer from './toggle_container';
import fetch from 'isomorphic-fetch';
import bencode from 'bencode';
import ws_send from '../socket';
import { convertToBitrate } from '../bitrate';

class Throttle extends Component {
  constructor() {
    super();
    this.state = {
      strategy: "global",
      unit: "MiB/s",
      limit: 1
    };
    this.setStrategy = this.setStrategy.bind(this);
  }

  invokeChange() {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }

    const { strategy, limit, unit } = this.state;
    switch (strategy) {
      case "global":
        onChange(null);
        break;
      case "unlimited":
        onChange(-1);
        break;
      default:
        onChange(convertToBitrate(limit, unit));
        break;
    }
  }

  setStrategy(strategy) {
    this.setState({ strategy });
    this.invokeChange();
  }

  setLimit(limit) {
    if (limit <= 0) {
      this.setState({ limit: this.state.limit });
      return;
    }
    this.setState({ limit });
    this.invokeChange();
  }

  setUnit(unit) {
    this.setState({ unit });
    this.invokeChange();
  }

  render() {
    const { legend, prop } = this.props;
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
                onChange={e => this.setStrategy("global")}
                checked={this.state.strategy === "global"}
              /> Global
            </Label>
          </FormGroup>
          <FormGroup check className="form-check-inline">
            <Label for={`${prop}-unlimited`} check>
              <Input
                type="radio"
                name={prop}
                id={`${prop}-unlimited`}
                onChange={e => this.setStrategy("unlimited")}
                checked={this.state.strategy === "unlimited"}
              /> Unlimited
            </Label>
          </FormGroup>
          <FormGroup check className="form-check-inline">
            <Label for={`${prop}-custom`} check>
              <Input
                type="radio"
                name={prop}
                id={`${prop}-custom`}
                onChange={e => this.setStrategy("custom")}
                checked={this.state.strategy === "custom"}
              /> Custom
            </Label>
          </FormGroup>
        </FormGroup>
        {this.state.strategy === "custom" &&
          <div className="row">
            <FormGroup className="col-md-6">
              <Input
                type="number"
                value={this.state.limit}
                onChange={e => this.setLimit(parseFloat(e.target.value))}
              />
            </FormGroup>
            <FormGroup className="col-md-6">
              <Input
                type="select"
                id="unit"
                value={this.state.unit}
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

class AddTorrent extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      customize: false,
      file: null,
      torrent: null,
      files: [],
      startImmediately: true,
      uploadThrottle: -1,
      downloadThrottle: -1,
      priority: 3,
    };
  }

  async handleTransferOffer(offer, file) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + offer.token);
    try {
      const resp = await fetch('http://localhost:8412/', {
        method: 'POST',
        body: file,
        headers: headers
      });
    } catch (ex) {
      // TODO: something more useful
      console.log(ex);
    }
  }

  uploadFile() {
    this.setState({ loading: true });
    const { file } = this.state;
    const { dispatch } = this.props;
    ws_send("UPLOAD_TORRENT", { size: file.size }, async offer => {
      switch (offer.type) {
        case "TRANSFER_OFFER":
          return await this.handleTransferOffer(offer, file);
        case "RESOURCES_EXTANT":
          const [id] = offer.ids;
          dispatch(push(`/torrents/${id}`));
          break;
      }
    });
  }

  processTorrent(torrent) {
    const { info } = torrent;
    if (!info.files) {
      this.setState({
        files: [
          {
            name: info.name,
            length: info.length
          }
        ],
        torrent
      });
    } else {
      // TODO
    }
  }

  handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const torrent = bencode.decode(reader.result, 'utf8');
        this.processTorrent.bind(this)(torrent);
      } catch (ex) {
        // TODO: something meaningful
        console.log(ex);
      }
    };
    reader.readAsArrayBuffer(file);
    this.setState({ file });
  }

  renderOptions() {
    return (
      <Card>
        <CardBlock>
          <FormGroup>
            <Label for="start-immediately" check style={{paddingLeft: 0}}>
              <input
                type="checkbox"
                checked={this.state.startImmediately}
                onChange={e => this.setState({
                  startImmediately: !this.state.startImmediately
                })}
                id="start-immediately"
              /> Start immediately
            </Label>
          </FormGroup>
          <FormGroup>
            <Label for="priority">Priority</Label>
            <Input
              type="select"
              id="priority"
              value={this.state.priority}
              onChange={e =>
                this.setState({ priority: parseInt(e.target.value)})
              }
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
            onChange={limit => this.setState({ downloadThrottle: limit })}
          />
          <Throttle
            prop="ul-throttle"
            legend="Upload throttle"
            onChange={limit => this.setState({ uploadThrottle: limit })}
          />
        </CardBlock>
      </Card>
    );
  }

  renderTorrent() {
    const { torrent, file, files, loading } = this.state;

    const details = {
      "comment": d => d,
      "creation date": d => new Date(d * 1000).toDateString(),
      "created by": d => d
    };

    return (
      <Card style={{marginBottom: "1rem"}}>
        <CardBlock>
          <CardTitle>{file.name}</CardTitle>
          <CardText>
            <dl style={{marginBottom: "0"}}>
              {Object.keys(details).map(key =>
                torrent[key] && (
                  <div>
                    <dt>{key}</dt>
                    <dd>{details[key](torrent[key])}</dd>
                  </div>
                )
              )}
            </dl>
          </CardText>
        </CardBlock>
        <ToggleContainer className="form-group" title="Options">
          {this.renderOptions.bind(this)()}
        </ToggleContainer>
        <ToggleContainer className="form-group" title="Files">
          <Card>
            <CardBlock>
              TODO
            </CardBlock>
          </Card>
        </ToggleContainer>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={file === null || loading}
          onClick={this.uploadFile.bind(this)}
        >Add torrent</button>
        {loading ?
          <Progress
            value={100}
            animated={true}
            striped={true}
            color="info"
            className="progress-maxheight"
          /> : null}
      </Card>
    );
  }

  render() {
    return (
      <div>
        <h3>Add torrent</h3>
        {this.state.torrent && this.renderTorrent.bind(this)()}
        <div className="form-group">
          <input
            style={{display: "none"}}
            type="file"
            accept=".torrent"
            onChange={this.handleFile.bind(this)}
          />
          {this.state.torrent ?
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => findDOMNode(this).querySelector("input[type='file']").click()}
              >Select a different torrent?</button>
            </div>
          :
            <button
              type="button"
              className="btn btn-default btn-block"
              onClick={() => findDOMNode(this).querySelector("input[type='file']").click()}
            >Select torrent</button>
          }
        </div>
      </div>
    );
  }
}

export default connect()(AddTorrent);
