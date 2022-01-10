const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema({
  channelID: { type: String, required: true },
  reminders: { type: Array, required: true },
  offset: { type: Number, required: true },
});

const Channel = mongoose.model("User", channelSchema);

module.exports = Channel;
