// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {
            // Movement
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false,
            KeyE: false,
            KeyP: false,
            Space: false,
            Escape: false
        };

        this.keysPressed = {
            // Movement
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false,
            KeyE: false,
            KeyF: false,
            KeyP: false,
            Space: false,
            Escape: false,
            Digit1: false,
            Digit2: false,
            Digit3: false,
            Digit4: false,
            Digit5: false
        };

        // Information on gamepad controller input
        this.controllerButtonLeft = false;
        this.controllerButtonRight = false;
        this.controllerButtonUp = false;
        this.controllerButtonDown = false;
        this.controllerButtonA = false;
        this.controllerButtonB = false;
        this.controllerButtonX = false;
        this.controllerButtonY = false;
        this.controllerButtonLB = false;
        this.controllerButtonRB = false;
        this.controllerButtonRT = false;
        this.controllerButtonLT = false;
        this.controllerButtonLogo = false; // does not work with xbox gamebar installed
        this.controllerButtonLeftStick = false;
        // controller single presses
        this.controllerButtonLeft_press = false;
        this.controllerButtonRight_press = false;
        this.controllerButtonUp_press = false;
        this.controllerButtonDown_press = false;
        this.controllerButtonA_press = false;
        this.controllerButtonB_press = false;
        this.controllerButtonX_press = false;
        this.controllerButtonY_press = false;
        this.controllerButtonLB_press = false;
        this.controllerButtonRB_press = false;
        this.controllerButtonRT_press = false;
        this.controllerButtonLT_press = false;
        this.controllerButtonStart_press = false;
        this.controllerButtonSelect_press = false;

        this.buttonPressAllowed = true;
        this.initialPress = 0.0;
        this.nextPress = 0.0;
        this.newTime = true;

        this.gamepad = null;
        this.darkEnergy = new DarkEnergy();
        params.DARK_ENERGY = this.darkEnergy;

        // Test for inventory on death reset
        // this.Inventory = new Inventory();
        // params.INVENTORY= this.Inventory;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };


    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
        params.TIMER = this.timer;
    };

    start() {
        this.running = true;
        this.PAUSED = false;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => {
            // if (this.keysPressed[event.code] == false){
            //     this.keys[event.code] = true;
            //     this.keysPressed[event.code] = true;
            // } else {
            //     this.keys[event.code] = false;
            // }
            this.keys[event.code] = true;
        });
        
        this.ctx.canvas.addEventListener("keyup", event => {
            this.keys[event.code] = false;
            this.keysPressed[event.code] = false;
        });
    };


    addEntityFirst(entity) {
        this.entities.unshift(entity);
    };


    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }

        if (this.PAUSED) {
            const image = new Image();
            image.src = "./Sprites/UI/pause_screen.png";
            this.ctx.drawImage(image, 0, 0);
        }
    };

    gamepadUpdate() {
        this.gamepad = navigator.getGamepads()[0];
        let gamepad = this.gamepad;
        if (gamepad != null) {

            // button presses with no cooldown
            if (params.STATE != "menu") {
                this.controllerButtonA = gamepad.buttons[0].pressed;
                this.controllerButtonB = gamepad.buttons[1].pressed;
                this.controllerButtonX = gamepad.buttons[2].pressed;
                this.controllerButtonY = gamepad.buttons[3].pressed;
                this.controllerButtonLB = gamepad.buttons[4].pressed;
                this.controllerButtonRB = gamepad.buttons[5].pressed;
                this.controllerButtonLT = gamepad.buttons[6].pressed;
                this.controllerButtonRT = gamepad.buttons[7].pressed;
                this.controllerButtonSelect = gamepad.buttons[8].pressed;
                this.controllerButtonStart = gamepad.buttons[9].pressed;
                this.controllerButtonLeftStick = gamepad.buttons[10].pressed;
                this.controllerButtonUp = gamepad.buttons[12].pressed || gamepad.axes[0] < -0.3;
                this.controllerButtonDown = gamepad.buttons[13].pressed || gamepad.axes[0] > 0.3;
                this.controllerButtonLeft = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
                this.controllerButtonRight = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;
            } else {
                this.controllerButtonLeft = false;
                this.controllerButtonRight = false;
                this.controllerButtonUp = false;
                this.controllerButtonDown = false;
                this.controllerButtonA = false;
                this.controllerButtonB = false;
                this.controllerButtonX = false;
                this.controllerButtonY = false;
                this.controllerButtonLB = false;
                this.controllerButtonRB = false;
                this.controllerButtonRT = false;
                this.controllerButtonLT = false;
                this.controllerButtonLogo = false;
            }

            // set interval for button presses
            let currentTime = Date.now() / 1000;
            // check is consecutive button presses are allowed
            if (this.buttonPressAllowed && this.newTime) {
                this.nextPress = currentTime + .1; 
                this.newTime = false;
            }
            // check if button is pressed and if it is allowed to be pressed assign button press to true
            if ((currentTime > this.nextPress)) {
                this.buttonPressAllowed = true;
                this.newTime = true;

                this.controllerButtonA_press = gamepad.buttons[0].pressed;
                this.controllerButtonB_press = gamepad.buttons[1].pressed;
                this.controllerButtonX_press = gamepad.buttons[2].pressed;
                this.controllerButtonY_press = gamepad.buttons[3].pressed;
                this.controllerButtonLB_press = gamepad.buttons[4].pressed;
                this.controllerButtonRB_press = gamepad.buttons[5].pressed;
                this.controllerButtonLT_press = gamepad.buttons[6].pressed;
                this.controllerButtonRT_press = gamepad.buttons[7].pressed;
                this.controllerButtonSelect_press = gamepad.buttons[8].pressed;
                this.controllerButtonStart_press = gamepad.buttons[9].pressed;
                this.controllerButtonLeftStick_press = gamepad.buttons[10].pressed;
                this.controllerButtonUp_press = gamepad.buttons[12].pressed || gamepad.axes[0] < -0.3;
                this.controllerButtonDown_press = gamepad.buttons[13].pressed || gamepad.axes[0] > 0.3;
                this.controllerButtonLeft_press = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
                this.controllerButtonRight_press = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;

            } else { // if button is not pressed set all button presses to false
                this.controllerButtonLeft_press = false;
                this.controllerButtonRight_press = false;
                this.controllerButtonUp_press = false;
                this.controllerButtonDown_press = false;
                this.controllerButtonA_press = false;
                this.controllerButtonB_press = false;
                this.controllerButtonX_press = false;
                this.controllerButtonY_press = false;
                this.controllerButtonLB_press = false;
                this.controllerButtonRB_press = false;
                this.controllerButtonRT_press = false;
                this.controllerButtonLT_press = false;
                this.controllerButtonStart_press = false;
                this.controllerButtonSelect_press = false;
            

        }
    } }

    update() {
        let entitiesCount = this.entities.length;
        this.gamepadUpdate();

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        this.camera.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }

        if (keypress("KeyB") || this.controllerButtonSelect_press) toggleDebug();
    };
    
    loop() {
        if(!this.PAUSED) {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();

            //Global single press
            this.keys.KeyE = false;
            this.keys.KeyP = false;

            //menu specific single presses
            if (params.STATE == "MENU") {
                this.keys.Digit1 = false;
                this.keys.Digit2 = false;
                this.keys.Digit3 = false;
                this.keys.Digit4 = false;
                this.keys.Digit5 = false;
                this.keys.KeyW = false;
                this.keys.KeyS = false;
                this.keys.KeyA = false;
                this.keys.KeyD = false;

            }
            


        } else {
            this.clockTick = null;
            this.update();
            // this.draw();
        }
        
        // this.update();
        // this.draw();
    };

};

// KV Le was here :)


function isAnyControllerButtonPressed() {
    let gamepad = gameEngine.gamepad;
    if (gamepad != null) {
        for (let i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i].pressed) {
                return true;
            }
        }
    }
    return false;
}

function isAnyKeyPressed() {
    for (let key in gameEngine.keys) {
        if (gameEngine.keys[key]) {
            return true;
        }
    }
    return false;
}

function isAnyInputDetected() {
    return isAnyControllerButtonPressed() || isAnyKeyPressed();
}