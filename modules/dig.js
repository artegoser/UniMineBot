const { Movements } = require("mineflayer-pathfinder");

function dig({ bot, command_message, mcData, defaultMove }) {
  collectBLock(
    bot,
    command_message[0].split(","),
    mcData,
    defaultMove,
    command_message[1]
  );
}

async function collectBLock(bot, names, data, defaultMove, count = 16) {
  const newmove = new Movements(bot);
  bot.pathfinder.setMovements(newmove);

  const targets = [];

  for (let name of names) {
    const blockType = data.blocksByName[name];
    if (!blockType) bot.chat(`Не могу найти блок ${name} в справочнике`);

    const blocks = bot.findBlocks({
      matching: blockType.id,
      maxDistance: 64,
      count: count,
    });

    if (blocks.length === 0) {
      bot.chat(`Рядом нет блоков ${name}`);
      continue;
    }

    for (let i = 0; i < Math.min(blocks.length, count); i++) {
      targets.push(bot.blockAt(blocks[i]));
    }
  }

  bot.chat(`Найдено ${targets.length} (${names.join(", ")})`);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      bot.chat("Начинаю копать");
      await bot.collectBlock.collect(targets);
      bot.chat("Готово");
      break;
    } catch (err) {
      console.log(err);
    }
  }

  bot.pathfinder.setMovements(defaultMove);
}

module.exports = dig;
