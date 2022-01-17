const Discord = require("discord.js");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Removes all active reminders.")
    .addStringOption((option) =>
      option
        .setName("for")
        .setDescription("Where you'd like to clear reminders.")
        .setRequired(true)
        .addChoice("self", "self")
        .addChoice("channel", "channel")
    )
    .addStringOption((option) =>
      option
        .setName("confirm")
        .setDescription("Are you sure?")
        .setRequired(true)
        .addChoice("yes", "yes")
        .addChoice("no", "no")
    ),
  usage: "for: <string>, confirm: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("for");
      const confirm = interaction.options.getString("confirm");

      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then(async (u) => {
        let numReminders;
        if (u && confirm == "yes") {
          numReminders = u.reminders.length;
          u.reminders = [];
          u.save();

          const embed = new Discord.MessageEmbed()
            .setAuthor({
              name: interaction.user.tag,
              iconURL: interaction.user.avatarURL(),
            })
            .setColor(process.env.color_blue)
            .setDescription(
              `I have cleared all **${numReminders}** active reminders for you`
            )
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else if (!u) {
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.color_blue)
            .setTitle("No Reminders")
            .setDescription("There are no reminders to clear.")
            .setTimestamp();
          await interaction.reply({ embeds: [embed] });
        } else if (!confirm == "yes") {
          const embed = new Discord.MessageEmbed()
            .setColor(process.env.color_blue)
            .setTitle("Cancel")
            .setDescription("No worries! I will not clear anything.")
            .setTimestamp();
          await interaction.reply({ embeds: [embed] });
        }
      });
    }
  },
};
