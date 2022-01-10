const Discord = require("discord.js");
const embeds = require("../embeds");

exports.run = async (client, message, args) => {
  userSchema.findById(message.author.id).then(async (u) => {
    if (!u) {
      await message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: "An error occured!",
              iconURL: "https://i.imgur.com/PZ9qLe7.png",
            })
            .setDescription(
              "Use `/timezone` to set your time zone before you can add reminders."
            )
            .setColor(process.env.color_red)
            .setTimestamp(),
        ],
      });
    } else {
      //check each argument against these strings to be more accurate
      const v = args[1].substring(args[1].length - 2).toUpperCase();
      const time = args[1].substring(0, args[1].length - 2).split(":");
      if (time.length !== 2 || (v !== "AM" && v !== "PM")) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(
                "Invalid time format. The required format is `<hour>:<minute><am|pm>`."
              )
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }

      //convert currentTime to local user time: +offset
      const userNow = new Date();
      userNow.setTime(userNow.getTime() + u.offset * 60 * 60 * 1000);
      let date = [
        userNow.getMonth() + 1,
        userNow.getDate(),
        userNow.getFullYear(),
      ];
      console.log(date);
      if (options.length == 3) {
        date = args[2].split("/");
        if (date.length == 2) {
          date[2] = userNow.getFullYear();
        } else if (date.length !== 3) {
          await message.channel.send({
            embeds: [
              new Discord.MessageEmbed()
                .setAuthor({
                  name: "An error occured!",
                  iconURL: "https://i.imgur.com/PZ9qLe7.png",
                })
                .setDescription(
                  "Invalid date format. The required format is `<month/day/year>`, or leave `year` blank to use the current year."
                )
                .setColor(process.env.color_red)
                .setTimestamp(),
            ],
          });
          return;
        }
      }
      const msg = args[0];
      //completely parse everything here to make sure there's no errors (note that if the array value doesn't exist, one will automatically be created)
      time[0] = parseInt(time[0]);
      time[1] = parseInt(time[1]);
      date[0] = parseInt(date[0]);
      date[1] = parseInt(date[1]);
      date[2] = parseInt(date[2]);
      console.log(time[0], time[1], date[0], date[1], date[2], msg);

      if (isNaN(time[0]) || time[0] < 1 || time[0] > 12) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(
                "Invalid hour. The value must be an integer between `1` and `12`."
              )
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }
      if (isNaN(time[1]) || time[1] < 0 || time[1] > 59) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(
                "Invalid minute. The value must be an integer between `0` and `59`."
              )
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }
      if (isNaN(date[0]) || date[0] < 1 || date[0] > 12) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(
                "Invalid month. The value must be an integer between `1` and `12`."
              )
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }
      if (isNaN(date[0]) || date[1] < 1 || date[1] > 31) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(
                "Invalid day. The value must be an integer between `1` and `31`."
              )
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }
      if (isNaN(date[2]) || date[2] < 2000 || date[2] > 2100) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription(
                "Invalid year. The value must be an integer between `2000` and `2100`."
              )
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }

      //local user time to utc: -offset
      let dateValue =
        new Date(date[2], date[0] - 1, date[1], time[0], time[1]).getTime() -
        u.offset * 60 * 60 * 1000;
      if (v === "AM" && time[0] === 12) {
        dateValue -= 12 * 60 * 60 * 1000;
      } else if (v === "PM" && time[0] !== 12) {
        dateValue += 12 * 60 * 60 * 1000;
      }
      console.log("datevalue", dateValue);
      const reminder = {
        date: dateValue,
        msg: msg,
      };

      if (reminder.date <= new Date().getTime()) {
        await message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor({
                name: "An error occured!",
                iconURL: "https://i.imgur.com/PZ9qLe7.png",
              })
              .setDescription("The time for this reminder has already passed.")
              .setColor(process.env.color_red)
              .setTimestamp(),
          ],
        });
        return;
      }

      u.reminders.push(reminder);
      for (let i = u.reminders.length - 2; i >= 0; i--) {
        if (u.reminders[i].date > u.reminders[i + 1].date)
          [u.reminders[i], u.reminders[i + 1]],
            [u.reminders[i + 1], u.reminders[i]];
      }
      u.save();
      console.log(u.reminders);
      message.lineReply("Hey")(embeds.remindersList(u.reminders, u.offset));
    }
  });
};

exports.help = {
  name: "noteto",
  description: "Sets a reminder to ping you at a specific time.",
  cooldown: "5",
  usage: "noteto <id>",
};
