"use strict";

const Discord = require("discord.js");
const log = require("debug")("scheduler");
const moment = require("moment");
const Agenda = require("agenda");
const StringBuilder = require("string-builder");
const parser = require("./parser");

const genericParserErrorMessage = "Sorry, I didn't understand that.";
const genericSchedulerErrorMessage =
  "Sorry, I couldn't do that at this time. Please try again later.";

const reminderJobName = "send reminder";
const dateFormatString = "dddd, MMMM Do, YYYY [at] hh:mm:ss A";

const client = new Discord.Client({
  disableMentions: "everyone",
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

class Scheduler {
  constructor(bot) {
    let getLatestReminderId = async function getLatestReminderId(userId) {
      let rawJob = await agenda._collection
        .find({ name: reminderJobName, "data.userId": userId, nextRunAt: null })
        .sort({ lastRunAt: -1 })
        .limit(1)
        .next();

      if (rawJob == null) {
        return null;
      }

      return rawJob._id;
    };
    this.setReminder = async function (userId, message, messageContent) {
      if (!parser.validReminderString(messageContent)) {
        await message.channel.send(genericParserErrorMessage);
        return;
      }

      let reminder = parser.getMessageAndDateFromReminderString(messageContent);
      let reminderTime = moment(reminder.date);

      agenda.schedule(reminder.date, reminderJobName, {
        userId: userId,
        reminder: reminder.message,
      });

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setColor(process.env.color_blue)
        .setTitle(
          `On **${reminderTime.format(
            dateFormatString
          )}** I will remind you **${reminder.message}**`
        )
        .setColor(process.env.color_blue)
        .setTimestamp()
        .setThumbnail(client.user.avatarURL());

      await message.channel.send({ embeds: [embed] });

      log(`reminder set for user ${userId}`);
    };
    this.snoozeReminder = async function (userId, message, messageContent) {
      if (!parser.validSnoozeString(messageContent)) {
        await message.channel.send(genericParserErrorMessage);
        return;
      }

      let reminderDate = parser.getDateFromSnoozeString(message);

      let reminderTime = moment(reminderDate);

      let jobId = await getLatestReminderId(userId);

      if (jobId == null) {
        await message.channel.send(
          `You have no reminders to snooze **<@${userId}>**`
        );
        return;
      }

      agenda.jobs({ _id: jobId }, async (err, jobs) => {
        if (err) {
          log(`reminder snooze failed due to error: ${err}`);
          return;
        }

        let job = jobs[0];

        job.schedule(reminderDate);
        job.save();

        await message.channel.send(
          `OK **<@${userId}>**, on **${reminderTime.format(
            dateFormatString
          )}** I will remind you **${job.attrs.data.reminder}**`
        );

        log(`reminder snoozed for user ${userId}`);
      });
    };
    this.snoozeReminders = async function (userId, message, messageContent) {
      if (!parser.validSnoozeString(messageContent)) {
        await message.channel.send(genericParserErrorMessage);
        return;
      }

      let reminderDate = parser.getDateFromSnoozeString(messageContent);

      agenda.jobs(
        {
          name: reminderJobName,
          "data.userId": userId,
          nextRunAt: { $eq: null },
        },
        async (err, jobs) => {
          if (err) {
            await message.channel.send(genericSchedulerErrorMessage);
            return;
          } else if (jobs.length === 0) {
            await message.channel.send(
              `You have no reminders to snooze **<@${userId}>**`
            );
            return;
          } else {
            for (let job of jobs) {
              job.schedule(reminderDate);
              job.save();
            }

            await message.channel.send(
              `OK **<@${userId}>**, I have snoozed ${jobs.length} active reminders for you`
            );
          }

          log(`snoozeall reminders request processed for user ${userId}`);
        }
      );
    };
    this.listReminders = async function (userId, message) {
      agenda.jobs(
        {
          name: reminderJobName,
          "data.userId": userId,
          nextRunAt: { $ne: null },
        },
        async (err, jobs) => {
          if (err) {
            log(`list reminders failed due to error: ${err}`);
            await message.channel.send(genericSchedulerErrorMessage);
            return;
          } else if (jobs.length === 0) {
            await message.channel.send(
              `You have no reminders pending **<@${userId}>**`
            );
            return;
          } else {
            let sb = new StringBuilder();
            sb.appendLine(
              `OK **<@${userId}>**, I have found the following upcoming reminders for you:`
            );
            jobs.sort(function (a, b) {
              return a.attrs.nextRunAt - b.attrs.nextRunAt;
            });

            for (let job of jobs) {
              let nextRunAt = moment(job.attrs.nextRunAt);
              let reminder = job.attrs.data.reminder;

              sb.appendLine();
              sb.appendLine(
                `\tTime: **${nextRunAt.format(dateFormatString)}**`
              );
              sb.appendLine(`\tMessage: **${reminder}**`);
            }

            await message.channel.send(sb.toString());
          }

          log(`list reminders request processed for user ${userId}`);
        }
      );
    };
    this.clearActiveReminder = async function (userId, message) {
      let jobId = await getLatestReminderId(userId);
      if (jobId == null) {
        await message.channel.send(
          `You have no reminders to remove **<@${userId}>**`
        );
        return;
      }

      agenda.jobs({ _id: jobId }, async (err, jobs) => {
        if (err) {
          await message.channel.send(genericSchedulerErrorMessage);
          log(`reminder removal failed due to error: ${err}`);
          return;
        }

        let job = jobs[0];

        job.remove(async (err) => {
          if (!err) {
            await message.channel.send(
              `OK **<@${userId}>**, I have removed your most recent reminder: **${job.attrs.data.reminder}**`
            );

            log(`reminder removed for user ${userId}`);
          } else {
            log(`reminder removal failed due to error: ${err}`);
            await message.channel.send(genericSchedulerErrorMessage);
          }
        });
      });
    };
    this.clearAllReminders = async function (userId, message) {
      agenda.cancel(
        { name: reminderJobName, "data.userId": userId },
        async (err, numRemoved) => {
          if (err) {
            log(
              `delete all reminders request failed for user ${userId} because: ${err}`
            );
            await message.channel.send(
              `I couldn't remove your reminders **<@${userId}>**, please try again later.`
            );
          } else {
            log(`delete all reminders request processed for user ${userId}`);
            await message.channel.send(
              `I have removed all ${numRemoved} of your reminders **<@${userId}>**`
            );
          }
        }
      );
    };
    this.clearActiveReminders = async function (userId, message) {
      agenda.cancel(
        {
          name: reminderJobName,
          "data.userId": userId,
          nextRunAt: { $eq: null },
        },
        async (err, numRemoved) => {
          if (err) {
            log(
              `delete active reminders request failed for user ${userId} because: ${err}`
            );
            await message.channel.send(
              `I couldn't remove your reminders **<@${userId}>**, please try again later.`
            );
            return;
          } else if (numRemoved === 0) {
            await message.channel.send(
              `You have no reminders to remove **<@${userId}>**`
            );
          } else {
            await message.channel.send(
              `I have removed all ${numRemoved} of your active reminders **<@${userId}>**`
            );
          }
          log(`delete active reminders request processed for user ${userId}`);
        }
      );
    };
    const sendReminder = async function (userId, message) {
      const user = await bot.fetchUser(userId);

      if (user == undefined) {
        log("user not found: " + userId);
        return;
      }

      const channel = await user.createDM();

      if (channel == undefined) {
        log("dm channel not found for user " + userId);
        return;
      }

      await message.channel.send(
        `Hey **<@${userId}>**, remember **${message}**`
      );

      log("reminder sent to user " + userId);
    };
    const agenda = new Agenda({
      db: { address: process.env.mongodbUri, collection: "agenda" },
    }).processEvery("one minute");

    agenda.on("ready", async function () {
      agenda.define("send reminder", async (job, done) => {
        const data = job.attrs.data;
        await sendReminder(data.userId, data.note);
        done();
      });
      await this.start();
    });
  }
}
module.exports = {
  Scheduler: Scheduler,
};
