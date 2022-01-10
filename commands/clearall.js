const Discord = require("discord.js");
const userSchema = require("../models/user");
const embeds = require("../embeds");

exports.run = async (client, message, args) => {
  userSchema.findById(user.id).then((u) => {
    if (u) {
      u.reminders = [];
      u.save();
    }
    message.reply("All reminders removed successfully.");
  });
};

exports.help = {
  name: "clearall",
  description: "Removes all active reminders.",
  cooldown: "5",
  usage: "clearall <id>",
};
