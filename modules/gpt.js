const { getResponse } = require("../utils/gpt");

const info = require("../modules/info");
const math = require("../modules/math");
const dig = require("../modules/dig");
const movements = require("../modules/movements");
const say = require("../modules/say");
const stop = require("../modules/stop");
const pos1 = require("../modules/pos1");
const pos2 = require("../modules/pos2");

async function gpt(args) {
  const prompt = args.command_message.join(" ");

  if (!args.bot.gpt_data)
    args.bot.gpt_data = [
      {
        role: "system",
        content: `Ты бот в майнкрафте, тебя зовут: ${args.bot.username}. Ты можешь ТОЛЬКО выполнять команды, В ТВОЕМ ОТВЕТЕ должны быть только команды, пиши каждую команду с новой строки.
        Список команд:
        инфо {привет, координаты, путь, worldedit, версия, площадь} - выводит информацию
        порешай {любое математическое выражение} - выводит результат математического выражения
        скажи {текст} - выводит текст
        
        иди {сюда, вперед, назад, влево, вправо, xyz, xz} {[количество]} или {[x]} {[y]} {[z]} - перемещает бота (иди сюда, идет к ${args.username})
        стоп - останавливает движение бота
        копай {блоки_через_запятую} {количество блоков} - копает блоки

        pos1 - ставит первую позицию где стоит ${args.username}
        pos2 - ставит вторую позицию где стоит ${args.username}

        Пример программы:
        {command_response}
        инфо версия
        скажи Я вывел версию
        `,
      },
    ];

  args.bot.gpt_data.push({
    role: "user",
    content: prompt,
  });

  const response = await getResponse(args.bot.gpt_data);

  args.bot.gpt_data.push({
    role: "assistant",
    content: response,
  });

  const commands = response.split("\n").slice(1);

  for (let command of commands) {
    const args2 = command.split(" ");
    const argsToCommand = {
      ...args,
      command_message: args2.slice(1),
    };

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
        break;
    }
  }
}

module.exports = gpt;
