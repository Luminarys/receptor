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
  if (bitrate > Rates["TiB/s"]) {
    return [bitrate / Rates["TiB/s"], "TiB/s"];
  } else if (bitrate > Rates["GiB/s"]) {
    return [bitrate / Rates["GiB/s"], "GiB/s"];
  } else if (bitrate > Rates["MiB/s"]) {
    return [bitrate / Rates["MiB/s"], "MiB/s"];
  } else if (bitrate > Rates["KiB/s"]) {
    return [bitrate / Rates["KiB/s"], "KiB/s"];
  } else {
    return [bitrate, "B/s"];
  }
}

function places(n) {
  let places = 2;
  if (n >= 100) {
    places = 0;
  } else if (n >= 10) {
    places = 1;
  }
  if (n.toFixed(places) === (0).toFixed(places)) {
    places = 0;
  }
  return places;
}

export function formatBitrate(bitrate) {
  const [rate, unit] = convertedRate(bitrate);
  return `${rate.toFixed(places(rate))} ${unit}`;
}

export function formatAmount(amount) {
  const units = {
    "TiB/s": "TiB",
    "GiB/s": "GiB",
    "MiB/s": "MiB",
    "KiB/s": "KiB",
    "B/s": "bytes"
  };
  const [rate, unit] = convertedRate(amount);
  return `${rate.toFixed(places(rate))} ${units[unit]}`;
}
