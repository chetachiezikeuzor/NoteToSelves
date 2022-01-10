const userSchema = require("../models/user");
const embeds = require("../embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Removes a specific reminder by ID.")
  .addStringOption((option) =>
    option
      .setName("index")
      .setRequired(true)
      .setDescription("The position of the reminder in the list to delete")
  );

module.exports = {
  data: { data },
  run(interaction) {
    const { options, user } = interaction;
    const args = options.map((option) => option.value);
    let idx = parseInt(args[0]);
    userSchema.findById(user.id).then((u) => {
      if (!u || isNaN(idx) || idx < 0 || idx >= u.reminders.length) {
        interaction.reply(
          embeds.error(
            "Invalid id. The id should be an integer obtained from the `list` command."
          )
        );
      } else {
        u.reminders.splice(idx, 1);
        u.save();
        interaction.reply(embeds.remindersList(u.reminders, u.offset));
      }
    });
  },
};
