const userSchema = require("../models/user");
const embeds = require("../embeds");

module.exports = {
  data: {
    name: "timezone",
    description: "Sets your current time zone offset from UTC (in hours).",
    options: [
      {
        name: "offset",
        type: "INTEGER",
        description:
          "The difference between your local time and UTC (in hours).",
        required: true,
      },
    ],
  },
  run(interaction) {
    const { options, user } = interaction;
    const args = options.map((option) => option.value);
    const offset = parseInt(args[0]);
    if (isNaN(offset) || offset < -11 || offset > 14) {
      interaction.reply(
        embeds.error(
          "Invalid offset. The value must be an integer between `-11` and `14`."
        )
      );
      return;
    }
    userSchema.findById(user.id).then((u) => {
      if (!u) {
        new userSchema({
          _id: user.id,
          reminders: [],
          offset: offset,
        }).save();
      } else {
        u.offset = offset;
        u.save();
      }
      interaction.reply(`Your time zone is now \`${offset}\` hours from UTC.`);
    });
  },
};
