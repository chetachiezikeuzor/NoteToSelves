module.exports = (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (
    message.content.indexOf(process.env.prefix) !== 0 &&
    message.content.indexOf(process.env.prefix.toUpperCase()) !== 0
  )
    return;

  const args = message.content
    .slice(process.env.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);

  if (!cmd) return;

  cmd.run(client, message, args);
};
