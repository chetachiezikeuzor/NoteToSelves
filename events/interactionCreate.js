const fs = require("fs");
const commandFiles = fs.readdirSync("../cmds/");
const commands = [];
for (const file of commandFiles) {
  const command = require(`../cmds/${file}`);
  commands.push(command.data);
}
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
