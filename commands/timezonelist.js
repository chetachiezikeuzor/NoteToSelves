const Discord = require("discord.js");
const userSchema = require("../models/user");
const { timeZonesList } = require("../utils/constants");
const { getTimezoneOffset } = require("../utils/functions");

exports.run = async (client, message, args) => {
  let embed = new Discord.MessageEmbed()
    .setColor(process.env.color_gray)
    .setTitle("Timezone Usage")
    .setDescription(
      `**Usage:**\n\`n!timezone <number>\`\n\n**Example:**\n\`n!timezone -4\`
    \n You can use one of the popular timezones below, otherwise click [here](https://gist.github.com/JellyWX/913dfc8b63d45192ad6cb54c829324ee)`
    )
    .setTimestamp();

  timeZonesList.forEach((timeZone) => {
    embed.addField(`${timeZone}`, `🕓 ${getTimezoneOffset(timeZone)}`, true);
  });
  userSchema.findById(message.author.id).then((u) => {
    if (!u) {
      return;
    } else {
      embed.setFooter({
        text: `${u.offset}`,
      });
    }
  });

  await message.channel.send({
    embeds: [embed],
  });
  return;
};

exports.help = {
  name: "timezonelist",
  description: "Get a list of the most popular timezones..",
  cooldown: "0",
  usage: "timezonelist",
};
