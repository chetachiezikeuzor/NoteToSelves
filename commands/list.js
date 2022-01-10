const Discord = require("discord.js");
const userSchema = require("../models/user");
const { Scheduler } = require("../utils/scheduler");

let bot = new Discord.Client({
  disableMentions: "everyone",
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

exports.run = async (interaction) => {
  const { options, user } = interaction;

  userSchema.findById(user.id).then((u) => {
    if (!u) {
      interaction.reply(embeds.noReminders());
    } else {
      console.log(u.reminders);
      if (u.reminders.length == 0) interaction.reply(embeds.noReminders());
      else interaction.reply(embeds.remindersList(u.reminders, u.offset));
    }
  });
};

exports.help = {
  name: "list",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "list <id>",
};
