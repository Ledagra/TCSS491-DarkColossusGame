
function updateGameBalancing() {
  DARK_ENERGY_DROPS_PER_ENEMY = 5; //higher number = less drops
  ENEMY_IFRAME = 30; //higher number = longer invincibility frames
  ENEMY_HEALTH = params.LEVEL + 4; //higher number = more health
  MOLECULE_FIRE_RATE = 2 / (params.LEVEL*1.5); //lower number = faster fire rate
}

function dropItems(x, y) {
    for (let i = 0; i < 1 + params.LEVEL/DARK_ENERGY_DROPS_PER_ENEMY; i++){
    gameEngine.addEntityFirst(new DarkEnergyItemDrop(gameEngine, x + (Math.random() * 200 - 100), y));
    }

    let baseHealthDropRate = 10;
    if (baseHealthDropRate + params.DARK_ENERGY.healthDropRate > Math.random()*100) {
        gameEngine.addEntityFirst(new HealthItemDrop(gameEngine, x + (Math.random() * 200 - 100), y));
    }
}

