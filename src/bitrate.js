export const Rates = {
  "B/s": Math.pow(1024, 0),
  "KiB/s": Math.pow(1024, 1),
  "MiB/s": Math.pow(1024, 2),
  "GiB/s": Math.pow(1024, 3),
  "TiB/s": Math.pow(1024, 4),
};

export function convertToBitrate(value, unit) {
  return value * Rates[unit];
}

export function convertFromBitrate(value, unit) {
  return value / Rates[unit];
}

export function formatBitrate(bitrate) {
  if (bitrate > Rates["GiB/s"]) {
    return `${(bitrate / Rates["GiB/s"]).toFixed(2)} GiB/s`;
  } else if (bitrate > Rates["MiB/s"]) {
    return `${(bitrate / Rates["MiB/s"]).toFixed(2)} MiB/s`;
  } else if (bitrate > Rates["KiB/s"]) {
    return `${(bitrate / Rates["KiB/s"]).toFixed(2)} KiB/s`;
  } else {
    return `${bitrate} B/s`;
  }
}

export function formatAmount(amount) {
  if (amount > Rates["GiB/s"]) {
    return `${(amount / Rates["GiB/s"]).toFixed(2)} GiB`;
  } else if (amount > Rates["MiB/s"]) {
    return `${(amount / Rates["MiB/s"]).toFixed(2)} MiB`;
  } else if (amount > Rates["KiB/s"]) {
    return `${(amount / Rates["KiB/s"]).toFixed(2)} KiB`;
  } else {
    return `${amount} bytes`;
  }
}
