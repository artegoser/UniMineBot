function info({ bot, command_message, username }) {
  switch (command_message[0]) {
    case "привет":
      bot.chat("Привет, " + username);
      break;
    case "координаты":
      bot.chat(`X: ${bot.entity.x} Y: ${bot.entity.y} Z: ${bot.entity.z}`);
      break;
    case "путь":
      bot.chat(
        `Движение: ${bot.pathfinder.isMoving()}, Копание: ${bot.pathfinder.isMining()}, Строительство: ${bot.pathfinder.isBuilding()}`
      );
  }
}

module.exports = info;
