const { SlashCommandBuilder } = require("@discordjs/builders");

exports.run = async (interaction) => {
  interaction.reply({ content: "Pong" });
};

exports.help = {
  name: "pingr",
  description: "Sets a reminder to ping you at a specific time.",
  usage: "pingr <id>",
};
