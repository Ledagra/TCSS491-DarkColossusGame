class AbilityCooldown {

    constructor(cooldown) {
        this.cooldown = cooldown;
        this.currentCooldown = 0;
    }

    checkCooldown() {
        this.currentCooldown -= 0.0025//params.TIMER.tick()*30;
        //I removed params.TIMER.tick()*30 
        //as a bandaid fix for a weird bug
        //where the cooldown would decrease extremely slow randomly
        return this.currentCooldown > 0;
    }

    startCooldown() {
        this.currentCooldown = this.cooldown;
    }

    getRemainingSeconds() {
        this.checkCooldown();
        return Math.max(Math.ceil(this.currentCooldown), 0);
    }
}
