const { evaluate } = require("mathjs");

function math({ bot, command_message }) {
  const expr = command_message.join("");
  bot.chat(`${expr} = ${evaluate(expr)}`);
}

module.exports = math;
