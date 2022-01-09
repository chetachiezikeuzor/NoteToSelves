module.exports = (client, interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.user) return;
  if (!interaction.guild) return;

  const command = interaction.commandName;

  const cmd = client.commands.get(command);

  if (!cmd) return;

  cmd.run(interaction);
};
