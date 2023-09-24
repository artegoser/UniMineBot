function startGuard(bot) {
  bot.on("physicsTick", () => {
    const entity = bot.nearestEntity(
      (e) =>
        e.type === "mob" &&
        e.position.distanceTo(bot.entity.position) < 16 &&
        e.displayName !== "Armor Stand"
    );

    if (entity) {
      bot.pvp.attack(entity);
    }
  });
}

function stopGuard(bot) {
  bot.on("physicsTick", () => {});
}

module.exports = {
  startGuard,
  stopGuard,
};
