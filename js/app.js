// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -150;
    this.y = randomEnemyPosition();
    this.speed = getRandomNumberBetween(3, 7);

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed;
    if (player.getPlayer().x >= this.x - 30 && player.getPlayer().x < this.x + 30 && player.getPlayer().y === this.y) {
        console.log("collision");
        player.getPlayer().x = 202;
        player.getPlayer().y = 390;
    }

    if (this.x > 600) {
        this.speed = getRandomNumberBetween(3, 7);
        this.x = -150;
        this.y = randomEnemyPosition();
        console.log(this.speed);
    }
    return dt * this.x;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 202;
        this.y = 390;
    }

    update() {
        if (this.y < 58) {//win condition
            console.log("win");
            setTimeout(() => {
                this.x = 202;
                this.y = 390;
            }, 100);
        }
        if (this.x > 404) {//restrain player to canvas
            this.x = 404;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.y > 390) {
            this.y = 390;
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(key) {
        if (key === "up") {
            this.y -= 83;
            console.log("up");
        } else if (key === "down") {
            this.y += 83;
            console.log("down");
        } else if (key === "left") {
            this.x -= 101;
            console.log("left");
        } else if (key === "right") {
            this.x += 101;
            console.log("right");
        }
    }
    getPlayer() {
        return this;
    }
}
class Collectible {
    constructor() {
        this.x = (getRandomNumberBetween(1, 5) - 1) * TILE_WIDTH;
        this.y = getRandomNumberBetween(1, 3) * TILE_HEIGHT;
        this.sprite = "images/Gem-Blue1.png";
        this.collected = 0;
    }
    render() {
        if (this.collected < 3) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
    update() {
        if (player.getPlayer().x === this.x && player.getPlayer().y + 25 === this.y) {
            console.log("gem collision");
            this.collected++;
            if (this.collected <= 3) {
                this.x = (getRandomNumberBetween(1, 5) - 1) * TILE_WIDTH;
                this.y = getRandomNumberBetween(1, 3) * TILE_HEIGHT;
                document.querySelector(".gems").textContent = "Collected Gems: " + this.collected + "/3";
            }else {
                this.x =-100;
                this.y =-100;
            }
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const TILE_WIDTH = 101;
const TILE_HEIGHT = 83;
let player = new Player();
let allEnemies = [];
let numberOfEnemies = 3;
for (let i = 0; i < numberOfEnemies; i++) {
    allEnemies.push(new Enemy());
}
let collectible = new Collectible();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function (e) {

    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

});
document.addEventListener('keyup', function (e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

function randomEnemyPosition() {
    let x = getRandomNumberBetween(1, 3);
    if (x === 1) {
        return 58;
    } else if (x === 2) {
        return 141;
    } else {
        return 224;
    }
}


function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
}
