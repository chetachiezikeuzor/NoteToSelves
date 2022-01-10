const Discord = require("discord.js");
const embeds = require("../embeds");
const userSchema = require("../models/user");

import momentTZ from "moment-timezone";

const defaultTimeZone = momentTZ.tz.guess();
const timeZonesList = momentTZ.tz.names();

function getTimezoneOffset(timeZone) {
  const now = new Date();
  const tzString = now.toLocaleString("en-US", { timeZone });
  const localString = now.toLocaleString("en-US");
  const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
  const offset = diff + now.getTimezoneOffset() / 60;

  return -offset;
}

let date = new Date();
timeZonesList.forEach((timeZone) => {
  let strTime = date.toLocaleString("en-US", {
    timeZone: `${timeZone}`,
  });
  console.log(timeZone, strTime);
});

exports.run = async (client, message, args) => {
  const offset = parseInt(args[0]);
  if (isNaN(offset) || offset < -11 || offset > 14) {
    await message.channel.send({
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
    });
    return;
  }
  let embed = new Discord.MessageEmbed()
    .setTitle("Timezone Usage")
    .setDescription(
      `Usage:\n\`!ntimezone\` <number>\/\nExample:\n\`!ntimezone\` -4
    `
    )
    .setColor(process.env.color_blue)
    .setTimestamp();

  timeZonesList.forEach((timeZone) => {
    const offset = getTimezoneOffset(timeZone);
    embed.addField(`${timeZone}`, `${offset}`, true);
  });
  await message.channel.send({
    embeds: [embed],
  });
  return;
};

exports.help = {
  name: "timezone",
  description: "Sets your current time zone offset from UTC (in hours).",
  cooldown: "0",
  usage: "timezone",
};
