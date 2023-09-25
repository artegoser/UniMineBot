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

const OwnerEmitter = new EventEmitter();
const AllEmitter = new EventEmitter();

AllEmitter.on("инфо", require("./modules/info"));
AllEmitter.on("порешай", require("./modules/math"));
AllEmitter.on("скажи", require("./modules/say"));

OwnerEmitter.on("иди", require("./modules/movements"));
OwnerEmitter.on("стоп", require("./modules/stop"));
OwnerEmitter.on("копай", require("./modules/dig"));

OwnerEmitter.on("pos1", require("./modules/pos1"));
OwnerEmitter.on("pos2", require("./modules/pos2"));

OwnerEmitter.on("gpt", require("./modules/gpt"));
OwnerEmitter.on("clear-gpt", require("./modules/clear-gpt"));

bot.loadPlugin(pathfinder);
bot.loadPlugin(require("mineflayer-auto-eat").plugin);
bot.loadPlugin(require("mineflayer-tool").plugin);
bot.loadPlugin(require("mineflayer-collectblock").plugin);
bot.loadPlugin(require("mineflayer-pvp").plugin);

bot.once("spawn", () => {
  bot.chat(process.env.INITIAL_COMMAND);

  const defaultMove = new Movements(bot);
  defaultMove.canDig = false;
  bot.pathfinder.setMovements(defaultMove);

  const mcData = require("minecraft-data")(bot.version);

  bot.on("chat", (username, message) => {
    if (username === bot.username) {
      return;
    }

    if (message.toLowerCase().startsWith(process.env.USER_NAME.toLowerCase())) {
      let command_message = message
        .replace(process.env.USER_NAME, "")
        .trim()
        .split(" ");

      AllEmitter.emit(command_message[0], {
        bot,
        message,
        command_message: command_message.slice(1),
        mcData,
        username,
        defaultMove,
        AllEmitter,
      });

      if (username === process.env.OWNER) {
        OwnerEmitter.emit(command_message[0], {
          bot,
          message,
          command_message: command_message.slice(1),
          mcData,
          username,
          defaultMove,
          OwnerEmitter,
          AllEmitter,
        });
      }
    }
  });
});

bot.on("message", (message) => {
  console.log(message.toAnsi());
});

bot.on("kicked", console.log);
bot.on("error", console.log);
