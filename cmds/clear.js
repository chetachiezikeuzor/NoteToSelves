const Discord = require("discord.js");
const userSchema = require("../models/user");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Removes all active reminders."),

  async execute(interaction) {
    if (interaction) {
      userSchema.findById(interaction.user.id).then(async (u) => {
        let numReminders;
        if (u) {
          numReminders = u.reminders.length;
          u.reminders = [];
          u.save();
        }

        let embed = new Discord.MessageEmbed()
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
      });
    }
  },
};
