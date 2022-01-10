const userSchema = require("../models/user");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { timeZonesList } = require("../utils/constants");
const { getTimezoneOffset } = require("../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timezonelist")
    .setDescription("Lists most popular timezones."),

  async execute(interaction) {
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

      userSchema.findById(interaction.user.id).then((u) => {
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
