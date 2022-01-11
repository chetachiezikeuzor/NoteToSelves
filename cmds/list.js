const embeds = require("../embeds");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists all active reminders.")
    .addStringOption((option) =>
      option
        .setName("for")
        .setDescription("Which list you'd like to see.")
        .setRequired(true)
        .addChoice("self", "self")
        .addChoice("channel", "channel")
    ),

  usage: "for: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("for");

      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then(async (u) => {
        if (!u) {
          await interaction.reply({ embeds: [embeds.noReminders()] });
        } else {
          console.log(u.reminders);
          if (u.reminders.length == 0)
            await interaction.reply({ embeds: [embeds.noReminders()] });
          else
            await interaction.reply({
              embeds: [embeds.remindersList(u.reminders, u.offset, choice)],
            });
        }
      });
    }
  },
};
