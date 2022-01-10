const Discord = require("discord.js");
const userSchema = require("../models/user");

exports.run = async (client, message, args) => {
  userSchema.findById(user.id).then((u) => {
    let numReminders;
    if (u) {
      numReminders = u.reminders.length;
      u.reminders = [];
      u.save();
    }

    let embed = new Discord.MessageEmbed()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.avatarURL(),
      })
      .setColor(process.env.color_blue)
      .setDescription(
        `I have snoozed **${numReminders}** active reminders for you`
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  });
};

exports.help = {
  name: "clear",
  description: "Removes all active reminders.",
  cooldown: "5",
  usage: "clear",
};
