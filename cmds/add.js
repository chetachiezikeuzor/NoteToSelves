const userSchema = require("../models/user");
const embeds = require("../embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Sets a reminder to ping you at a specific time.")
  .addStringOption((option) =>
    option
      .setName("message")
      .setRequired(true)
      .setDescription("The message you will get pinged with.")
  )

  .addStringOption((option) =>
    option
      .setName("time")
      .setRequired(true)
      .setDescription("The time at which you'd like to be reminded.")
  );

module.exports = {
  data: { data },
  run(interaction) {
    const { options, user } = interaction;
    const args = options.map((option) => option.value);
    userSchema.findById(user.id).then((u) => {
      if (!u) {
        interaction.reply(
          embeds.error(
            "Use `/timezone` to set your time zone before you can add reminders."
          )
        );
      } else {
        interaction.reply("Yo");
      }
    });
  },
};
