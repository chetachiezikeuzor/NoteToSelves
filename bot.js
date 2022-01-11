require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const userSchema = require("./models/user");
const channelSchema = require("../models/channel");
const { Client, Intents } = require("discord.js");
const commands = [];
const commandFiles = fs
  .readdirSync("./cmds/")
  .filter((file) => file.endsWith(".js"));
const config = require("./config.js");
const connection = mongoose.connection;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.config = config.content;
client.commands = new Discord.Collection();

mongoose.connect(process.env.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .once("open", () => {
    console.log("MongoDB database connection established successfully");
  })
  .on("error", (e) => {
    console.log("Connection error:", e);
  });

for (const file of commandFiles) {
  console.log("[Commands] Loading...");
  const command = require(`./cmds/${file}`);
  commands.push(command.data.toJSON());
  console.log(`[Commands] Loaded ${command.data.name}`);
  client.commands.set(command.data.name, command);
}

const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        `${process.env.clientId}`,
        `${process.env.sw_guildId}`
      ),
      { body: commands }
    );

    await rest.put(
      Routes.applicationGuildCommands(
        `${process.env.clientId}`,
        `${process.env.c_guildId}`
      ),
      { body: commands }
    );

    console.log(`[Commands] Loaded ${commands.length} commands!`);
  } catch (error) {
    console.error(error);
  }
})();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

let interval = 60000;
let delay = (60 - new Date().getSeconds()) * 1000;
let expected = Date.now() + delay;
setTimeout(step, delay);
function step() {
  let dt = Date.now() - expected;
  if (dt > interval) {
    setTimeout(step, -dt);
  } else {
    const now = new Date();
    userSchema.find().then((userList) => {
      for (const user of userList) {
        for (let i = 0; i < user.reminders.length; i++) {
          if (user.reminders[i].date <= now.getTime()) {
            let m = user.reminders[i].msg;
            client.users.fetch(user._id).then((u) => {
              let embed = new Discord.MessageEmbed()
                .setAuthor({
                  name: "Reminder",
                  iconURL: `https://i.imgur.com/qLS6esg.png`,
                })
                .setColor(process.env.color_blue)
                .setDescription(`Hey **<@${u.id}>**, remember **"${m}"**.`)
                .setTimestamp();

              u.send({ embeds: [embed] });
              console.log(u.username + ' was sent the reminder "' + m + '"');
            });
            user.reminders.splice(i, 1);
            i--;
          }
        }
        user.save();
      }
    });

    channelSchema.find().then((channelList) => {
      for (const channel of channelList) {
        for (let i = 0; i < channel.reminders.length; i++) {
          if (channel.reminders[i].date <= now.getTime()) {
            let m = channel.reminders[i].msg;
            client.channels.fetch(channel._id).then((c) => {
              let embed = new Discord.MessageEmbed()
                .setAuthor({
                  name: "Reminder",
                  iconURL: `https://i.imgur.com/qLS6esg.png`,
                })
                .setColor(process.env.color_blue)
                .setDescription(`**<#${c.id}>**, remember **"${m}"**.`)
                .setTimestamp();

              c.send({ embeds: [embed] });
              console.log(c.name + ' was sent the reminder "' + m + '"');
            });
            channel.reminders.splice(i, 1);
            i--;
          }
        }
        channel.save();
      }
    });
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt));
  }
}

client.login(process.env.token);
