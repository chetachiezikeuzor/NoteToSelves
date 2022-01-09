const Unsplash = require("unsplash-js").default;
const BYTE_SIZES = ["Bytes", "KB", "MB", "GB", "TB"];

const UNSPLASH = new Unsplash({
  applicationId: process.env.unsplashAccessKey,
  secret: process.env.unsplashSecretKey,
});

module.exports = {
  BYTE_SIZES: BYTE_SIZES,
  UNSPLASH: UNSPLASH,
};
