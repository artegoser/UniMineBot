const {
  goals: { GoalBlock, GoalXZ, GoalNear },
} = require("mineflayer-pathfinder");
function Movements({ bot, command_message, username }) {
  let x, y, z;
  const { position } = bot.entity;
  x = position.x;
  y = position.y;
  z = position.z;

  if (command_message[0] === "сюда" || command_message[0] === "к") {
    const targetPosition =
      bot.players[command_message[1] ? command_message[1] : username]?.entity
        ?.position;
    if (!targetPosition) {
      bot.chat("Не могу найти тебя.");
      return;
    }
    x = targetPosition.x;
    y = targetPosition.y;
    z = targetPosition.z;
  } else if (command_message[0] === "вперед") {
    x += Number(command_message[1]);
  } else if (command_message[0] === "назад") {
    x -= Number(command_message[1]);
  } else if (command_message[0] === "влево") {
    z -= Number(command_message[1]);
  } else if (command_message[0] === "вправо") {
    z += Number(command_message[1]);
  } else if (command_message[0] === "xyz") {
    x = Number(command_message[1]);
    y = Number(command_message[2]);
    z = Number(command_message[3]);

    bot.pathfinder.setGoal(new GoalBlock(x, y, z));
    return;
  } else if (command_message[0] === "xz") {
    x = Number(command_message[1]);
    z = Number(command_message[2]);

    bot.pathfinder.setGoal(new GoalXZ(x, z));
    return;
  }

  bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
}

module.exports = Movements;
