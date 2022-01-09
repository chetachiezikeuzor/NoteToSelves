const Discord = require("discord.js");

module.exports = (client, error) => {
  console.error;
  let chetachi = client.users.get("800615371009949697");
  let embed = new Discord.RichEmbed()
    .setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
    .setDescription(error)
    .setColor(process.env.color_red)
    .setTimestamp();

  return chetachi.send(embed);
};
