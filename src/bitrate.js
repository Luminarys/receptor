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

export function convertedRate(bitrate) {
  if (bitrate > Rates["GiB/s"]) {
    return [bitrate / Rates["GiB/s"], "GiB/s"];
  } else if (bitrate > Rates["MiB/s"]) {
    return [bitrate / Rates["MiB/s"], "MiB/s"];
  } else if (bitrate > Rates["KiB/s"]) {
    return [bitrate / Rates["KiB/s"], "KiB/s"];
  } else {
    return [bitrate, "B/s"];
  }
}

export function formatBitrate(bitrate) {
  const [rate, unit] = convertedRate(bitrate);
  let places = 2;
  if (rate >= 100) {
    places = 0;
  } else if (rate >= 10) {
    places = 1;
  } else if (rate == 0) {
    places = 0;
  }
  return `${rate.toFixed(places)} ${unit}`;
}

export function formatAmount(amount) {
  const units = {
    "GiB/s": "GiB",
    "MiB/s": "MiB",
    "KiB/s": "KiB",
    "B/s": "bytes"
  };
  const [rate, unit] = convertedRate(amount);
  let places = 2;
  if (rate >= 100) {
    places = 0;
  } else if (rate >= 10) {
    places = 1;
  } else if (rate == 0) {
    places = 0;
  }
  return `${rate.toFixed(places)} ${units[unit]}`;
}
