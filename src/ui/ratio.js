import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { formatAmount } from '../bitrate';

export default function Ratio({ up, down }) {
  const ratio = up / down;
  if (isNaN(ratio)) {
    return <span>0</span>;
  }
  if (!isFinite(ratio)) {
    return <span>∞</span>;
  }
  return (
    <span>
      <span>
        {`${ratio.toFixed(3)} `}
      </span>
      <span>({formatAmount(up)} <FontAwesome name="arrow-circle-o-up" /></span>
      <span>{` ${formatAmount(up)}`} <FontAwesome name="arrow-circle-o-down" />)</span>
    </span>
  );
}
