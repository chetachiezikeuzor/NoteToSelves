const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
  data: {
    name: "list",
    description: "Lists all active reminders.",
  },
  run(interaction) {
    const { options, user } = interaction;
    userSchema.findById(user.id).then((u) => {
      if (!u) {
        interaction.reply(embeds.noReminders());
      } else {
        console.log(u.reminders);
        if (u.reminders.length == 0) interaction.reply(embeds.noReminders());
        else interaction.reply("Hello");
      }
    });
  },
};
