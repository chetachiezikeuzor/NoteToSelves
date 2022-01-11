const fs = require("fs");

module.exports = (client) => {
  console.log(
    `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
  );
  console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})\n`);

  client.user.setStatus("available");
  client.user.setPresence({
    status: "online",
    game: {
      name: process.env.activityMessage,
      type: process.env.activityType,
    },
  });
};
