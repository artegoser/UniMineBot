function dig({ bot, command_message, mcData }) {
  collectBLock(bot, command_message[0].split(","), mcData, command_message[1]);
}

async function collectBLock(bot, names, data, count = 16) {
  const targets = [];

  for (let name of names) {
    const block = data.blocksByName[name]?.id;
    if (!block) bot.chat(`Не могу найти блок ${name} в справочнике`);

    const blocks = bot.findBlocks({
      matching: block,
      maxDistance: 64,
      count,
    });

    if (blocks.length === 0) {
      bot.chat(`Я не могу найти поблизости ${name}`);
    }

    for (let i = 0; i < Math.min(blocks.length, count); i++) {
      targets.push(bot.blockAt(blocks[i]));
    }
  }

  bot.chat(`Найдено ${targets.length} (${names.join(", ")})`);

  try {
    bot.chat("Начинаю копать");
    await bot.collectBlock.collect(targets);
    bot.chat("Готово");
  } catch (err) {
    bot.chat("Я устал копать походу");
    console.log(err);
  }
}

module.exports = dig;
