import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { formatAmount } from '../bitrate';

export default function Ratio({ up, down }) {
  const ratio = up / down;
  if (isNaN(ratio)) {
    return <span class="ratio">
      <span>0</span>
      <span></span>
      <span></span>
    </span>;
  }
  if (!isFinite(ratio)) {
    return <span class="ratio">
      <strong>∞</strong>
      <span></span>
      <span></span>
    </span>;
  }
  return (
    <span class="ratio">
      <span>
        {`${ratio.toFixed(2)}`}
      </span>
      <span>{formatAmount(up)} <FontAwesome name="arrow-up" /></span>
      <span>{`${formatAmount(down)}`} <FontAwesome name="arrow-down" /></span>
    </span>
  );
}
