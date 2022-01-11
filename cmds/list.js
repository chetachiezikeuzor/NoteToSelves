const embeds = require("../embeds");
const userSchema = require("../models/user");
const channelSchema = require("../models/channel");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists all active reminders.")
    .addStringOption((option) =>
      option
        .setName("for")
        .setDescription("Which list you'd like to see.")
        .setRequired(true)
        .addChoice("self", "self")
        .addChoice("channel", "channel")
    ),

  usage: "",
  async execute(client, interaction) {
    if (interaction) {
      const choice = interaction.options.getString("for");

      const finder =
        choice == "self"
          ? userSchema.findById(interaction.user.id)
          : channelSchema.findById(interaction.channel.id);

      finder.then(async (u) => {
        if (!u) {
          await interaction.reply({ embeds: [embeds.noReminders()] });
        } else {
          console.log(u.reminders);
          if (u.reminders.length == 0)
            await interaction.reply({ embeds: [embeds.noReminders()] });
          else {
            const embed = new Discord.MessageEmbed()
              .setColor(process.env.color_blue)
              .setTitle("Reminders List")
              .setDescription(
                `Here is ${(choice = "self"
                  ? `your`
                  : `the channel's`)} reminders list:`
              );
            if (u.reminders.length === 0)
              embed.setDescription("There are no active reminders.");
            else
              u.reminders.forEach((reminder, idx) => {
                embed
                  .addField(
                    "Date",
                    `${dateStr(reminder.date + u.offset * 60 * 60 * 1000)}`,
                    true
                  )
                  .addField("Message", `${reminder.msg}`, true)
                  .addField("ID", `${idx}`, true);
              });
            await interaction.reply({
              embeds: [embed],
            });
          }
        }
      });
    }
  },
};
