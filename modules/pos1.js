module.exports = ({ bot, username }) => {
  bot.pos1 = { ...bot.players[username].entity.position };
};
