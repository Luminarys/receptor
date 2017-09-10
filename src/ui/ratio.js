import React, { Component } from 'react';
import { formatAmount } from '../bitrate';

export default function Ratio({ up, down }) {
  const ratio = up / down;
  if (isNaN(ratio)) {
    return <span>0</span>;
  }
  return (
    <span>
      {`${
        ratio.toFixed(3)
      } (${
        formatAmount(up)
      } up, ${
        formatAmount(down)
      } down)`}
    </span>
  );
}
