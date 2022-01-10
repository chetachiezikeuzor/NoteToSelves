const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
  data: {
    name: "list",
    description: "Lists all active reminders.",
  },
  run(interaction) {
    const { options, user } = interaction;
    userSchema.findById(user.id).then(async (u) => {
      if (!u) {
        await interaction.reply({ embed: [embeds.noReminders()] });
      } else {
        console.log(u.reminders);
        if (u.reminders.length == 0)
          await interaction.reply({ embed: [embeds.noReminders()] });
        else
          await interaction.reply({
            embeds: [embeds.remindersList(u.reminders, u.offset)],
          });
      }
    });
  },
};
