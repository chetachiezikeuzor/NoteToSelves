module.exports = (client, interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    command.execute(client, interaction);
  } catch (error) {
    console.error(error);
  }
};
