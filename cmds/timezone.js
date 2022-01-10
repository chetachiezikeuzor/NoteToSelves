const Discord = require("discord.js");
const userSchema = require("../models/user");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timezone")
    .setDescription("Sets time zone offset from UTC (in hours).")
    .addStringOption((option) =>
      option
        .setName("offset")
        .setDescription("The number used to set your offset value.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const offset = interaction.options.getString("offset");
    if (isNaN(offset) || offset < -11 || offset > 14) {
      await interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: "An error occured!",
              iconURL: "https://i.imgur.com/PZ9qLe7.png",
            })
            .setDescription(
              "Invalid offset. The value must be an integer between `-11` and `14`."
            )
            .setColor(process.env.color_red)
            .setTimestamp(),
        ],
      });
      return;
    }
    userSchema.findById(interaction.user.id).then(async (u) => {
      if (!u) {
        new userSchema({
          userID: interaction.user.id,
          reminders: [],
          offset: offset,
        }).save();
      } else {
        u.offset = offset;
        u.save();
      }

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `Hey ${interaction.user.tag},`,
          iconURL: "https://i.imgur.com/qLS6esg.png",
        })
        .setColor(process.env.color_blue)
        .setDescription(`Your time zone is now \`${offset}\` hours from UTC.`)
        .setColor(process.env.color_blue)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    });
  },
};
