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
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("The reminder to remove.")
        .setRequired(true)
    ),
  usage: "for: <string>, id: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("for");
      let idx = interaction.options.getInteger("id");
      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then(async (u) => {
        if (!u || isNaN(idx) || idx < 0 || idx >= u.reminders.length) {
          await interaction
            .reply({
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
            })
            .then((msg) => {
              msg.delete({ timeout: 10000 });
            });
          return;
        } else {
          u.reminders.splice(idx, 1);
          u.save();
          interaction.reply(
            embeds.remindersList(u.reminders, u.offset, choice)
          );
        }
      });
    }
  },
};
