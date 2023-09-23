const mineflayer = require("mineflayer");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
require("dotenv").config();

const bot = mineflayer.createBot({
  host: process.env.HOST,
  username: process.env.USER_NAME,
  auth: process.env.AUTH,
  port: Number(process.env.PORT),
});

bot.loadPlugin(pathfinder);

bot.once("spawn", () => {
  const defaultMove = new Movements(bot);
  defaultMove.canDig = false;
  bot.pathfinder.setMovements(defaultMove);

  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (username !== process.env.OWNER) return;

    if (message.toLowerCase().startsWith(process.env.USER_NAME.toLowerCase())) {
      if (username !== process.env.OWNER)
        return bot.chat("Я слушаю только " + process.env.OWNER);

      let command_message = message
        .replace(process.env.USER_NAME, "")
        .trim()
        .split(" ");

      if (command_message[0] === "двигайся") {
        let x, y, z;

        x = bot.entity.position.x;
        y = bot.entity.position.y;
        z = bot.entity.position.z;

        if (command_message[1] === "сюда" || command_message[1] === "к") {
          const target =
            bot.players[command_message[2] ? command_message[2] : username]
              ?.entity;
          if (!target) {
            bot.chat("Не могу найти тебя.");
            return;
          }
          x = target.position.x;
          y = target.position.y;
          z = target.position.z;
        } else if (command_message[1] === "вперед") {
          x += Number(command_message[2]);
        } else if (command_message[1] === "назад") {
          x -= Number(command_message[2]);
        } else if (command_message[1] === "влево") {
          z -= Number(command_message[2]);
        } else if (command_message[1] === "вправо") {
          z += Number(command_message[2]);
        } else if (command_message[1] === "координаты") {
          x = Number(command_message[2]);
          y = Number(command_message[3]);
          z = Number(command_message[4]);
        }

        bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, 1));
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
