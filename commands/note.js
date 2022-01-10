const moment = require("moment");
const parser = require("../utils/parser");
const Discord = require("discord.js");
const embeds = require("../embeds");
const { genericParserErrorMessage } = require("../utils/constants");
const userSchema = require("../models/user");

exports.run = async (client, message, args) => {
  let messageContent = message.content.substring(1);
  let parameters = messageContent.substring(messageContent.indexOf(" ") + 1);
  userSchema.findById(message.author.id).then(async (u) => {
    if (!u) {
      await message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: "An error occured!",
              iconURL: "https://i.imgur.com/PZ9qLe7.png",
            })
            .setDescription(
              "Use `n!timezone` to set your time zone before you can add reminders."
            )
            .setColor(process.env.color_red)
            .setTimestamp(),
        ],
      });
    } else {
      if (!parser.validReminderString(parameters)) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(genericParserErrorMessage)
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }

      let reminder = parser.getMessageAndDateFromReminderString(parameters);
      let reminderTime = moment(reminder.date);
      const reminderItem = {
        date: reminder.date,
        msg: reminder.message,
      };

      if (reminder.date <= new Date().getTime()) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription("The time for this reminder has already passed.")
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }

      u.reminders.push(reminderItem);
      for (let i = u.reminders.length - 2; i >= 0; i--) {
        if (u.reminders[i].date > u.reminders[i + 1].date)
          [u.reminders[i], u.reminders[i + 1]],
            [u.reminders[i + 1], u.reminders[i]];
      }
      u.save();
      console.log(u.reminders);

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setColor(process.env.color_blue)
        .setDescription(
          `On **${reminderTime.format(
            dateFormatString
          )}**,\nI will remind you: **"${reminder.message}"**`
        )
        .setColor(process.env.color_blue)
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    }
  });
};

exports.help = {
  name: "noteto",
  description: "Sets a reminder to ping at a specific time.",
  cooldown: "5",
  usage: "noteto <id>",
};
