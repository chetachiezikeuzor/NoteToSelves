const Discord = require("discord.js");
const embeds = require("../embeds");
const userSchema = require("../models/user");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists all active reminders."),
  async execute(interaction) {
    if (interaction)
      userSchema.findById(interaction.user.id).then(async (u) => {
        if (!u) {
          await interaction.reply({ embeds: [embeds.noReminders()] });
        } else {
          console.log(u.reminders);
          if (u.reminders.length == 0)
            await interaction.reply({ embeds: [embeds.noReminders()] });
          else
            await interaction.reply({
              embeds: [embeds.remindersList(u.reminders, u.offset)],
            });
        }
      });
  },
};
