const moment = require("moment");
const parser = require("../utils/parser");
const Discord = require("discord.js");
const {
  genericParserErrorMessage,
  dateFormatString,
} = require("../utils/constants");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Sets a reminder to ping at a specific time.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you will get pinged with.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time by which you'd like to be reminded.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("Where you'd like the note to be sent.")
        .setRequired(true)
        .addChoice("self", "self")
        .addChoice("channel", "channel")
    ),
  usage: "message: <string>, time: <string>, to: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const parameters = `${interaction.options.getString(
        "message"
      )} ${interaction.options.getString("time")}`;
      const choice = interaction.options.getString("to");

      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then(async (u) => {
        if (!u) {
          await interaction.reply({
            embeds: [
              new Discord.MessageEmbed()
                .setAuthor({
                  name: "An error occured!",
                  iconURL: "https://i.imgur.com/PZ9qLe7.png",
                })
                .setDescription(
                  "Use `/timezone` to set your time zone before you can add reminders."
                )
                .setColor(process.env.color_red)
                .setTimestamp(),
            ],
          });
        } else {
          if (!parser.validReminderString(parameters)) {
            await interaction.reply({
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
            await interaction.reply({
              embeds: [
                new Discord.MessageEmbed()
                  .setAuthor({
                    name: "An error occured!",
                    iconURL: "https://i.imgur.com/PZ9qLe7.png",
                  })
                  .setDescription(
                    "The time for this reminder has already passed."
                  )
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
              name: `Hey ${interaction.user.tag},`,
              iconURL: "https://i.imgur.com/qLS6esg.png",
            })
            .setColor(process.env.color_blue)
            .setDescription(
              `On **${reminderTime.format(dateFormatString)}**,\n${(choice =
                "self"
                  ? `I will remind you`
                  : `I will remind this channel`)}: **"${reminder.message}"**`
            )
            .setColor(process.env.color_blue)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }
      });
    }
  },
};
