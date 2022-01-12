const Discord = require("discord.js");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { timeZonesList } = require("../utils/constants");
const { getTimezoneOffset } = require("../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timezonelist")
    .setDescription("Lists most popular timezones."),
  usage: "",
  async execute(client, interaction) {
    if (interaction) {
      let embed = new Discord.MessageEmbed()
        .setColor(process.env.color_gray)
        .setTitle("Timezone Usage")
        .setDescription(
          `**Usage:**\n\`/timezone <number>\`\n\n**Example:**\n\`/timezone -4\`
    \n You can use one of the popular timezones below, otherwise click [here](https://gist.github.com/JellyWX/913dfc8b63d45192ad6cb54c829324ee)`
        )
        .setTimestamp();

      timeZonesList.forEach((timeZone) => {
        embed.addField(
          `${timeZone}`,
          `🕓 ${getTimezoneOffset(timeZone)}`,
          true
        );
      });

      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then((u) => {
        if (!u) {
          return;
        } else {
          embed.setFooter({
            text: `${u.offset}`,
          });
        }
      });

      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
