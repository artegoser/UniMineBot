function dig({ bot, command_message, mcData }) {
  collectBLock(bot, command_message[0].split(","), mcData, command_message[1]);
}

async function collectBLock(bot, names, data, count = 16) {
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

  try {
    await bot.collectBlock.collect(targets);
    bot.chat("Готово");
  } catch (err) {
    bot.chat(err.message);
    console.log(err);
  }
}

module.exports = dig;
