export function formatBitrate(bitrate) {
  if (bitrate > 1000000000) {
    return `${(bitrate / 1000000000).toFixed(2)} Gb/s`;
  } else if (bitrate > 1000000) {
    return `${(bitrate / 1000000).toFixed(2)} Mb/s`;
  } else if (bitrate > 1000) {
    return `${(bitrate / 1000).toFixed(2)} Kb/s`;
  } else {
    return `${bitrate} b/s`;
  }
}
