function dig({ bot, command_message, mcData }) {
  collectBLock(bot, command_message[0].split(","), mcData, command_message[1]);
}

async function collectBLock(bot, names, data, count = 16) {
  for (let i = 0; i < count; i++) {
    const targets = [];

    for (let name of names) {
      const blockType = data.blocksByName[name]?.id;
      if (!blockType) bot.chat(`Не могу найти блок ${name} в справочнике`);

      const block = bot.findBlock({
        matching: blockType.id,
        maxDistance: 64,
      });

      if (!block) {
        bot.chat(`Я не могу найти поблизости ${name}`);
        continue;
      }

      const blocks = bot.collectBlock.findFromVein(block);

      targets.push(...blocks);
    }

    bot.chat(`Найдено ${targets.length} (${names.join(", ")})`);

    try {
      bot.chat(`Начинаю копать ${i} из ${count} структур`);
      await bot.collectBlock.collect(targets);
      bot.chat("Готово");
    } catch (err) {
      bot.chat("Я устал копать походу");
      console.log(err);
    }
  }
}

module.exports = dig;
