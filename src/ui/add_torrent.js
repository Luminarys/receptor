import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Progress, Collapse, Card, CardBlock } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import fetch from 'isomorphic-fetch';
import ws_send from '../socket';

class AddTorrent extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      customize: false,
      file: null
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
      // TODO: synapse borks up this response
      console.log(ex);
    }
  }

  uploadFile() {
    this.setState({ loading: true });
    const { file } = this.state;
    const { dispatch } = this.props;
    const reader = new FileReader();
    reader.onload = e => {
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
    };
    reader.readAsArrayBuffer(file);
  }

  handleFile(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  render() {
    const { file, loading } = this.state;
    return (
      <div>
        <h3>Add torrent</h3>
        <div className="form-group">
          <input
            style={{display: "none"}}
            type="file"
            accept=".torrent"
            onChange={this.handleFile.bind(this)}
          />
          <button
            type="button"
            className="btn btn-default"
            onClick={() => findDOMNode(this).querySelector("input[type='file']").click()}
          >Select torrent</button>
          <p>{file ? file.name : ""}</p>
        </div>
        <div className="form-group">
          <p>
            <button
              className="btn btn-sm btn-default"
              onClick={() => this.setState({ customize: !this.state.customize })}
            >
              Torrent options
              <FontAwesome
                name={`chevron-${this.state.customize ? "up" : "down"}`}
                style={{marginLeft: "0.25rem"}}
              />
            </button>
          </p>
          <Collapse isOpen={this.state.customize}>
            <Card>
              <CardBlock>
                TODO
              </CardBlock>
            </Card>
          </Collapse>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-md-5">
              <button
                type="button"
                className="btn btn-primary btn-block"
                disabled={file === null || loading}
                onClick={this.uploadFile.bind(this)}
              >Add torrent</button>
            </div>
            <div className="col-md-7">
              {loading ?
                <Progress
                  value={100}
                  animated={true}
                  striped={true}
                  color="info"
                  className="progress-maxheight"
                /> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(AddTorrent);
