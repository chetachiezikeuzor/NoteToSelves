const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a specific command.")
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
        .addChoice("purge", "purge")
        .addChoice("remove", "remove")
        .addChoice("timezone", "timezone")
        .addChoice("timezonelist", "timezonelist")
    ),
  usage: "command: <string>",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("command");

      if (interaction.user.id !== "800615371009949697")
        return interaction.reply("This is a developer only command.");

      if (!choice)
        return interaction.reply("Must provide a command name to reload.");
      let commandName = choice;
      if (!client.commands.has(commandName)) {
        return interaction.reply("That command does not exist.");
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

        return interaction
          .reply({ embeds: [embed], ephemeral: true })
          .then((msg) => {
            msg.delete({ timeout: 10000 });
          });
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
      return interaction.reply({ embeds: [embed] });
    }
  },
};
