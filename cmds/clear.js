const moment = require("moment");
const parser = require("../utils/parser");
const embeds = require("../embeds");
const Discord = require("discord.js");
const {
  genericParserErrorMessage,
  dateFormatString,
} = require("../utils/constants");
const userSchema = require("../models/user");

module.exports = {
  data: {
    name: "clear",
    description: "Removes all active reminders.",
  },
  run(interaction) {
    const { options, user } = interaction;
    userSchema.findById(user.id).then(async (u) => {
      let numReminders;
      if (u) {
        numReminders = u.reminders.length;
        u.reminders = [];
        u.save();
      }

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: user.tag,
          iconURL: user.avatarURL(),
        })
        .setColor(process.env.color_blue)
        .setDescription(
          `I have cleared all **${numReminders}** active reminders for you`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    });
  },
};
