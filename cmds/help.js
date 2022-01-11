const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "Displays the help menu or gets information about a command."
    )
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Get help using a command.")
        .setRequired(false)
        .addChoice("clear", "clear")
        .addChoice("help", "help")
        .addChoice("info", "info")
        .addChoice("list", "list")
        .addChoice("note", "note")
        .addChoice("timezone", "timezone")
        .addChoice("timezonelist", "timezonelist")
    ),
  usage: "command: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("command");

      if (!choice) {
        let embed = new Discord.MessageEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          })
          .setColor(process.env.color_blue)
          .setDescription(`I've sent the help menu to your DMs!`);

        let helpFirst = new Discord.MessageEmbed()
          .setColor(process.env.color_blue)
          .setTitle("About")
          .setDescription(
            `${client.user} is a discord bot that allows you to create note reminders!\nPlease look to the list of commands below to see all that you can do with the bot.\n\n Chetachi ❤️`
          );

        let helpSecond = new Discord.MessageEmbed()
          .setColor(process.env.color_blue)
          .setTitle("Commands")
          .setDescription(
            `Type \`${process.env.prefix}help [command]\` to get information about a command.\n\n` +
              client.commands
                .map((cmd) => `\`${cmd.data.name}\` - ${cmd.data.description}`)
                .join("\n")
          );

        return interaction.user
          .send({ embeds: [helpFirst] })
          .then(() =>
            interaction.user
              .send({ embeds: [helpSecond] })
              .then(() => interaction.reply({ embeds: [embed] }))
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

            return interaction.reply({ embeds: [error] });
          });
      } else if (choice) {
        let command = client.commands.get(choice);
        if (!command) return interaction.reply("Please enter a valid command!");

        let props = require(`./${choice}.js`);

        let embed = new Discord.MessageEmbed()
          .setTitle(`Command`)
          .setColor(process.env.color_blue)
          .setDescription(
            `**Name:** ${props.data.name}\n**Description:** ${props.data.description}\n**Usage:** \`${process.env.prefix}${props.usage}\``
          );

        interaction.reply({ embeds: [embed] });
      }
    }
  },
};
