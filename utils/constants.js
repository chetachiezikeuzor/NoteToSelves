const timeZonesList = [
  "UTC",
  "Asia/Tokyo",
  "Japan",
  "EST",
  "Asia/Manila",
  "America/New_York",
  "Europe/Berlin",
  "America/Los_Angeles",
  "Asia/Kolkata",
  "Asia/Jakarta",
  "US/Eastern",
  "CET",
  "Singapore",
  "Europe/Paris",
  "America/Sao_Paulo",
  "Europe/London",
  "US/Central",
  "US/Pacific",
  "Europe/Moscow",
  "America/Chicago",
  "GMT",
];

const dateFormatString = "ddd, MMM Do, YYYY [at] hh:mm:ss a";
const genericParserErrorMessage = "Sorry, I didn't understand that.";
const genericSchedulerErrorMessage =
  "Sorry, I couldn't do that at this time. Please try again later.";

module.exports = {
  timeZonesList: timeZonesList,
  dateFormatString: dateFormatString,
  genericParserErrorMessage: genericParserErrorMessage,
  genericSchedulerErrorMessage: genericSchedulerErrorMessage,
};
