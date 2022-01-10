const Discord = require("discord.js");

exports.helpEmbed = (commands) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("Commands List")
    .setColor(process.env.color_blue);
  for (const command of commands)
    embed.addField(command.title, command.description, false);
  embed.setFooter({ text: "by Chetachi ❤️" }).setTimestamp();
  return embed;
};

exports.noReminders = () => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_blue)
    .setTitle("Reminders List")
    .setDescription("There are no active reminders.");
};

exports.error = (msg) => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_red)
    .setTitle("Error")
    .setDescription(`${msg}`);
};

exports.addReminder = (reminder) => {
  const embed = new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("Reminder Set Successfully");
  embed.addField("Message", reminder.msg, true);
  embed.addField("Date", reminder.dateStr, true);
  return embed;
};

exports.removeReminder = () => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("Reminder Removed Successfully");
};

exports.removeAllReminders = () => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("All Reminders Removed Successfully");
};

exports.updateOffset = (offset) => {
  return new Discord.MessageEmbed()
    .setColor(process.env.color_green)
    .setTitle("Time Zone Offset Updated Successfully")
    .setDescription(`Your time zone is now \`${offset}\` hours from UTC.`);
};

exports.remindersList = (reminders, offset) => {
  const embed = new Discord.MessageEmbed()
    .setColor(process.env.color_blue)
    .setTitle("Reminders List")
    .setImage(
      "https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    );
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
  return `${h}:${pad(date.getMinutes(), 2)} ${v} ${
    date.getMonth() + 1
  }.${date.getDate()}.${date.getFullYear()}`;
};

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};
