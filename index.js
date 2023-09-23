const mineflayer = require("mineflayer");
const { mineflayer: mineflayerViewer } = require("prismarine-viewer");
require("dotenv").config();

const bot = mineflayer.createBot({
  host: process.env.HOST,
  username: process.env.USER_NAME,
  auth: process.env.AUTH,
  port: Number(process.env.PORT),
});

bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  if (username !== process.env.OWNER) return;

  if (message.toLowerCase().startsWith(process.env.USER_NAME.toLowerCase()))
    return bot.chat("Привет, хозяин!");

  bot.chat("Ничего не понял, хозяин...");
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
