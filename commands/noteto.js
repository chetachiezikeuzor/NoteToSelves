const moment = require("moment");
const parser = require("../utils/parser");
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

  if (!client.cooldownPhoto) {
    client.cooldownPhoto = new Set();
  }

  let cooldownEmbed = new Discord.MessageEmbed()
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setColor(process.env.color_blue)
    .setDescription(
      `Please wait ${exports.help.cooldown} seconds between commands.`
    );

  if (client.cooldownPhoto.has(message.author.id))
    return message.channel.send({ embeds: [cooldownEmbed] });

  client.cooldownPhoto.add(message.author.id);
  setTimeout(() => {
    client.cooldownPhoto.delete(message.author.id);
  }, exports.help.cooldown * 1000);

  if (!parser.validReminderString(message)) {
    await channel.send(genericParserErrorMessage);
    return;
  }

  let reminder = parser.getMessageAndDateFromReminderString(message);
  let reminderTime = moment(reminder.date);

  agenda.schedule(reminder.date, reminderJobName, {
    userId: message.author.id,
    reminder: reminder.message,
  });

  let embed = new Discord.MessageEmbed()
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setColor(process.env.color_blue)
    .setTitle(
      `On **${reminderTime.format(dateFormatString)}** I will remind you **${
        reminder.message
      }**`
    )
    .setColor(process.env.color_blue)
    .setTimestamp()
    .setThumbnail(client.user.avatarURL());

  message.channel.send({ embeds: [embed] });

  log(`reminder set for user ${message.author.id}`);
};

exports.help = {
  name: "noteto",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "noteto <id>",
  options: [
    {
      name: "message",
      type: "STRING",
      description: "The message you will get pinged with.",
      required: true,
    },
    {
      name: "time",
      type: "STRING",
      description: "<hour:minute><am|pm>",
      required: true,
    },
    {
      name: "date",
      type: "STRING",
      description:
        "<month/day/year> (leave blank to use today, or leave year blank to use current year)",
      required: false,
    },
  ],
};
