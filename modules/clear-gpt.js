const initGpt = require("../utils/initGpt");

function clearGpt(args) {
  args.bot.gpt_data = initGpt(args);
}

module.exports = clearGpt;
