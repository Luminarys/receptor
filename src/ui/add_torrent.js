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
import fetch from 'isomorphic-fetch';
import bencode from 'bencode';
import moment from 'moment';
import ToggleContainer from './toggle_container';
import TorrentOptions from './torrent_options';
import ws_send from '../socket';
import date from '../date';

class AddTorrent extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      customize: false,
      file: null,
      magnet: null,
      useMagnet: false,
      torrent: null,
      files: [],
      start: true,
      uploadThrottle: null,
      downloadThrottle: null,
      priority: 3,
    };
  }

  componentDidMount() {
    let { magnet } = this.props.match.params;
    if (magnet) {
      magnet = decodeURIComponent(magnet);
      this.setState({ magnet, useMagnet: true });
    }
  }

  async handleTransferOffer(offer, file) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + offer.token);
    const { socket } = this.props;
    console.log(socket);
    const a = document.createElement('a');
    a.href = socket.uri;
    const url = (a.protocol === "ws:" ? "http://" : "https://") + a.host;
    try {
      const resp = await fetch(url,
        {
          method: 'POST',
          body: file,
          headers: headers
        }
      );
    } catch (ex) {
      // TODO: something more useful
      console.log(ex);
    }
  }

  applyOptions(id) {
    const {
      priority,
      uploadThrottle,
      downloadThrottle
    } = this.state;
    const { dispatch } = this.props;
    const customize = // TODO: File options
      priority !== 3 ||
      uploadThrottle !== -1 ||
      downloadThrottle !== -1;
    if (!customize) {
      dispatch(push(`/torrents/${id}`));
      return;
    }
    ws_send("UPDATE_RESOURCE", {
      resource: {
        id,
        priority,
        throttle_up: uploadThrottle,
        throttle_down: downloadThrottle
      }
    }, async done => {
      if (this.state.start) {
        ws_send("RESUME_TORRENT", { id });
      }
      dispatch(push(`/torrents/${id}`));
    });
  }

  uploadFile() {
    this.setState({ loading: true });
    const { magnet, file, start } = this.state;
    const { dispatch } = this.props;
    const customize = // TODO: File options
      this.state.priority !== 3 ||
      this.state.uploadThrottle !== -1 ||
      this.state.downloadThrottle !== -1;
    const handleOffer = async offer => {
      switch (offer.type) {
        case "TRANSFER_OFFER":
          return await this.handleTransferOffer(offer, file);
        case "RESOURCES_EXTANT":
          const [id] = offer.ids;
          this.applyOptions.bind(this)(id);
          break;
      }
    };
    if (magnet) {
      ws_send("UPLOAD_MAGNET", {
        uri: magnet,
        start: start && !customize
      }, handleOffer);
    } else {
      ws_send("UPLOAD_TORRENT", {
        size: file.size,
        start: start && !customize
      }, handleOffer);
    }
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
      this.setState({
        files: [/* TODO */],
        torrent
      });
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
    const {
      start,
      priority,
      downloadThrottle,
      uploadThrottle
    } = this.state;

    return (
      <Card>
        <CardBlock>
          <TorrentOptions
            start={start}
            startChanged={start => this.setState({ start })}
            priority={priority}
            priorityChanged={priority => this.setState({ priority })}
            downloadThrottle={downloadThrottle}
            downloadThrottleChanged={downloadThrottle =>
              this.setState({ downloadThrottle })}
            uploadThrottle={uploadThrottle}
            uploadThrottleChanged={uploadThrottle =>
              { console.log(uploadThrottle); this.setState({ uploadThrottle }); }}
          />
        </CardBlock>
      </Card>
    );
  }

  renderTorrent() {
    const { magnet, torrent, file, files, loading } = this.state;

    const details = {
      "comment": d => d,
      "creation date": d => date(moment(new Date(d * 1000))),
      "created by": d => d
    };

    return (
      <Card style={{marginBottom: "1rem"}}>
        {torrent &&
          <CardBlock>
            <CardTitle>{magnet && "Magnet link" || file.name}</CardTitle>
              <CardText>
              <dl style={{marginBottom: "0"}}>
                {Object.keys(details).map(key => {
                  const val = torrent[key];
                  if (!val) {
                    return null;
                  }
                  if (typeof val === "string" && !val.trim()) {
                    return null;
                  }
                  return (
                    <div>
                      <dt>{key}</dt>
                      <dd>{details[key](torrent[key])}</dd>
                    </div>
                  );
                })}
              </dl>
            </CardText>
          </CardBlock>
        }
        <ToggleContainer className="form-group" title="Options">
          {this.renderOptions.bind(this)()}
        </ToggleContainer>
        {torrent &&
          <ToggleContainer className="form-group" title="Files">
            <Card>
              <CardBlock>
                TODO
              </CardBlock>
            </Card>
          </ToggleContainer>
        }
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={(file || magnet) && loading}
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
        {this.state.magnet && this.state.useMagnet &&
          <p style={{
            textOverflow: "ellipsis",
            overflowX: "hidden",
            whiteSpace: "nowrap"
          }}>{this.state.magnet}</p>
        }
        {(this.state.torrent || this.state.magnet) && this.renderTorrent.bind(this)()}
        <div className="form-group">
          <input
            style={{display: "none"}}
            type="file"
            accept=".torrent"
            onChange={this.handleFile.bind(this)}
          />
          {!this.state.useMagnet && (this.state.torrent ?
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
            <div>
              <button
                type="button"
                className="btn btn-default btn-block"
                onClick={() => findDOMNode(this).querySelector("input[type='file']").click()}
              >Select torrent</button>
              <div className="text-centered" style={{margin: "1rem auto"}}>
                - or -
              </div>
              <FormGroup>
                <Input
                  type="text"
                  placeholder="Magnet link"
                  value={this.state.magnet}
                  onChange={e => this.setState({ magnet: e.target.value })}
                />
              </FormGroup>
              <button
                type="button"
                className="btn btn-default btn-block"
                onClick={() => this.setState({ useMagnet: true })}
                disabled={(() => {
                  const a = document.createElement("a");
                  a.href = this.state.magnet;
                  return a.protocol !== "magnet:";
                })()}
              >Add magnet</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(s => ({ socket: s.socket }))(AddTorrent);
