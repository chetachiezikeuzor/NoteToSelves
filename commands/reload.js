const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.author.id !== "800615371009949697")
    return message.reply("This is a developer only command.");

  if (!args[0] || args.size < 1)
    return message.reply("Must provide a command name to reload.");
  let commandName = args[0];
  if (!client.commands.has(commandName)) {
    return message.reply("That command does not exist.");
  }

  delete require.cache[require.resolve(`./${commandName}.js`)];

  try {
    let props = require(`./${commandName}.js`);
    client.commands.delete(commandName);
    client.commands.set(commandName, props);
  } catch (e) {
    let embed = new Discord.MessageEmbed()
      .setAuthor({
        name: "An error occured!",
        iconURL: "https://i.imgur.com/PZ9qLe7.png",
      })
      .setDescription(`${e}`)
      .setColor(process.env.color_red)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  let embed = new Discord.MessageEmbed()
    .setAuthor({
      name: "Reload Successful!",
      iconURL: "https://i.imgur.com/r6615Ei.png",
    })
    .setDescription(`Reloaded **${commandName}.js**!`)
    .setColor(process.env.color_green)
    .setTimestamp();

  console.log(`[Commands] Manual reload of ${commandName}.js completed!`);
  return message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: "reload",
  description: "Reload a command.",
  cooldown: "0",
  usage: "reload <command>",
  dev: true,
};
