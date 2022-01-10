const moment = require("moment");
const parser = require("../utils/parser");
const Discord = require("discord.js");
const {
  genericParserErrorMessage,
  dateFormatString,
} = require("../utils/constants");
const userSchema = require("../models/user");

exports.run = async (client, message, args) => {
  userSchema.findById(message.author.id).then(async (u) => {
    let messageContent = message.content.substring(1);
    let parameters = messageContent.substring(messageContent.indexOf(" ") + 1);

    if (!parser.validSnoozeString(messageContent)) {
      let error = new Discord.MessageEmbed()
        .setAuthor({
          name: "An error occured!",
          iconURL: "https://i.imgur.com/PZ9qLe7.png",
        })
        .setDescription(genericParserErrorMessage)
        .setColor(process.env.color_red)
        .setTimestamp();

      await message.channel.send({ embeds: [error] });
      return;
    }

    let reminderDate = parser.getDateFromSnoozeString(messageContent);

    if (u.reminders.length === 0) {
      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setColor(process.env.color_blue)
        .setDescription(`You have no reminders to snooze`)
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
      return;
    } else {
      for (let remind of u.reminders) {
        remind.date = reminderDate;
        remind.save();
      }

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setColor(process.env.color_blue)
        .setDescription(
          `I have snoozed **${u.reminders.length}** active reminders for you`
        )
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    }
  });
};

exports.help = {
  name: "snoozeall",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "snoozeall <id>",
};
