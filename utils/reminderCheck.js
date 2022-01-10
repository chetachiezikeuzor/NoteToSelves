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

const checkForReminders = () => {
  userSchema.each.then(async (u) => {});
  db.serialize(() => {
    // Select all messages older than the current dateTime
    db.each(
      "SELECT id, reminderTime, userID, message FROM reminders WHERE reminderTime < DATETIME()",
      (error, row) => {
        if (error || !row) {
          return console.log("Error or no row found");
        }

        // If reminders are found, fetch userIDs, then send the requested reminder through DM
        client.users.fetch(row.userID).then((user) => {
          user
            .send(
              `Hi, you asked to be reminded "${row.message}" - That's right now!`
            )
            .catch(console.error);
          console.log(`Message delivered: ${row.message}`);
          console.log(`Message deleted successfully`);

          // Delete message after DMing to user
          db.run("DELETE FROM reminders WHERE id = ?", [row.id]);
          console.log("Message sent and removed successfully");
        });
      }
    );
  });
};

module.exports = checkForReminders;
