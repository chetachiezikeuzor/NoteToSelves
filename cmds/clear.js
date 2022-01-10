const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
  data: {
    name: "clear",
    description: "Removes all active reminders.",
  },
  run(interaction) {
    const { options, user } = interaction;
    const args = options.map((option) => option.value);
    userSchema.findById(user.id).then((u) => {
      if (u) {
        u.reminders = [];
        u.save();
      }
      interaction.reply("All reminders removed successfully.");
    });
  },
};
