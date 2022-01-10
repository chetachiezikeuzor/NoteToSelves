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
  userSchema.findById(message.author.id).then(async (u) => {
    if (!u) {
      new userSchema({
        userID: message.author.id,
        reminders: [],
        offset: offset,
      }).save();
    } else {
      u.offset = offset;
      u.save();
    }

    let embed = new Discord.MessageEmbed()
      .setAuthor({
        name: `Hey ${message.author.tag},`,
        iconURL: "https://i.imgur.com/qLS6esg.png",
      })
      .setColor(process.env.color_blue)
      .setDescription(`Your time zone is now \`${offset}\` hours from UTC.`)
      .setColor(process.env.color_blue)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  });
};

exports.help = {
  name: "timezone",
  description: "Sets time zone offset from UTC (in hours).",
  cooldown: "0",
  usage: "timezone",
};
