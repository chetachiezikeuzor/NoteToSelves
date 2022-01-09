const Discord = require("discord.js");
const { Scheduler } = require("../utils/scheduler");

let bot = new Discord.Client();
let scheduler = new Scheduler(bot);

exports.run = async (client, message, args) => {
  let messageContent = message.content.substring(1);
  let parameters = messageContent.substring(messageContent.indexOf(" ") + 1);

  if (!client.cooldownPhoto) {
    client.cooldownPhoto = new Set();
  }

  let cooldownEmbed = new Discord.MessageEmbed()
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setColor(process.env.color_pink)
    .setDescription(
      `Please wait ${exports.help.cooldown} seconds between commands.`
    );

  if (client.cooldownPhoto.has(message.author.id))
    return message.channel.send({ embeds: [cooldownEmbed] });

  client.cooldownPhoto.add(message.author.id);
  setTimeout(() => {
    client.cooldownPhoto.delete(message.author.id);
  }, exports.help.cooldown * 1000);

  scheduler.setReminder(message.author.id, message.channel, parameters);
};

exports.help = {
  name: "modify",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "modify <id>",
};
