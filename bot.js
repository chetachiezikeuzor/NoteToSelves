require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const userSchema = require("./models/user");
const { Client, Collection, Intents } = require("discord.js");
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

client.once("ready", () => {
  console.log("Ready!");
});

for (const file of commandFiles) {
  const command = require(`./cmds/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        `${process.env.clientId}`,
        `${process.env.guildId}`
      ),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
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
/*
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  console.log("[Commands] Loading...");
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    console.log(`[Commands] Loaded ${file}`);

    client.commands.set(props.help.name, props);
  });
  console.log(`[Commands] Loaded ${files.length} commands!`);
});*/

//setInterval(checkForReminders, 10000);

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
              u.send(`<@${u.id}> ${m}`);
              console.log(u.username + ' was sent the reminder "' + m + '"');
            });
            user.reminders.splice(i, 1);
            i--;
          }
        }
        user.save();
      }
    });
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt));
  }
}

client.login(process.env.token);
