const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!args[0]) {
    let embed = new Discord.MessageEmbed()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.avatarURL(),
      })
      .setColor(process.env.color_blue)
      .setDescription(`I've sent the help menu to your DMs!`);

    let helpFirst = new Discord.MessageEmbed()
      .setColor(process.env.color_blue)
      .setTitle("About")
      .setDescription(
        `${client.user} is a discord bot that allows you to search for beautiful\nphotos from **Unsplash.com**! All photos belong to their rightful owners\nand are publicly accessible via [Unsplash](https://unsplash.com/). \n\n Chetachi ❤️`
      );

    let helpSecond = new Discord.MessageEmbed()
      .setColor(process.env.color_blue)
      .setTitle("Commands")
      .setDescription(
        `Type \`${process.env.prefix}help [command]\` to get information about a command.\n\n` +
          client.commands
            .filter((cmd) => !cmd.help.dev)
            .map((cmd) => `\`${cmd.help.name}\` - ${cmd.help.description}`)
            .join("\n")
      );

    return message.author
      .send({ embeds: [helpFirst] })
      .then(() =>
        message.author
          .send({ embeds: [helpSecond] })
          .then(() => message.channel.send({ embeds: [embed] }))
      )
      .catch(() => {
        let error = new Discord.MessageEmbed()
          .setAuthor({
            name: "An error occured!",
            iconURL: "https://i.imgur.com/PZ9qLe7.png",
          })
          .setDescription("Could not send a DM!")
          .setColor(process.env.color_blue)
          .setTimestamp();

        return message.channel.send({ embeds: [error] });
      });
  } else if (args[0]) {
    let command = client.commands.get(args[0]);
    if (!command) return message.reply("Please enter a valid command!");

    let props = require(`./${args[0]}.js`);

    let embed = new Discord.MessageEmbed()
      .setTitle(`Command`)
      .setColor(process.env.color_blue)
      .setDescription(
        `**Name:** ${props.help.name}\n**Description:** ${props.help.description}\n**Cooldown:** ${props.help.cooldown} seconds\n**Usage:** ${process.env.prefix}${props.help.usage}`
      );

    message.channel.send({ embeds: [embed] });
  }
};

exports.help = {
  name: "help",
  description: "Display the help menu or get information about a command.",
  cooldown: "0",
  usage: "help [command]",
};
