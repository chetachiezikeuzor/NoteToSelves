const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge up to 99 messages.")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Number of messages to purge")
    ),
  usage: "amount: <number>",
  async execute(client, interaction) {
    if (interaction) {
      const amount = interaction.options.getInteger("amount");

      if (amount <= 1 || amount > 100) {
        return interaction
          .reply({
            content: "You need to input a number between 1 and 99.",
            ephemeral: true,
          })
          .then((msg) => {
            msg.delete({ timeout: 10000 });
          });
      }
      await interaction.channel.bulkDelete(amount, true).catch((error) => {
        console.error(error);
        interaction
          .reply({
            content:
              "There was an error trying to purge messages in this channel!",
            ephemeral: true,
          })
          .then((msg) => {
            msg.delete({ timeout: 10000 });
          });
      });

      return interaction
        .reply({
          content: `Successfully purged \`${amount}\` messages.`,
          ephemeral: true,
        })
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }
  },
};
