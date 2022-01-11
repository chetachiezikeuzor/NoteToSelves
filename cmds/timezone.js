const Discord = require("discord.js");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timezone")
    .setDescription("Sets time zone offset from UTC (in hours).")
    .addStringOption((option) =>
      option
        .setName("offset")
        .setDescription("The number used to set your offset value.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("for")
        .setDescription("Where you'd like the timezone to be set.")
        .setRequired(true)
        .addChoice("self", "self")
        .addChoice("channel", "channel")
    ),
  usage: "offset: <number>, for: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const offset = interaction.options.getString("offset");
      const choice = interaction.options.getString("for");
      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);
      if (isNaN(offset) || offset < -11 || offset > 14) {
        await interaction
          .reply({
            embeds: [
              new Discord.MessageEmbed()
                .setAuthor({
                  name: "An error occured!",
                  iconURL: "https://i.imgur.com/PZ9qLe7.png",
                })
                .setDescription(
                  "Invalid offset. The value must be an integer between `-11` and `14`."
                )
                .setColor(process.env.color_red)
                .setTimestamp(),
            ],
            ephemeral: true,
          })
          .then((msg) => {
            msg.delete({ timeout: 10000 });
          });
        return;
      }

      finder.then(async (u) => {
        if (!u) {
          choice == "self"
            ? new userSchema({
                _id: interaction.user.id,
                reminders: [],
                offset: offset,
              }).save()
            : new channelSchema({
                _id: interaction.channel.id,
                reminders: [],
                offset: offset,
              }).save();
        } else {
          u.offset = offset;
          u.save();
        }

        let embed = new Discord.MessageEmbed()
          .setAuthor({
            name: `Timezone Set`,
            iconURL: "https://i.imgur.com/qLS6esg.png",
          })
          .setColor(process.env.color_blue)
          .setDescription(
            `${
              choice === "self" ? `Your` : `The`
            } time zone is has been set to \`${offset}\`\nhours from UTC.`
          )
          .setColor(process.env.color_blue)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      });
    }
  },
};
