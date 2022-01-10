const Discord = require("discord.js");
const embeds = require("../embeds");
const userSchema = require("../models/user");

exports.run = async (client, message, args) => {
  userSchema.findById(message.author.id).then((u) => {
    if (!u) {
      message.reply({ embeds: embeds.noReminders() });
    } else {
      console.log(u.reminders);
      if (u.reminders.length == 0)
        message.reply({ embeds: [embeds.noReminders()] });
      else
        message.reply({ embeds: embeds.remindersList(u.reminders, u.offset) });
    }
  });
};

exports.help = {
  name: "list",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "list <id>",
};
