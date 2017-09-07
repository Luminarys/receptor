import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Collapse } from 'reactstrap';

export default class ToggleContainer extends Component {
  constructor() {
    super();
    this.state = { open: false };
  }

  render() {
    return (
      <div className={this.props.className || ""}>
        <button
          className="btn btn-sm btn-default btn-block"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          {this.props.title}
          <FontAwesome
            name={`chevron-${this.state.open ? "up" : "down"}`}
            style={{marginLeft: "0.25rem"}}
          />
        </button>
        <Collapse isOpen={this.state.open}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}
