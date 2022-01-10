const Discord = require("discord.js");
const { Scheduler } = require("../utils/scheduler");

let bot = new Discord.Client({
  disableMentions: "everyone",
  intents: ["GUILDS", "GUILD_MESSAGES"],
});
let scheduler = new Scheduler(bot);

exports.run = async (client, message, args) => {
  let messageContent = message.content.substring(1);
  let parameters = messageContent.substring(messageContent.indexOf(" ") + 1);

  scheduler.snoozeReminders(message.author.id, message, parameters);
};

exports.help = {
  name: "snoozeall",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "snoozeall <id>",
};
