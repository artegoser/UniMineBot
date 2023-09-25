function say({ bot, command_message }) {
  bot.chat(command_message.join(" "));
}

module.exports = say;
