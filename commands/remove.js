const Discord = require("discord.js");
const embeds = require("../embeds");
const userSchema = require("../models/user");

exports.run = async (client, message, args) => {
  let idx = parseInt(args[0]);
  userSchema.findById(message.author.id).then(async (u) => {
    if (!u || isNaN(idx) || idx < 0 || idx >= u.reminders.length) {
      await message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: "An error occured!",
              iconURL: "https://i.imgur.com/PZ9qLe7.png",
            })
            .setDescription(
              "Invalid id. The id should be an integer obtained from the `list` command."
            )
            .setColor(process.env.color_red)
            .setTimestamp(),
        ],
      });
      return;
    } else {
      u.reminders.splice(idx, 1);
      u.save();
      interaction.reply(embeds.remindersList(u.reminders, u.offset, choice));
    }
  });
};

exports.help = {
  name: "remove",
  description: "Removes a specific reminder by ID.",
  cooldown: "0",
  usage: "remove",
};
