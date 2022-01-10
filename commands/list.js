const Discord = require("discord.js");
const userSchema = require("../models/user");
const { Scheduler } = require("../utils/scheduler");

let bot = new Discord.Client({
  disableMentions: "everyone",
  intents: ["GUILDS", "GUILD_MESSAGES"],
});
let scheduler = new Scheduler(bot);

exports.run = async (client, message, args) => {
  const { options, user } = interaction;
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

  userSchema.findById(user.id).then((u) => {
    if (!u) {
      interaction.reply(embeds.noReminders());
    } else {
      console.log(u.reminders);
      if (u.reminders.length == 0) interaction.reply(embeds.noReminders());
      else interaction.reply(embeds.remindersList(u.reminders, u.offset));
    }
  });
};

exports.help = {
  name: "list",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "list <id>",
};
