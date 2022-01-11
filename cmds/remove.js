const Discord = require("discord.js");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a specific reminder by ID.")
    .addStringOption((option) =>
      option
        .setName("for")
        .setDescription("Where you'd like to remoce a reminder.")
        .setRequired(true)
        .addChoice("self", "self")
        .addChoice("channel", "channel")
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The reminder to remove.")
        .setRequired(true)
    ),
  usage: "",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("for");
      let idx = parseInt(interaction.options.getString("id"));
      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then(async (u) => {
        if (!u || isNaN(idx) || idx < 0 || idx >= u.reminders.length) {
          await message.channel.send({
            embeds: [
              new Discord.MessageEmbed()
                .setAuthor({
                  name: "An error occured!",
                  iconURL: "https://i.imgur.com/PZ9qLe7.png",
                })
                .setDescription(
                  "Invalid id. The id should be an integer obtained from the `list` command."
                )
                .setColor(process.env.color_red)
                .setTimestamp(),
            ],
          });
          return;
        } else {
          u.reminders.splice(idx, 1);
          u.save();
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.color_blue)
            .setTitle("Reminders List")
            .setDescription(
              `Here is ${(choice = "self"
                ? `your`
                : `the channel's`)} reminders list:`
            );
          if (u.reminders.length === 0)
            embed.setDescription("There are no active reminders.");
          else
            u.reminders.forEach((reminder, idx) => {
              embed
                .addField(
                  "Date",
                  `${dateStr(reminder.date + u.offset * 60 * 60 * 1000)}`,
                  true
                )
                .addField("Message", `${reminder.msg}`, true)
                .addField("ID", `${idx}`, true);
            });
          interaction.reply({
            embeds: [embed],
          });
        }
      });
    }
  },
};
