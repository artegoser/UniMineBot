const { evaluate } = require("mathjs");
const wolfram = require("../utils/wolfram");

async function math({ bot, command_message }) {
  const expr = command_message.join("");
  let result;

  try {
    result = `${expr} = ${evaluate(expr)}`;
  } catch {
    result = await wolfram(expr);
  }

  bot.chat(result);
}

module.exports = math;
