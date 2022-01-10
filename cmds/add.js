const userSchema = require("../models/user");
const embeds = require("../embeds");

const data = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Sets a reminder to ping you at a specific time.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("message")
      .setRequired(true)
      .setDescription("The message you will get pinged with.")
  )

  .addSubcommand((subcommand) =>
    subcommand
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
        const v = args[1].substring(args[1].length - 2).toUpperCase();
        const time = args[1].substring(0, args[1].length - 2).split(":");
        if (time.length !== 2 || (v !== "AM" && v !== "PM")) {
          interaction.reply(
            embeds.error(
              "Invalid time format. The required format is `<hour>:<minute><am|pm>`."
            )
          );
          return;
        }

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
            interaction.reply(
              embeds.error(
                "Invalid date format. The required format is `<month/day/year>`, or leave `year` blank to use the current year."
              )
            );
            return;
          }
        }
        const msg = args[0];
        time[0] = parseInt(time[0]);
        time[1] = parseInt(time[1]);
        date[0] = parseInt(date[0]);
        date[1] = parseInt(date[1]);
        date[2] = parseInt(date[2]);
        console.log(time[0], time[1], date[0], date[1], date[2], msg);

        if (isNaN(time[0]) || time[0] < 1 || time[0] > 12) {
          interaction.reply(
            embeds.error(
              "Invalid hour. The value must be an integer between `1` and `12`."
            )
          );
          return;
        }
        if (isNaN(time[1]) || time[1] < 0 || time[1] > 59) {
          interaction.reply(
            embeds.error(
              "Invalid minute. The value must be an integer between `0` and `59`."
            )
          );
          return;
        }
        if (isNaN(date[0]) || date[0] < 1 || date[0] > 12) {
          interaction.reply(
            embeds.error(
              "Invalid month. The value must be an integer between `1` and `12`."
            )
          );
          return;
        }
        if (isNaN(date[0]) || date[1] < 1 || date[1] > 31) {
          interaction.reply(
            embeds.error(
              "Invalid day. The value must be an integer between `1` and `31`."
            )
          );
          return;
        }
        if (isNaN(date[2]) || date[2] < 2000 || date[2] > 2100) {
          interaction.reply(
            embeds.error(
              "Invalid year. The value must be an integer between `2000` and `2100`."
            )
          );
          return;
        }

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
          interaction.reply(
            embeds.error("The time for this reminder has already passed.")
          );
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
        interaction.reply(embeds.remindersList(u.reminders, u.offset));
      }
    });
  },
};
