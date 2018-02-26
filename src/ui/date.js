import React, { Component } from 'react';
import formatDate from '../date';

export default class DateDisplay extends Component {
  componentDidMount() {
    this._interval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return <span>{formatDate(this.props.when)}</span>;
  }
}
