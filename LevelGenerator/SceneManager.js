
class SceneManager {
    constructor(game) {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.game.camera = this;
        this.gameOver = false;
        this.gameWin = false;
        this.winTime = "99:99";
        this.transition = false;
        this.player = new GameCharacter(this.game, 0, 0);
        player = this.player;
        this.playerCurrentHealth = this.player.health;
        this.restoreDarkEnergy(); //restores DE
        this.hasEnteredLevel = false;
        

        // splits the X axis into 5 sections [  |  |  |  |  ] <-- map, playable area --> [  |xx|xx|xx|  ]
        this.quadX = 1650 / 5;
        this.rightBoundX = this.quadX * 3;
        this.midX = (this.quadX * 2.5) + (400 * player.velocity.x/player.MAX_RUN);
        this.leftBoundX = this.quadX * 1;

        // splits the Y axis into 4 sectionsd
        this.quadY = 1000 / 4;
        this.lowerBoundY = this.quadY * 3;
        this.midY = this.quadY * 2;
        this.upperBoundY = this.quadY * 1.5;

        // sets left, right, lower, and upper, map border so player cannot leave the area.
        this.leftXLimit = 0;      // do not change -- does not traverse left of starting point
        this.rightXLimit = 16000; // 16k to stay within background image (right)
        this.lowerYLimit = 700;   // 700 is reasonable to keep starting platform visible
        this.upperYLimit = -8500; // -8500 to stay within background image (top)

        player = this.player;

        this.xCameraOffset = 0;
        this.yCameraOffset = 0;
        //this.loadOpening(); 
        this.loadWelcomeScreen();

    };

    loadLevel() {
        this.clearLevel();
        this.hasEnteredLevel = true;
        gameEngine.addEntityFirst(new HpEffect());
        params.LEVEL += 1;
        updateGameBalancing();
        let level = getLevel(params.LEVEL);
        console.log("Loading Level: " + params.LEVEL);
        let xBoundMin = 1300;
        let xBoundMax = 13000;
        let yBoundMin = 600;
        let yBoundMax = -800;
        this.rightXLimit = 160000;
        //check if this is a boss level
        let mute = document.getElementById("muteCheckbox").checked;
        if (!mute) {
            if (level.boss.length > 0) {
                //set the boss level music
                let levelMusic = "./Music/boss.mp3";
                ASSET_MANAGER.adjustVolumeAsset(levelMusic, .2);
                ASSET_MANAGER.playAssest(levelMusic);
            } else {
                let levelMusic = "./Music/flute.mp3";
                ASSET_MANAGER.adjustVolumeAsset(levelMusic, 0.1);
                ASSET_MANAGER.playAssest(levelMusic);
            }
        }
       


        for (let i = 0; i < level.dnaPickup.length; i++) {
            let dna = level.dnaPickup[i];
            this.game.addEntity(new DnaItemDrop(this.game, dna.x, dna.y));
        }

        for (let i = 0; i < level.reaper.length; i++) {
            let enemy = level.reaper[i];
            this.game.addEntity(new Reaper(this.game, enemy.x, enemy.y, 2));
        }

        for (let i = 0; i < level.molecule.length; i++) {
            let enemy = level.molecule[i];
            this.game.addEntity(new Molecule(this.game, enemy.x, enemy.y, 2));
        }

        for (let i = 0; i < level.boss.length; i++) {
            let boss = new DarkColossus(level.boss[i].x, level.boss[i].y);
            this.game.addEntity(boss);
            this.game.addEntityFirst(new DarkColossusHud(boss));
        }

        //Hazard Growth Tall
        for (let i = 0; i < level.hazardGrowthTall.length; i++) {
            let hazard = level.hazardGrowthTall[i];
            this.game.addEntity(new GrowthHazard(hazard.x, hazard.y, GROWTH_HAZARD_TALL));
        }

        //Hazard Growth Short
        for (let i = 0; i < level.hazardGrowthShort.length; i++) {
            let hazard = level.hazardGrowthShort[i];
            this.game.addEntity(new GrowthHazard(hazard.x, hazard.y, GROWTH_HAZARD_SHORT));
        }

        //Hazard Growth Tall Static
        for (let i = 0; i < level.hazardGrowthTallStatic.length; i++) {
            let hazard = level.hazardGrowthTallStatic[i];
            this.game.addEntity(new GrowthHazardStatic(hazard.x, hazard.y));
        }



        //Portals
        for (let i = 0; i < level.portal.length; i++) {
            let portal = level.portal[i];
            console.log("Portal: " + portal.x + ", " + portal.y);
            let newPortal = new Portal(this.game, portal.x, portal.y, this);
            if (i == level.portal.length-1) {
                newPortal.levelModifier = -1;
                newPortal.levelModifierText = getLevelModifierText(-1);
            }
            this.game.addEntity(newPortal);
        }

        // random ground platforms
        for (let i = 0; i < level.platformGround.length; i++) {
            let platform = level.platformGround[i];
            this.game.addEntity(new Platform(this.game, platform.x, platform.y, 1600, 400,
                ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_hub.png"), new BoundingBox(platform.x, platform.y + 300, 1600, 400)));
        }

        // random small platforms
        for (let i = 0; i < level.platformSmall.length; i++) {
            let x = level.platformSmall[i].x;
            let y = level.platformSmall[i].y;
            //let x = Math.random() * (xBoundMax - xBoundMin) + xBoundMin;
            //let y = Math.random() * (yBoundMax - yBoundMin) + yBoundMin;

            this.game.addEntity(new Platform(this.game, x, y, 256, 256,
                ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_small.png"), new BoundingBox(x+30, y + 120, 200, 100)));
        }

        // random large platforms
        for (let i = 0; i < level.platformLarge.length; i++) {
            let x = level.platformLarge[i].x;
            let y = level.platformLarge[i].y;
            this.game.addEntity(new Platform(this.game, x, y, 884, 496,
                ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_large.png"), new BoundingBox(x+55, y + 140, 740, 100)));
        }

        // random tiny platforms
        for (let i = 0; i < level.platformTiny.length; i++) {
            let x = level.platformTiny[i].x;
            let y = level.platformTiny[i].y;
            // let x = Math.random() * (xBoundMax - xBoundMin) + xBoundMin;
            // let y = Math.random() * (yBoundMax - yBoundMin) + yBoundMin;

            this.game.addEntity(new Platform(this.game, x, y, 184, 184,
                ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_tiny.png"), new BoundingBox(x+7, y + 90, 160, 100)));
        }

        //invisible walls
        for (let i = 0; i < level.invisibleWall.length; i++) {
            let wall = level.invisibleWall[i];      
            this.game.addEntity(new InvisibleWall(this.game, wall.x, wall.y));
        }

        //HordeFightManager
        for (let i = 0; i < level.hordeFightManager.length; i++) {
            let hordeFightManager = level.hordeFightManager[i];
            this.game.addEntity(new HordeFightManager(hordeFightManager.enemies, hordeFightManager.leftBound, hordeFightManager.rightBound));
        }

        //Growth Chase Manager
        for (let i = 0; i < level.growthChaseManager.length; i++) {
            this.game.addEntity(new GrowthChaseManager());
        }
        
        //add background
        gameEngine.addEntity(new Background(this.game));
        

        for (let i = 0; i < 100; i++){
            //Random x coordinate between 0 and CANVAS_WIDTH
            let x = Math.random() * CANVAS_WIDTH;
            //Random y coordinate between 0 and CANVAS_HEIGHT
            let y = Math.random() * CANVAS_HEIGHT;
            params.PARTICLE_SYSTEM.createParticleEffect(x - gameEngine.camera.x, y - gameEngine.camera.y, 3, 120, '#330000', 40, 40, 4);

        }
    
        
    };

    restoreDarkEnergy() {
        player.health = player.baseHealth + params.DARK_ENERGY.hp;
        player.JUMP_ACC = player.JUMP_ACC - (this.game.darkEnergy.jumpHeight * 10);
        player.MAX_RUN = player.MAX_RUN + (this.game.darkEnergy.movementSpeed * 10);
    }

    randomizeLevel() {


    }

    loadBoss(){
        this.loadLevel();

    }

    loadHub() {
        if (this.hasEnteredLevel) {
            ASSET_MANAGER.pauseBackgroundMusic();
        }

        
        this.clearLevel();
        params.LEVEL = 0;
        this.rightXLimit = 3300//4400;
        this.leftXLimit = 0//-1800;
        //Create Inventory UI
        this.game.addEntity(new FloatingObject(300, 500, 242, 194, 15, 0.04, "Press Arrow Keys To Use Abilities"));

        let inventoryBB = new BoundingBox(1200, 835, 248, 200);
        this.game.addEntity(new FloatingObject(1320, 835, 242, 194, 5, 0, "Press E for Inventory"));
        this.game.addEntity(new Interactable(this.game, 1200, 835, 242, 194, ASSET_MANAGER.getAsset("./Sprites/LevelAssets/workbench.png"), inventoryBB, () => {
            //check if inventory is already open
            if (params.STATE != "menu") {
                this.game.addEntityFirst(new InventoryUI(this.game));
                params.STATE = "menu";
            }
        }));

        //Create DE UI
        this.game.addEntity(new FloatingObject(520, 835, 242, 194, 5, 0, "Press E for Dark Energy"));

        this.game.addEntity(new Interactable(this.game, 400, 835, 242, 194, ASSET_MANAGER.getAsset("./Sprites/LevelAssets/workbench.png"), new BoundingBox(400, 835, 248, 200), () => {
            if (params.STATE != "menu") {
                this.game.addEntityFirst(new DarkEnergyUI(this.game));
                params.STATE = "menu";
            }
        }));

        this.game.addEntity(new FloatingObject(1900, 500, 242, 194, 10, 0.05, "Press E to go in portals"));

        //Create Portal Interactable
        this.game.addEntity(new FloatingObject(1750, 700, 242, 194, 15, 0, "Go onwards"));

        let startingPortal = new Portal(this.game, 1600, 750, this)
        startingPortal.levelModifier = 0;
        startingPortal.levelModifierText = "";
        this.game.addEntity(startingPortal);

        //Create Boss Portal Interactable
        let bossPortal = new Portal(this.game, 2100, 750, this)
        bossPortal.levelModifier = -2;
        bossPortal.levelModifierText = "        Dark Colossus";
        this.game.addEntity(bossPortal);

        //this.game.addEntity(new Platform(this.game, 1, 500, 1600, 400, ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_hub.png"), new BoundingBox(0, 830, 1600, 400)));
        ///spawn three of those platforms next to each other but spawn one of them in the middle of the screen and the other two on the sides
        this.game.addEntity(new Platform(this.game, CANVAS_WIDTH/2, 810, 1600, 400, ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_hub.png"), new BoundingBox(CANVAS_WIDTH/2, 1130, 1600, 400)));
        this.game.addEntity(new Platform(this.game, CANVAS_WIDTH/2 - CANVAS_WIDTH/2, 810, 1600, 400, ASSET_MANAGER.getAsset("./Sprites/LevelAssets/platform_hub.png"), new BoundingBox(CANVAS_WIDTH/2 - CANVAS_WIDTH/2, 1130, 1600, 400)));

        this.game.addEntity(new Cross_Background(this.game, 250, 200));
        this.game.addEntity(new Background(this.game));

        
        for (let i = 0; i < 100; i++){
            //Random x coordinate between 0 and CANVAS_WIDTH
            let x = Math.random() * CANVAS_WIDTH;
            //Random y coordinate between 0 and CANVAS_HEIGHT
            let y = Math.random() * CANVAS_HEIGHT;
            params.PARTICLE_SYSTEM.createParticleEffect(x - gameEngine.camera.x, y - gameEngine.camera.y, 3, 120, 'black', 40, 40, 4);

        }
    
    }

    loadImportantEntities() {
        params.HUD = new hud(gameEngine);
            gameEngine.addEntity(params.HUD);
            //add dna to inventory
            for (let i = 0; i < 3; i++)
                params.INVENTORY.inventory.push(getRandomDNA());

            params.INVENTORY.inventory[0].epsilonAbility = null;
            params.INVENTORY.inventory[0].betaAbility = null;
            params.INVENTORY.inventory[0].alphaAbility = new CosmicBladeAbility(1, 1);
            params.INVENTORY.inventory[0].sigmaAbility = null;
            params.INVENTORY.dnaSlot1 = params.INVENTORY.inventory[0];
            equipAbilities(params.INVENTORY.dnaSlot1);
    }

    loadWelcomeScreen() {
        this.game.addEntity(new Welcome_Screen_Background(this.game));
        this.game.addEntityFirst(new WelcomeScreenUI(this.game, 400, 400, 400, 80, 'white'));
        //this.loadOpening();



    }


    loadTitleScreen() {

        this.game.addEntity(new Title_Screen_Background(this.game));

        addEventListener('click', (event) => { });

        onclick = (event) => {
            onclick = null
            params.HUD = new hud(gameEngine);
            gameEngine.addEntity(params.HUD);
            //add dna to inventory
            //for (let i = 0; i < 3; i++)
                //params.INVENTORY.inventory.push(getRandomDNA());

            params.INVENTORY.inventory[0].epsilonAbility = null;
            params.INVENTORY.inventory[0].betaAbility = null;
            params.INVENTORY.inventory[0].alphaAbility = new CosmicBladeAbility(3, 3);
            params.INVENTORY.inventory[0].sigmaAbility = null;
            params.INVENTORY.dnaSlot1 = params.INVENTORY.inventory[0];
            equipAbilities(params.INVENTORY.dnaSlot1);
            gameEngine.camera.loadHub();
            //gameEngine.camera.loadOpening();
        };
    }

    loadDeathScreen() {
        if (this.hasEnteredLevel) {
            ASSET_MANAGER.pauseBackgroundMusic();
        }
        this.clearLevel();
        params.DARK_ENERGY.currency = Math.floor(params.DARK_ENERGY.currency * 0.5);
        this.game.addEntityFirst(new End_Screen_Background(this.game, false));
        gameEngine.camera.gameOver = false;
        let timer = 100;
        addEventListener('click', (event) => { });

        onclick = (event) => {
            onclick = null
            gameEngine.camera.gameOver = false;
            gameEngine.camera.loadDeathCutscene();
            //gameEngine.camera.loadHub();


        };

        //gameEngine.camera.loadDeathCutscene();
    }

    loadWinScreen() {
        this.clearLevel();
        this.game.addEntityFirst(new End_Screen_Background(this.game, true));
        gameEngine.camera.gameOver = false;
        this.gameWin = false;
        let timer = 100;
        
        addEventListener('click', (event) => { });
        onclick = (event) => {
            onclick = null
           // gameEngine.camera.loadHub();
        };
    }



    update() {
        //Make the camera move based off this bounding box
/*      // Keeps player in rightBoundX
        if (this.player.x > rightBoundX && !(this.player.x + rightBoundX >= rightXLimit)) this.x = this.player.x - rightBoundX;
        if (this.player.x < leftBoundX && !(this.player.x - leftBoundX <= leftXLimit)) this.x = this.player.x - leftBoundX;
*/     

        this.xCameraSmoothing();
        //this.yCameraSmoothing(); Y camera smoothing was harder to implement so I just left it out for now
        this.midX = (this.quadX * 2.5) - this.xCameraOffset;
        this.midY = (this.quadY * 2.5);


        // Keeps player centered on X
        if (this.player.x > this.midX && !(this.player.x + this.midX >= this.rightXLimit)) this.x = this.player.x - this.midX;
        if (this.player.x < this.midX && !(this.player.x - this.midX <= this.leftXLimit)) this.x = this.player.x - this.midX;


        if (this.player.y < this.upperBoundY && !(this.player.y + this.upperBoundY <= this.upperYLimit)) this.y = this.player.y - this.upperBoundY;
        if (this.player.y > this.lowerBoundY && !(this.player.y - this.lowerBoundY >= this.lowerYLimit)) this.y = this.player.y - this.lowerBoundY;


        //if (this.player.y < upperBoundY && !(this.player.y <= upperYLimit)) this.y = this.player.y - upperBoundY;
        //if (this.player.y > lowerBoundY && !(this.player.y - lowerBoundY != lowerYLimit)) this.y = this.player.y - lowerBoundY;

        if (this.gameOver) {
           this.loadDeathScreen();
           player.removeFromWorld = true;
        } else if (this.gameWin) {
            this.loadWinScreen();
            player.removeFromWorld = true;
        }

        if (player != null) this.playerCurrentHealth = player.health;

    };

    draw(ctx) {

    };

    //This function adds a slight smoothing to the camera movement
    xCameraSmoothing() {
        const SMOOTHING = 0.006;
        let max = 300; 
        let min = -300;
        let target = 0;
        let velocity = player.velocity.x/player.MAX_RUN + 0.01;
        if (velocity === 0) {
            target = 0;
        } else {
            target = max * velocity;
        }
        this.xCameraOffset += (target - this.xCameraOffset) * SMOOTHING;
        this.xCameraOffset = this.xCameraOffset <= min ? min : this.xCameraOffset >= max ? max : this.xCameraOffset;
    }

    yCameraSmoothing() {
        const SMOOTHING = 0.05;
        let max = 500;
        let min = -500;
        let target = 0;
        let velocity = player.velocity.y/player.MAX_RUN + 0.01;
        if (velocity === 0) {
            target = 0;
        } else {
            target = max * velocity;
        }
        this.yCameraOffset += (target - this.yCameraOffset) * SMOOTHING;
        this.yCameraOffset = this.yCameraOffset <= min ? min : this.yCameraOffset >= max ? max : this.yCameraOffset;
    }
    
    

    clearLevel() {
        this.game.entities.forEach(function (entity) {
            if (!(entity instanceof Inventory || entity instanceof DarkEnergy || entity instanceof SceneManager || entity instanceof hud || entity instanceof ParticleEffectSystem)) {
                entity.removeFromWorld = true;
            }
        });
 
        //SET ALL ABILITIES TO NOT IN USE TO PREVENT BUG
        if (params.INVENTORY.dnaSlot1 != null) {
            let dna = params.INVENTORY.dnaSlot1;
            if (dna.sigmaAbility != null) dna.sigmaAbility.inUse = false;
            if (dna.epsilonAbility != null) dna.epsilonAbility.inUse = false;
            if (dna.alphaAbility != null) dna.alphaAbility.inUse = false;
            if (dna.betaAbility != null) dna.betaAbility.inUse = false;
        }
        this.game.camera.x = 0;
        this.game.camera.y = 0;
        this.player = new GameCharacter(this.game, CANVAS_WIDTH/3, 0);
        player = this.player; //update global player reference
        player.health = this.playerCurrentHealth;
        equipAbilities(params.INVENTORY.dnaSlot1); //equip abilities
        equipAbilities(params.INVENTORY.dnaSlot2);
        this.restoreDarkEnergy();
        this.game.addEntity(this.player);
    }

    loadOpening() {
        this.loadImportantEntities();
        let openingText = [
            "The universe has ended",
            "Consumed by the infinite void",
            "All that remains is a battle of reprisal",
            "Between the Dark Colossus and the last soul to resist it"
        ];
        gameEngine.addEntityFirst(new TextCutscene(openingText, 0.01));
    }

    loadDeathCutscene() {
        //random int between 1 and 36
        let deathCount = Math.floor(Math.random() * 36) + 1;
        let deathText = [];
        switch (deathCount) {
            case 1:
                deathText = [
                    "Your soul fades away into the void",
                    "The Dark Colossus grows stronger with every death"
                ];
                break;
            case 2:
                deathText = [
                    "You have failed to save the universe once",
                    "But you can still take revenge"
                ];
                break;
            case 3:
                deathText = [
                    "You die again...",
                    "The Cosmic Blade fails you",
                    "But you can't give up now"
                ];
                break;
            case 4:
                deathText = [
                    "The Reapers laugh at your defeat",
                    "Your efforts were valiant, but not enough"
                ];
                break;
            case 5:
                deathText = [
                    "The Reapers feast on your soul",
                    "The Molecules tear you apart"
                ];
                break;
            case 6:
                deathText = [
                    "The end is near",
                    "The Dark Colossus cackles in triumph",
                    "Your fate is sealed"
                ];
                break;
            case 7:
                deathText = [
                    "The Molecules continue their onslaught",
                    "Your sacrifice was in vain"
                ];
                break;

            case 8:
                deathText = [
                    "The Astral Beam fizzles out",
                    "What will you do now?"
                ];
                break;
            case 9:
                deathText = [
                    "The Solar Flare engulfs you",
                    "You are consumed by the flames",
                ];
                break;
            case 10:
                deathText = [
                    "The Dark Colossus looms over you",
                    "You are powerless to stop it",
                ];
                break;
            case 11:
                deathText = [
                    "Tell me, lost soul...",
                    "Why do you fight when the universe is already lost?"
                ];
                break;
            case 12:
                deathText = [
                    "You are consumed by the infinite void",
                    "How dissapointing"
                ];
                break;
            case 13:
                deathText = [
                    "Even with the power of Dark Energy...",
                    "You are still no match for the Dark Colossus"
                ];
                break;
            case 14:
                deathText = [
                    "Tell me, lost soul...",
                    "What was your family like?"
                ];
                break;
            case 15:
                deathText = [
                    "Tell me, lost soul...",
                    "Did you ever love anyone?"
                ];
                break;
            case 16:
                deathText = [
                    "Tell me, lost soul...",
                    "How heavy is the weight of life?"
                ];
                break;
            case 17:
                deathText = [
                    "Your insides are torn apart",
                    "Ripped apart atom by atom",
                    "You become among the Molecules"
                ];
                break;
            case 18:
                deathText = [
                    "Your consciousness is lost to the void",
                    "Frozen in a moment of time",
                    "No death, no peace"
                ];
                break;
            case 19:
                deathText = [
                    "You died. Painful.",
                    "But not as painful as losing everyone you ever loved"
                ];
                break;
            case 20:
                deathText = [
                    "Your persistence is respected",
                    "But respect does not bring back the dead"
                ]
                break;
            case 21:
                deathText = [
                    "If you could go back in time...",
                    "Would you have lived your life differently?"
                ];
                break;
            case 22:
                deathText = [
                    "There was never a different outcome",  
                    "You were always going to die",
                    "A failure"
                ];
                break;
            case 23:
                deathText = [
                    "The screeches of the Molecules pierce your ears",
                    "You are consumed by terror"
                ];
                break;
            case 24:
                deathText = [
                    "Reapers repurpose your consciousness for their own use",
                    "You become scythe fodder"
                ];
                break;
            case 25:
                deathText = [
                    "The pressure to perform is too much",
                    "You can't take it anymore"
                ];
                break;
            case 26:
                deathText = [
                    "I once heard of the Dark Angel",
                    "A being of pure darkness",
                    "Prophesized to bring the end of the universe",
                    "Or bring about a new beginning",
                    "I wonder if it's true...",
                    "What is your name, lost soul?"
                ];
                break;
            case 27:
                deathText = [
                    "Lost soul, you have lost your mind completely",
                    "There's nothing left for you here",
                    "Why do you keep fighting?"
                ];
                break;
            case 28:
                deathText = [
                    "If you ever have a chance to go back in time...",
                    "You should splice DNA to make yourself stronger"
                ];
                break;
            case 29:
                deathText = [
                    "The Dark Colossus senses your presence",
                    "It is angered by your continued existence",
                    "It will not let you live"
                ];
                break;
            case 30:
                deathText = [
                    "Lost soul...",
                    "What was your home world like?"
                ];
                break;
            case 31:
                deathText = [
                    "Lost soul...",
                    "What was your favorite food?"
                ];
                break;
            case 32:
                deathText = [
                    "The eerie landscape of the Dark Colossus' domain",
                    "It feels unnatural",
                    "Like you're being watched"
                ];
                break;
            case 33:
                deathText = [
                    "As you die, you wonder...",
                    "Did those who died before you share this feeling?"
                ];
                break;
            case 34:
                deathText = [
                    "How many times have you died?",
                    "Is this your first time?",
                    "Or have you died many times before?",
                    "You can't remember..."
                ];
                break;
            case 35:
                deathText = [
                    "Your grave is dug before you by the Reapers",
                    "All you can do is watch as they bury you"
                ];
                break;
            case 36:
                deathText = [
                    "Amswer me, lost soul...",
                    "Do you ever feel...",
                    "Like someone's watching you, " + NAME + "?" 
                ];
                break;
        }
        
        gameEngine.addEntityFirst(new TextCutscene(deathText, 0.01));
    }

    // For death condition
    // clearEntities() {
    //     this.game.entities = this.game.entities.filter(function (entity) {
    //         return entity instanceof Inventory || entity instanceof DarkEnergy || entity instanceof SceneManager || entity instanceof hud;
    //     });
    //     this.game.camera.x = 0;
    //     this.game.camera.y = 0;
    //     this.player = new GameCharacter(this.game, CANVAS_WIDTH/2-150, 0);
    //     player = this.player; //update global player reference
    //     equipAbilities(params.INVENTORY.dnaSlot1); //equip abilities
    //     equipAbilities(params.INVENTORY.dnaSlot2);
    //     this.game.addEntity(this.player);
    // };
    
}

class Background {
	constructor(game) {
        this.game = game;
		this.width = 2100;
		this.height = 1350;
		this.x = -200;
		this.y = -200
		this.scrollSpeed = 0.02;
		this.image = ASSET_MANAGER.getAsset("./Sprites/LevelAssets/background.png");
	}

	draw(ctx) {
		ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed), this.y-(this.game.camera.y*this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed)+this.width, this.y-(this.game.camera.y*this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed)-this.width, this.y-(this.game.camera.y*this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed)+this.width*2, this.y-(this.game.camera.y*this.scrollSpeed)+this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed)-this.width*2, this.y-(this.game.camera.y*this.scrollSpeed)+this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed)+this.width*3, this.y-(this.game.camera.y*this.scrollSpeed)+this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x-(this.game.camera.x*this.scrollSpeed)-this.width*3, this.y-(this.game.camera.y*this.scrollSpeed)+this.height, this.width, this.height);
    }
	update() {

	}
}

class Cross_Background {
    constructor(game, x, y) {
        this.game = game;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.x = x;
        this.y = y;
        this.animation = new Animator(ASSET_MANAGER.getAsset("./Sprites/LevelAssets/cross_background.png"), 0, 0, 1400, 900, 1, 1, true, true);
        this.t = 0;
        this.amplitude = 20;
    }

    draw(ctx) {
        this.t += 0.025;
        // ctx.drawImage(this.image, this.x-(this.game.camera.x), this.y-(this.game.camera.y), this.width, this.height);
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y + Math.sin(this.t) * this.amplitude, 1);
    }

    update() {

    }
}

class Welcome_Screen_Background {
    constructor(game) {
        this.game = game;
        this.width = 1920;
        this.height = 1080;
        this.x = 0;
        this.y = 0
        this.scrollSpeed = 0.02;
        this.image = ASSET_MANAGER.getAsset("./Sprites/UI/welcome_screen.png");
        
    }

    draw(ctx) {

        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed), this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width, this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width, this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width * 2, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width * 2, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width * 3, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width * 3, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
    }
    update() {

    }
}

class Title_Screen_Background {
    constructor(game) {
        this.game = game;
        this.width = 1920;
        this.height = 1080;
        this.x = 0;
        this.y = 0
        this.scrollSpeed = 0.02;
        this.image = ASSET_MANAGER.getAsset("./Sprites/UI/title_screen.png");
        
    }

    draw(ctx) {

        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed), this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width, this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width, this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width * 2, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width * 2, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width * 3, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width * 3, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);

/*
        ctx.textAlign = "center";

        ctx.fillStyle = "black";
        ctx.font = "60px  " + params.FONT
        ctx.fillText("New Game", CANVAS_WIDTH / 2 - 2, 500 - 2);
        ctx.fillStyle = "white";
        ctx.font = "60px  " + params.FONT
        ctx.fillText("New Game", CANVAS_WIDTH / 2, 500);


        ctx.fillStyle = "black";
        ctx.font = "40px " + params.FONT
        ctx.fillText("Continue", CANVAS_WIDTH / 2 - 2, 600 - 2);
        ctx.fillStyle = "white";
        ctx.font = "40px " + params.FONT
        ctx.fillText("Continue", CANVAS_WIDTH / 2, 600);

        this.game.addEntity(new Cross_Background(this.game));
*/


        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = './Fonts/fontface.css';
        document.getElementsByTagName('head')[0].appendChild(link);

        // Single option to begin game
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "80px " + params.FONT;
        ctx.fillText("Click to Begin", CANVAS_WIDTH / 2 - 2, 600 - 2);
        ctx.fillStyle = "white";
        ctx.font = "80px " + params.FONT
        ctx.fillText("Click to Begin", CANVAS_WIDTH / 2, 600);

        ctx.fillStyle = "black";
        ctx.font = "20px  " + params.FONT
        ctx.fillText("ESC to Pause", CANVAS_WIDTH / 2 - 2, 700 - 2);
        ctx.fillStyle = "white";
        ctx.font = "20px  " + params.FONT
        ctx.fillText("ESC to Pause", CANVAS_WIDTH / 2, 700);


    }

    update() {
        //check if any controls are pressed in game controller
        if (isAnyControllerButtonPressed()){
            params.HUD = new hud(gameEngine);
            gameEngine.addEntity(params.HUD);
            //add dna to inventory
            for (let i = 0; i < 3; i++)
                params.INVENTORY.inventory.push(getRandomDNA());

            
            params.INVENTORY.inventory[0].epsilonAbility = null;
            params.INVENTORY.inventory[0].betaAbility = null;
            params.INVENTORY.inventory[0].alphaAbility = new CosmicBladeAbility(3, 3);
            params.INVENTORY.inventory[0].sigmaAbility = null;
            params.INVENTORY.dnaSlot1 = params.INVENTORY.inventory[0];
            equipAbilities(params.INVENTORY.dnaSlot1);
            this.game.camera.loadHub();
        }
    }
}

class End_Screen_Background {
    constructor(game, win) {
        this.win = win;
        this.leaderboardScreen = false;
        this.game = game;
        this.width = 1920;
        this.height = 1080;
        this.x = 0;
        this.y = 0
        this.scrollSpeed = 0.02;
        this.timer = 0;
        this.image = ASSET_MANAGER.getAsset("./Sprites/UI/leaderboards_screen.png");
        getLeaderboard(NAME, params.LEVEL);

        if (win){
            getBossLeaderboard(NAME, gameEngine.camera.winTime);
        } else {
            getBossLeaderboard(NAME, "99:99");
        }
    }

    draw(ctx) {


        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed), this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width, this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width, this.y - (this.game.camera.y * this.scrollSpeed), this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width * 2, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width * 2, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) + this.width * 3, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);
        ctx.drawImage(this.image, this.x - (this.game.camera.x * this.scrollSpeed) - this.width * 3, this.y - (this.game.camera.y * this.scrollSpeed) + this.height, this.width, this.height);


        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = './Fonts/fontface.css';
        document.getElementsByTagName('head')[0].appendChild(link);

        // Single option to begin game
        ctx.textAlign = "center";
        ctx.fillStyle = "black";

        ctx.font = "60px " + params.FONT
        if (this.leaderboardScreen){
            ctx.fillText("Leaderboards", CANVAS_WIDTH / 2 - 2, 150 - 2);
        } else if (this.win) {
            ctx.font = "40px " + params.FONT
            ctx.fillText(NAME + " defeated the Dark Colossus in " + gameEngine.camera.winTime, CANVAS_WIDTH / 2 - 2, 150 - 2);
        } else if (currentLevelModifier == BOSS){
            ctx.fillText(NAME + "could not get revenge", CANVAS_WIDTH / 2 - 2, 150 - 2);
        } else {
            ctx.fillText(NAME + " died on level " + params.LEVEL, CANVAS_WIDTH / 2 - 2, 150 - 2);
        }
        ctx.fillStyle = "white";
        ctx.font = "60px " + params.FONT
        if (this.leaderboardScreen){
            ctx.fillText("Leaderboards", CANVAS_WIDTH / 2 - 2, 150 - 2);
        } else if (this.win) {
            ctx.font = "40px " + params.FONT
            ctx.fillText(NAME + " defeated the Dark Colossus in " + gameEngine.camera.winTime, CANVAS_WIDTH / 2, 150);
        } else if (currentLevelModifier == BOSS){
            ctx.fillText(NAME + " could not get revenge", CANVAS_WIDTH / 2, 150);
        } else {
            ctx.fillText(NAME + " died on level " + params.LEVEL, CANVAS_WIDTH / 2, 150);
        }
        ctx.font = "50px " + params.FONT

        // Draw the Highest Level leaderboard
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 50px Agency';
        ctx.textAlign = 'left';
        let xAlign = 297;
        let yAlign = 330;

        for (let i = 0; i < 10; i++) {
          if (ALL_TIME_LEADERBOARD == undefined || ALL_TIME_LEADERBOARD.leaderboard == undefined || ALL_TIME_LEADERBOARD.leaderboard[i] == undefined) continue;
          const entry = ALL_TIME_LEADERBOARD.leaderboard[i];
        //   console.log(ALL_TIME_LEADERBOARD);
        //   console.log(entry);

          //AJ EDIT HERE
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'left';
          let fontSize = 25 
            ctx.font = fontSize + 'px Agency';
          ctx.fillText(`Lv${entry.score} - ${entry.name} ${entry.time}`, xAlign, yAlign+50 + i*fontSize*1.5);
        }

        // Draw the Dark Colossus Best Time leaderboard
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 50px Agency';
        ctx.textAlign = 'left';
        xAlign = 1310;
        //put text that says coming soon

        for (let i = 0; i < 10; i++) {
          //if (ALL_TIME_LEADERBOARD == undefined || ALL_TIME_LEADERBOARD.leaderboard == undefined || ALL_TIME_LEADERBOARD.leaderboard[i] == undefined) continue;

            if (BOSS_LEADERBOARD == undefined || BOSS_LEADERBOARD.leaderboard == undefined || BOSS_LEADERBOARD.leaderboard[i] == undefined) continue;
            let bossEntry = BOSS_LEADERBOARD.leaderboard[i];
            //console.log(BOSS_LEADERBOARD);
    
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            let fontSize = 25  
            ctx.font = fontSize + 'px Agency';
            ctx.fillText(`${bossEntry.bossTime} - ${bossEntry.name} ${bossEntry.time}`, xAlign, yAlign+50 + i*fontSize*1.5);
            //ctx.fillText(`Lv${entry2.score} - ${entry2.name} ${entry2.time}`, xAlign, yAlign+50 + i*fontSize*1.5);

        }
    }

    update() {
        //check if any controls are pressed in game controller
        if (this.timer > 1 && (isAnyControllerButtonPressed() || isAnyKeyPressed()) && !this.win){
            this.game.camera.gameOver = false;
           // this.game.camera.loadHub();
           this.removeFromWorld = true;
           if (this.leaderboardScreen){
            gameEngine.camera.loadImportantEntities();
            gameEngine.camera.loadHub();
           } else {
            gameEngine.camera.loadDeathCutscene();
           }
        } else if (this.timer > 1 && (isAnyControllerButtonPressed() || isAnyKeyPressed()) && this.win){
            this.game.camera.gameWin = false;
            this.removeFromWorld = true;
            gameEngine.camera.loadHub();
        }
        this.timer += 0.01
    }
}

/*class ControlsBackground {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.width = 1920;
        this.height = 1080;
        this.image = ASSET_MANAGER.getAsset("./Sprites/UI/controls.png");
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {

    }
}*/

class WelcomeScreenUI {
    constructor(game) {
        //initializing state
        this.game = game;
        this.width = 450;
        this.height = 100;
        this.gridStartX = 140;
        this.gridStartY = 480;
        this.option = 1;
        this.controlsImage = false;
        this.leaderboardImage = false;
        this.loadOpening = false;

    };



    draw(ctx) {

        console.log("draw");
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(this.gridStartX, this.gridStartY, this.width, this.height);


        const image = new Image();
        image.src = "./Sprites/UI/controls.png";
        if (this.controlsImage) {
            ctx.drawImage(image, 0, 0);
            
        }


    }



    update() {

        if ((keypress("KeyW") || this.game.controllerButtonUp_press)) {
            if (this.option > 1) {
                this.option -= 1;
                this.gridStartY -= 115;
            }
        }

        if ((keypress("KeyS") || this.game.controllerButtonDown_press)) {
            if (this.option < 3) {
                this.option += 1;
                this.gridStartY += 115;
            }
        }

        if ( keypress("Enter") || this.game.controllerButtonA_press || keypress("Space")
            || keypress("KeyE")) {
            if (this.option === 1 && !this.loadOpening) {
               this.loadOpening = true;
               gameEngine.camera.loadOpening();
            }
            if (this.option === 2) {
                this.option = 1;
                this.controlsImage = true;

            }
            if (this.option === 3) {
                // load leaderboards KEVIN
                // use leaderboards_screen.png as background
                let leaderboardScreen = new End_Screen_Background(this.game, false);
                leaderboardScreen.leaderboardScreen = true;
                this.game.addEntityFirst(leaderboardScreen);
                this.removeFromWorld = true;
            }
        }
    }

}