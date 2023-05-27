/** Global Parameters Object */
const params = { 
    STATE : "gameplay",
    LEVEL: 0, 
    INVENTORY : null,
    HUD : null,
    DARK_ENERGY : null, 
    CANVAS : null,
    TIMER : null,
    RESURRECTS: 0,
    PARTICLE_SYSTEM: null,
    LEVEL_MODIFIER: -1,
    FONT : "Agency",

};


let CANVAS_HEIGHT = 0;
let CANVAS_WIDTH = 0;
let player = null;
let debug = false;

function toggleDebug() {
    debug = !debug;
}

function keypress(key) {
    if (gameEngine.keys[key] && !gameEngine.keysPressed[key]) {
        gameEngine.keysPressed[key] = true;
        return true;
    } else {
        return false;
    }
};

function keyhold(key) {
    if (gameEngine.keys[key]) {
        return true;
    } else {
        return false;
    }
};

function clearAllInput() {
    for (let key in gameEngine.keys) {
        gameEngine.keys[key] = false;
    }

    for (let key in gameEngine.keysPressed) {
        gameEngine.keysPressed[key] = false;
    }
}

function equipAbilities(dna){
    console.log("equipping:" + dna);
    if (dna == null) return;
    if (dna.sigmaAbility != null) dna.sigmaAbility.onEquip();
    if (dna.alphaAbility != null) dna.alphaAbility.onEquip();
    if (dna.betaAbility != null) dna.betaAbility.onEquip();
    if (dna.epsilonAbility != null) dna.epsilonAbility.onEquip();
    
}

function unequipAbilities(dna){
    console.log("unequipping:" + dna);
    if (dna == null) return;
    if (dna.sigmaAbility != null) dna.sigmaAbility.onUnequip();
    if (dna.alphaAbility != null) dna.alphaAbility.onUnequip();
    if (dna.betaAbility != null) dna.betaAbility.onUnequip();
    if (dna.epsilonAbility != null) dna.epsilonAbility.onUnequip();
}

//run the update method once on all abiilties in params.INVENTORY
function updateAbilities() {
    for (let i = 0; i < params.INVENTORY.inventory.length; i++) {
        if (params.INVENTORY.inventory[i] == null) continue;
            if (params.INVENTORY.inventory[i].sigmaAbility != null) params.INVENTORY.inventory[i].sigmaAbility.update();
            if (params.INVENTORY.inventory[i].alphaAbility != null) params.INVENTORY.inventory[i].alphaAbility.update();
            if (params.INVENTORY.inventory[i].betaAbility != null) params.INVENTORY.inventory[i].betaAbility.update();
            if (params.INVENTORY.inventory[i].epsilonAbility != null) params.INVENTORY.inventory[i].epsilonAbility.update();
    }
}    

function wrapText(ctx, text, x, y, maxWidth, lineHeight, color) {
    ctx.fillStyle = color;
    let words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    ctx.fillStyle = "#FFFFFF";
}  
  
  
  
  


/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();


/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};