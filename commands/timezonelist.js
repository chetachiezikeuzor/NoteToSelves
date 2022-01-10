const Discord = require("discord.js");
const userSchema = require("../models/user");
const timeZonesList = [
  "UTC",
  "Asia/Tokyo",
  "Japan",
  "EST",
  "Asia/Manila",
  "America/New_York",
  "Europe/Berlin",
  "America/Los_Angeles",
  "Asia/Kolkata",
  "Asia/Jakarta",
  "US/Eastern",
  "CET",
  "Singapore",
  "Europe/Paris",
  "America/Sao_Paulo",
  "Europe/London",
  "US/Central",
  "US/Pacific",
  "Europe/Moscow",
  "America/Chicago",
  "GMT",
];

function getTimezoneOffset(timeZone) {
  const now = new Date();
  const tzString = now.toLocaleString("en-US", { timeZone });
  const localString = now.toLocaleString("en-US");
  const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
  const offset = diff + now.getTimezoneOffset() / 60;

  return -offset;
}

exports.run = async (client, message, args) => {
  let embed = new Discord.MessageEmbed()
    .setColor(process.env.color_gray)
    .setTitle("Timezone Usage")
    .setDescription(
      `**Usage:**\n\`n!timezone <number>\`\n\n**Example:**\n\`n!timezone -4\`
    \n You can use one of the popular timezones below, otherwise click [here](https://gist.github.com/JellyWX/913dfc8b63d45192ad6cb54c829324ee)`
    );

  timeZonesList.forEach((timeZone) => {
    embed.addField(`${timeZone}`, `🕝 ${getTimezoneOffset(timeZone)}`, true);
  });
  userSchema.findById(message.author.id).then((u) => {
    if (!u) {
      embed.setTimestamp();
    } else {
      embed.setTimestamp(u.offset);
    }
  });

  await message.channel.send({
    embeds: [embed],
  });
  return;
};

exports.help = {
  name: "timezonelist",
  description: "Sets your current time zone offset from UTC (in hours).",
  cooldown: "0",
  usage: "timezonelist",
};
