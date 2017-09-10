import React, { Component } from 'react';
import { Progress } from 'reactstrap';

function color(torrent) {
  switch (torrent.status) {
    case "leeching":
      return "success";
    case "seeding":
      return "primary";
    case "hashing":
      return "info";
    case "idle":
    case "pending":
    case "paused":
      return "default";
    case "error":
      return "error";
  }
}

function inset(torrent) {
  switch (torrent.status) {
    case "leeching":
      return `${(torrent.progress * 100).toFixed(0)}%`;
    default:
      return torrent.status;
  }
}

export default function TorrentProgress({ torrent }) {
  return (
    <Progress
      value={torrent.progress * 100}
      color={color(torrent)}
    >{inset(torrent)}</Progress>
  );
}
