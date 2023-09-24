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

const OwnerEmmiter = new EventEmitter();
const AllEmmiter = new EventEmitter();

AllEmmiter.on("инфо", require("./modules/info"));
AllEmmiter.on("порешай", require("./modules/math"));

OwnerEmmiter.on("иди", require("./modules/movements"));
OwnerEmmiter.on("стоп", require("./modules/stop"));
OwnerEmmiter.on("копай", require("./modules/dig"));

OwnerEmmiter.on("pos1", ({ bot, username }) => {
  bot.pos1 = { ...bot.players[username].entity.position };
});
OwnerEmmiter.on("pos2", ({ bot, username }) => {
  bot.pos2 = { ...bot.players[username].entity.position };
});

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

      AllEmmiter.emit(command_message[0], {
        bot,
        message,
        command_message: command_message.slice(1),
        mcData,
        username,
        defaultMove,
      });

      if (username === process.env.OWNER) {
        OwnerEmmiter.emit(command_message[0], {
          bot,
          message,
          command_message: command_message.slice(1),
          mcData,
          username,
          defaultMove,
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
