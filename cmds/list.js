const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
  data: {
    name: "list",
    description: "Lists all active reminders.",
  },
  run(interaction) {
    const { options, user } = interaction;
    if (interaction)
      userSchema.findById(user.id).then(async (u) => {
        if (!u) {
          await interaction.reply({ embeds: [embeds.noReminders()] });
        } else {
          console.log(u.reminders);
          if (u.reminders.length == 0)
            await interaction.reply({ embeds: [embeds.noReminders()] });
          else
            await interaction.reply({
              embeds: [embeds.remindersList(u.reminders, u.offset)],
            });
        }
      });
  },
};
