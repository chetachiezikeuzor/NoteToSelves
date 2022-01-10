require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");
let packageFile = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Discord.Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about the bot."),

  async execute(interaction) {
    if (interaction) {
      let botping = new Date() - interaction.createdAt;
      let totalSeconds = process.uptime();
      let realTotalSecs = Math.floor(totalSeconds % 60);
      let days = Math.floor((totalSeconds % 31536000) / 86400);
      let hours = Math.floor((totalSeconds / 3600) % 24);
      let mins = Math.floor((totalSeconds / 60) % 60);
      let used = process.memoryUsage().heapUsed / 1024 / 1024;

      const cmdArr = [...client.commands].map(([name, value]) => ({
        name,
        value,
      }));

      let embed = new Discord.MessageEmbed()
        .setTitle("Information")
        .setColor(process.env.color_blue)
        .setTimestamp()
        .setThumbnail(interaction.client.user.avatarURL())
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
          }MB\`\nAPI Ping - \`${Math.floor(botping)}ms\`\n`
        );

      interaction.reply({ embeds: [embed] });
    }
  },
};
