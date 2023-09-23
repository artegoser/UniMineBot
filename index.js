const mineflayer = require("mineflayer");
const {
  pathfinder,
  Movements,
  goals: { GoalNear, GoalBlock, GoalXZ },
} = require("mineflayer-pathfinder");

require("dotenv").config();

const bot = mineflayer.createBot({
  host: process.env.HOST,
  username: process.env.USER_NAME,
  auth: process.env.AUTH,
  port: Number(process.env.PORT),
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(require("mineflayer-auto-eat").plugin);
bot.loadPlugin(require("mineflayer-tool").plugin);
bot.loadPlugin(require("mineflayer-collectblock").plugin);

bot.once("spawn", () => {
  const defaultMove = new Movements(bot);
  defaultMove.canDig = false;
  bot.pathfinder.setMovements(defaultMove);
  const mcData = require("minecraft-data")(bot.version);

  bot.on("chat", (username, message) => {
    if (username === bot.username || username !== process.env.OWNER) {
      return;
    }

    if (message.toLowerCase().startsWith(process.env.USER_NAME.toLowerCase())) {
      if (username !== process.env.OWNER) {
        bot.chat("Я слушаю только " + process.env.OWNER);
        return;
      }

      let command_message = message
        .replace(process.env.USER_NAME, "")
        .trim()
        .split(" ");

      if (command_message[0] === "иди") {
        let x, y, z;
        const { position } = bot.entity;
        x = position.x;
        y = position.y;
        z = position.z;

        if (command_message[1] === "сюда" || command_message[1] === "к") {
          const targetPosition =
            bot.players[command_message[2] ? command_message[2] : username]
              ?.entity?.position;
          if (!targetPosition) {
            bot.chat("Не могу найти тебя.");
            return;
          }
          x = targetPosition.x;
          y = targetPosition.y;
          z = targetPosition.z;
        } else if (command_message[1] === "вперед") {
          x += Number(command_message[2]);
        } else if (command_message[1] === "назад") {
          x -= Number(command_message[2]);
        } else if (command_message[1] === "влево") {
          z -= Number(command_message[2]);
        } else if (command_message[1] === "вправо") {
          z += Number(command_message[2]);
        } else if (command_message[1] === "xyz") {
          x = Number(command_message[2]);
          y = Number(command_message[3]);
          z = Number(command_message[4]);

          bot.pathfinder.setGoal(new GoalBlock(x, y, z));
          return;
        } else if (command_message[1] === "xz") {
          x = Number(command_message[2]);
          z = Number(command_message[3]);

          bot.pathfinder.setGoal(new GoalXZ(x, z));
          return;
        }

        bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
      } else if (command_message[0] === "стой") {
        bot.pathfinder.stop();
      } else if (command_message[0] === "инфо") {
        if (command_message[1] === "привет") {
          bot.chat("Привет, " + username);
        } else if (command_message[1] === "координаты") {
          const { position } = bot.entity;
          bot.chat(`X: ${position.x} Y: ${position.y} Z: ${position.z}`);
        } else if (command_message[1] === "путь") {
          bot.chat(
            `Движение: ${bot.pathfinder.isMoving()}, Копание: ${bot.pathfinder.isMining()}, Строительство: ${bot.pathfinder.isBuilding()}`
          );
        }
      } else if (command_message[0] === "копай") {
        collectBLock(command_message[1], mcData, command_message[2]);
      }
    }
  });

  bot.chat(process.env.INITIAL_COMMAND);
});

bot.on("message", (message) => {
  console.log(message.toAnsi());
});

bot.on("kicked", console.log);
bot.on("error", console.log);

async function collectBLock(name, data, count = 16) {
  const block = data.blocksByName[name]?.id;
  if (!block) return bot.chat(`Не могу найти блок ${name}`);

  const blocks = bot.findBlocks({
    matching: block,
    maxDistance: 64,
    count,
  });

  if (blocks.length === 0) {
    bot.chat("Я не могу найти поблизости такие блоки");
    return;
  }

  const targets = [];
  for (let i = 0; i < Math.min(blocks.length, count); i++) {
    targets.push(bot.blockAt(blocks[i]));
  }

  bot.chat(`Найдено ${targets.length} ${name}`);

  try {
    bot.chat("Начинаю копать");
    await bot.collectBlock.collect(targets);
    bot.chat("Готово");
  } catch (err) {
    bot.chat("Ошибка");
    console.log(err);
  }
}
