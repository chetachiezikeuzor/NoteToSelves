const Discord = require("discord.js");
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
    .setTitle("Timezone Usage")
    .setDescription(
      `Usage:\n\`n!timezone\` <number>\/\nExample:\n\`n!timezone\` -4
    `
    )
    .setTimestamp();
  timeZonesList.forEach((timeZone) => {
    embed.addField(`${timeZone}`, `${getTimezoneOffset(timeZone)}`, true);
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

/**
 * "UTC"
    "Asia/Tokyo"
    "Japan"
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
    "Europe/London"
    "US/Central",
    "US/Pacific",
    "Europe/Moscow",
    "America/Chicago",
    "GMT"
 */
