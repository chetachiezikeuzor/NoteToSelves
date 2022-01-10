const Discord = require("discord.js");
const userSchema = require("../models/user");

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
  userSchema.findById(message.author.id).then((u) => {
    if (!u) {
      new userSchema({
        _id: message.author.id,
        reminders: [],
        offset: offset,
      }).save();
    } else {
      u.offset = offset;
      u.save();
    }
    message.reply(`Your time zone is now \`${offset}\` hours from UTC.`);
  });
};

exports.help = {
  name: "timezone",
  description: "Sets your current time zone offset from UTC (in hours).",
  cooldown: "0",
  usage: "timezone",
};
