module.exports = ({ bot, username }) => {
  bot.pos2 = { ...bot.players[username].entity.position };
};
