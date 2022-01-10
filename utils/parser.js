"use strict";

const log = require("debug")("parser");
const chrono = require("chrono-node");
const moment = require("moment");
const untilRegex = new RegExp("\\b" + "until" + "\\b");
const forRegex = new RegExp("\\b" + "for" + "\\b");
const cleanSnoozeString = (snoozeString) => {
  snoozeString = snoozeString.replace(untilRegex, "at");
  snoozeString = snoozeString.replace(forRegex, "in");

  return snoozeString;
};
module.exports.validReminderString = (reminderString) => {
  let parsedDate = chrono.parse(reminderString, new Date(), {})[0];

  if (parsedDate == undefined) {
    return false;
  }

  let reminderMessage = reminderString.replace(parsedDate.text, "").trim();

  reminderMessage = reminderMessage.replace(/[^\x20-\x7F]/g, "");

  if (!reminderMessage) {
    return false;
  }

  let reminderTime = moment(parsedDate.start.date());

  if (!reminderTime.isValid() || reminderTime <= new Date().getTime()) {
    return false;
  }

  return true;
};
module.exports.getMessageAndDateFromReminderString = (reminderString) => {
  if (!this.validReminderString(reminderString)) {
    throw new Error("Invalid reminder string!");
  }

  let parsedDate = chrono.parse(reminderString, new Date(), {})[0];

  let message = reminderString.replace(parsedDate.text, "").trim();

  let date = parsedDate.start.date();

  return { message: message, date: date };
};
module.exports.validSnoozeString = (snoozeString) => {
  snoozeString = cleanSnoozeString(snoozeString);

  let parsedDate = chrono.parse(snoozeString, new Date(), {})[0];

  if (parsedDate == undefined) {
    return false;
  }

  let snoozeUntilTime = moment(parsedDate.start.date());

  if (!snoozeUntilTime.isValid() || snoozeUntilTime <= new Date()) {
    return false;
  }

  return true;
};
module.exports.getDateFromSnoozeString = (snoozeString) => {
  if (!this.validSnoozeString(snoozeString)) {
    throw new Error("Invalid snooze string!");
  }

  let parsedDate = chrono.parse(
    cleanSnoozeString(snoozeString),
    new Date(),
    {}
  )[0];

  let date = parsedDate.start.date();

  return date;
};
