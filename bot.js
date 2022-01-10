require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const userSchema = require("./models/user");
const commandFiles = fs.readdirSync("./commands");
const commands = [],
  data = [];
const config = require("./config.js");
const connection = mongoose.connection;
const client = new Discord.Client({
  disableMentions: "everyone",
  intents: ["GUILDS", "GUILD_MESSAGES"],
});
client.config = config.content;

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

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

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
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    if (error) console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.once("ready", () => {
  console.log("Bot started.");
  for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    commands.push(command);
    data.push(command.data);
  }
});

client.on("interaction", (interaction) => {
  if (!interaction.isCommand()) return;
  for (const command of commands) {
    if (interaction.commandName === command.data.name) {
      console.log(
        `${interaction.user.username} ran command ${command.data.name}.`
      );
      command.run(interaction);
    }
  }
});

client.on("message", async (message) => {
  if (!client.application.owner) await client.application.fetch();

  if (
    message.content.toLowerCase() === "!deploy" &&
    message.author.id === client.application.owner.id
  ) {
    await client.application.commands.create(data);
    message.channel.send("Created slash commands.");
  }
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
