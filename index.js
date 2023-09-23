const mineflayer = require("mineflayer");
const { mineflayer: mineflayerViewer } = require("prismarine-viewer");
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

    if (command_message[0] === "сюда") {
      const target = bot.players[username]?.entity;
      if (!target) {
        bot.chat("Не могу найти тебя.");
        return;
      }
      const { x: playerX, y: playerY, z: playerZ } = target.position;

      bot.pathfinder.setMovements(defaultMove);
      bot.pathfinder.setGoal(
        new GoalNear(playerX, playerY, playerZ, RANGE_GOAL)
      );
    }
  }
  return bot.chat("Дарова");
});

bot.once("spawn", () => {
  bot.chat(process.env.INITIAL_COMMAND);
});

bot.on("message", (message) => {
  console.log(message.toAnsi());
  if (message === "Successful login!") mineflayerViewer(bot, { port: 80 });
});

// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);
