require("dotenv").config();
const fs = require("fs");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const { APIMessage } = require("discord.js");

const Discord = require("discord.js");
const userSchema = require("./models/user");
const Commands = [];
const cmdFiles = readdirSync("./comds/").filter((file) => file.endsWith(".js"));
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

client.on("ready", async () => {
  for (const fileName of cmdFiles) {
    const File = require(`./comds/${fileName}`);
    Commands.push(File);
    await client.api.applications(client.user.id).commands.post({
      data: {
        name: File.name,
        description: File.description,
        options: File.options,
      },
    });
  }
  console.info(`Logged in as ${client.user.username}`);
});

client.ws.on("INTERACTION_CREATE", (interaction) => {
  const CMDFile = Commands.find(
    (cmd) => cmd.name.toLowerCase() === interaction.data.name.toLowerCase()
  );
  if (CMDFile)
    CMDFile.execute(client, say, interaction, interaction.data.options);
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

async function say(interaction, content) {
  return client.api
    .interactions(interaction.id, interaction.token)
    .callback.post({
      data: {
        type: 4,
        data: await createAPIMessage(interaction, content),
      },
    });
}

async function createAPIMessage(interaction, content) {
  const apiMessage = await APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  )
    .resolveData()
    .resolveFiles();
  return { ...apiMessage.data, files: apiMessage.files };
}

client.login(process.env.token);
