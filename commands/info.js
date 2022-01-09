const Discord = require("discord.js");
const fs = require("fs");

let packageFile = JSON.parse(fs.readFileSync("./package.json", "utf8"));

exports.run = async (client, message, args) => {
  let botping = new Date() - message.createdAt;

  let totalSeconds = process.uptime();
  let realTotalSecs = Math.floor(totalSeconds % 60);
  let days = Math.floor((totalSeconds % 31536000) / 86400);
  let hours = Math.floor((totalSeconds / 3600) % 24);
  let mins = Math.floor((totalSeconds / 60) % 60);
  let used = process.memoryUsage().heapUsed / 1024 / 1024;

  const cmdArr = [...client.commands].map(([name, value]) => ({ name, value }));

  let embed = new Discord.MessageEmbed()
    .setTitle("Information")
    .setColor(process.env.color_pink)
    .setTimestamp()
    .setThumbnail(client.user.avatarURL())
    .setDescription(
      `Creator - \`Chetachi ❤️\`\nPrefix - \`${
        process.env.prefix
      }\`\nVersion - \`v${packageFile.version}\`\nCommands - \`${
        cmdArr.length - 1
      }\`\nGuilds - \`${client.guilds.cache.size}\`\nChannels - \`${
        client.channels.cache.size
      }\`\nUsers - \`${
        client.users.cache.size
      }\`\nUptime - \`${days}d ${hours}h ${mins}m ${realTotalSecs}s\`\nMemory Usage - \`${
        Math.round(used * 100) / 100
      }MB\`\nAPI Ping - \`${Math.floor(client.ws.ping)}ms\`\n`
    );

  message.channel.send({ embeds: [embed] });
};

exports.help = {
  name: "info",
  description: "Get information about the bot.",
  cooldown: "0",
  usage: "info",
};
