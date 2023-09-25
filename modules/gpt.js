const { getResponse } = require("../utils/gpt");

const info = require("../modules/info");
const math = require("../modules/math");
const dig = require("../modules/dig");
const movements = require("../modules/movements");
const say = require("../modules/say");
const stop = require("../modules/stop");
const pos1 = require("../modules/pos1");
const pos2 = require("../modules/pos2");
const initGpt = require("../utils/initGpt");

async function gpt(args) {
  const prompt = args.command_message.join(" ");

  if (!args.bot.gpt_data) args.bot.gpt_data = initGpt(args);

  args.bot.gpt_data.push({
    role: "user",
    content: prompt,
  });

  const response = await getResponse(args.bot.gpt_data);

  args.bot.gpt_data.push({
    role: "assistant",
    content: response,
  });

  const commands = response.split("\n");

  for (let command of commands) {
    if (command.startsWith("<!DOCTYPE")) break;
    const args2 = command.split(" ");
    const argsToCommand = {
      ...args,
      command_message: args2.slice(1),
    };

    console.log(command);

    switch (args2[0]) {
      case "инфо":
        await info(argsToCommand);
        break;
      case "порешай":
        await math(argsToCommand);
        break;
      case "скажи":
        await say(argsToCommand);
        break;
      case "иди":
        await movements(argsToCommand);
        break;
      case "стоп":
        await stop(argsToCommand);
        break;
      case "копай":
        await dig(argsToCommand);
        break;
      case "pos1":
        await pos1(argsToCommand);
        break;
      case "pos2":
        await pos2(argsToCommand);
        break;
      default:
        args.bot.chat(command);
    }
  }
}

module.exports = gpt;
