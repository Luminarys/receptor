import React, { Component } from 'react';
import formatDate from '../date';

export default class DateDisplay extends Component {
  componentDidMount() {
    setInterval(() => this.forceUpdate(), this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <span>{formatDate(this.props.when)}</span>;
  }
}
