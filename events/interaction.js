const commandFiles = fs.readdirSync("./commands/");
const commands = [],
  data = [];

module.exports = (client, interaction) => {
  if (!interaction.isCommand()) return;

  for (const command of commands) {
    if (interaction.commandName === command.data.name) {
      console.log(
        `${interaction.user.username} ran command ${command.data.name}.`
      );
      command.run(interaction);
    }
  }
};
