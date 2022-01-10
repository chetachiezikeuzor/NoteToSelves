const moment = require("moment");
const parser = require("../utils/parser");
const Discord = require("discord.js");
const {
  genericParserErrorMessage,
  dateFormatString,
} = require("../utils/constants");
const userSchema = require("../models/user");
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
    ),

  async execute(interaction) {
    if (interaction)
      userSchema.findById(interaction.user.id).then(async (u) => {
        const parameters = `${interaction.options.getString(
          "message"
        )} ${interaction.options.getString("time")}`;
        console.log(parameters);

        if (!u) {
          await interaction.reply({
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
              `On **${reminderTime.format(
                dateFormatString
              )}**,\nI will remind you: **"${reminder.message}"**`
            )
            .setColor(process.env.color_blue)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }
      });
  },
};
