const constants = require("../utils/constants");

function capitalize(string) {
  const lower = string.toLowerCase();
  return string.charAt(0).toUpperCase() + lower.slice(1);
}

function bytesToSize(bytes) {
  if (bytes === 0) return "n/a";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${constants.BYTE_SIZES[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${constants.BYTE_SIZES[i]}`;
}

async function getImageBlob(imageURL) {
  let blob = await fetch(imageURL).then((r) => r.blob());
  return blob;
}

module.exports = {
  capitalize: capitalize,
  bytesToSize: bytesToSize,
  getImageBlob: getImageBlob,
};
