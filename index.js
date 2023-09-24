const mineflayer = require("mineflayer");
const { pathfinder, Movements } = require("mineflayer-pathfinder");
const { EventEmitter } = require("events");
const process = require("process");

require("dotenv").config();

const bot = mineflayer.createBot({
  host: process.env.HOST,
  username: process.env.USER_NAME,
  auth: process.env.AUTH,
  port: Number(process.env.PORT),
});

const emmiter = new EventEmitter();

emmiter.on("иди", require("./modules/movements"));
emmiter.on("стоп", require("./modules/stop"));
emmiter.on("инфо", require("./modules/info"));
emmiter.on("копай", require("./modules/dig"));

bot.loadPlugin(pathfinder);
bot.loadPlugin(require("mineflayer-auto-eat").plugin);
bot.loadPlugin(require("mineflayer-tool").plugin);
bot.loadPlugin(require("mineflayer-collectblock").plugin);

bot.once("spawn", () => {
  bot.chat(process.env.INITIAL_COMMAND);

  const defaultMove = new Movements(bot);
  defaultMove.canDig = false;
  bot.pathfinder.setMovements(defaultMove);
  bot.pathfinder.tickTimeout = -1;

  const mcData = require("minecraft-data")(bot.version);

  bot.on("chat", (username, message) => {
    if (username === bot.username || username !== process.env.OWNER) {
      return;
    }

    if (message.toLowerCase().startsWith(process.env.USER_NAME.toLowerCase())) {
      if (username !== process.env.OWNER) {
        bot.chat(`Я слушаю только ${process.env.OWNER}`);
        return;
      }

      let command_message = message
        .replace(process.env.USER_NAME, "")
        .trim()
        .split(" ");

      emmiter.emit(command_message[0], {
        bot,
        message,
        command_message: command_message.slice(1),
        mcData,
        username,
      });
    }
  });
});

bot.on("message", (message) => {
  console.log(message.toAnsi());
});

bot.on("kicked", console.log);
bot.on("error", console.log);
