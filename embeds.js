const Discord = require("discord.js");

exports.helpEmbed = (commands) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("Commands List")
    .setColor(process.env.color_blue);
  for (const command of commands)
    embed.addField(command.title, command.description);
  embed.setFooter({ text: "by Chetachi ❤️" }).setTimestamp();
  return embed;
};

exports.noReminders = () => {
  const embed = new Discord.MessageEmbed()
    .setColor(process.env.color_blue)
    .setTitle("Reminders List")
    .setDescription("There are no active reminders.")
    .setTimestamp();
  return embed;
};

exports.error = (msg) => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_red)
    .setTitle("Error")
    .setDescription(`${msg}`)
    .setTimestamp();
};

exports.addReminder = (reminder) => {
  const embed = new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("Reminder Set Successfully");
  embed.addField("Message", reminder.msg, true);
  embed.addField("Date", reminder.dateStr, true).setTimestamp();
  return embed;
};

exports.removeReminder = () => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("Reminder Removed Successfully")
    .setTimestamp();
};

exports.removeAllReminders = () => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("All Reminders Removed Successfully")
    .setTimestamp();
};

exports.updateOffset = (offset) => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("Time Zone Offset Updated Successfully")
    .setDescription(`Your time zone is now \`${offset}\` hours from UTC.`)
    .setTimestamp();
};

exports.remindersList = (reminders, offset, choice) => {
  const embed = new Discord.MessageEmbed()
    .setColor(process.env.color_blue)
    .setTitle("Reminders List")
    .setDescription(
      `Here is ${choice === "self" ? `your` : `the channel's`} reminders list:`
    )
    .setTimestamp();
  if (reminders.length === 0)
    embed.setDescription("There are no active reminders.");
  else
    reminders.forEach((reminder, idx) => {
      embed
        .addField(
          "Date",
          `${dateStr(reminder.date + offset * 60 * 60 * 1000)}`,
          true
        )
        .addField("Message", `${reminder.msg}`, true)
        .addField("ID", `${idx}`, true);
    });
  return embed;
};

const dateStr = (d) => {
  let date = new Date(d);
  let h = date.getHours(),
    v = "am";
  if (h >= 12) v = "pm";
  if (h > 12) h -= 12;
  if (h == 0) h += 12;
  return `${
    date.getMonth() + 1
  }.${date.getDate()}.${date.getFullYear()} at ${h}:${pad(
    date.getMinutes(),
    2
  )} ${v}  `;
};

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};
