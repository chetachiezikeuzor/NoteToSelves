const moment = require("moment");
const parser = require("../utils/parser");
const Discord = require("discord.js");
const embeds = require("../embeds");
const { genericParserErrorMessage } = require("../utils/constants");
const userSchema = require("../models/user");

exports.run = async (client, message, args) => {
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
        date: reminderTime,
        msg: msg,
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

      message.lineReply("Hey")(embeds.remindersList(u.reminders, u.offset));
    }
  });
};

exports.help = {
  name: "noteto",
  description: "Sets a reminder to ping at a specific time.",
  cooldown: "5",
  usage: "noteto <id>",
};
