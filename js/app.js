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
        player.getPlayer().x = 202;
        player.getPlayer().y = 390;
        if (player.getPlayer().collisions >= 0) {
            const heart = document.querySelectorAll(".heart")[player.getPlayer().collisions];
            heart.removeAttribute("src");
            heart.setAttribute("src", "images/heart-empty.png");
            player.getPlayer().collisions -= 1;
            player.getPlayer().lives -= 1;
        }
    }

    if (this.x > 600) {
        this.speed = getRandomNumberBetween(3, 7);
        this.x = -150;
        this.y = randomEnemyPosition();
    }
    return dt * this.x;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function () {
    this.x = -150;
    this.y = randomEnemyPosition();
    this.speed = getRandomNumberBetween(3, 7);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 202;
        this.y = 390;
        this.collisions = 2;
        this.lives = 3;
    }

    update() {
        if (collectible.getCollectibles() >= 3) {
            if (this.y < 58) {//win condition
                setTimeout(() => {
                    this.x = 202;
                    this.y = 390;
                }, 100);
                createModal(true);
                play = false;
            }
        } else {
            if (this.y < 58) {
                this.y = 58;
            }
        }
        if (this.x > 404) {//restrain player to canvas
            this.x = 404;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.y > 390) {
            this.y = 390;
        }
        if (this.lives === 0) { // lose
            createModal(false);
            play = false;
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(key) {
        if (play === true) {
            if (key === "up") {
                this.y -= 83;
            } else if (key === "down") {
                this.y += 83;
            } else if (key === "left") {
                this.x -= 101;
            } else if (key === "right") {
                this.x += 101;
            }
        }
    }
    getPlayer() {
        return this;
    }
    reset() {
        this.x = 202;
        this.y = 390;
        this.collisions = 2;
        this.lives = 3;
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
            this.collected++;
            document.querySelector(".gems").textContent = "Collected Gems: " + this.collected + "/3";
            if (this.collected < 3) {
                this.x = (getRandomNumberBetween(1, 5) - 1) * TILE_WIDTH;
                this.y = getRandomNumberBetween(1, 3) * TILE_HEIGHT;
            } else {
                this.x = -100;
                this.y = -100;
            }
        }
    }
    getCollectibles() {
        return this.collected;
    }
    reset() {
        this.collected = 0;
        this.x = (getRandomNumberBetween(1, 5) - 1) * TILE_WIDTH;
        this.y = getRandomNumberBetween(1, 3) * TILE_HEIGHT;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const TILE_WIDTH = 101;
const TILE_HEIGHT = 83;
let firstGame = true;
let player;
let allEnemies = [];
let numberOfEnemies = 4;
let timerID;
let play = false;
let collectible;
player = new Player();
collectible = new Collectible();
for (let i = 0; i < numberOfEnemies; i++) {
    allEnemies.push(new Enemy());
}


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
    if (e.keyCode === 32 && play === false && firstGame) {
        startGame();
        firstGame = false;
    }
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

let s = 0; //seconds
let m = 0; //minutes
function timer() {
    ++s;
    m = Math.floor(s / 60);
    let timer = document.querySelector(".timer");
    if (s % 60 < 10) {// checks if a second is one or two digits
        timer.textContent = "Elapsed Time: " + m + ":0" + s % 60;
    } else {
        timer.textContent = "Elapsed Time: " + m + ":" + s % 60;
    }

}

function createModal(win) {
    const heading = document.querySelector(".modal-heading");
    const stats = document.querySelector(".stats");
    if (win) {
        heading.textContent = "Congratulations! You Won!!"
    } else {
        heading.textContent = "You lost! Better luck next time!"
    }
    toggleModal();
    clearInterval(timerID);
}

//Modal code from https://sabe.io/tutorials/how-to-create-modal-popup-box
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

function startGame() {
    play = true;
    timerID = setInterval(timer, 1000);
    document.querySelector(".instructions").classList.add("invisible");
}

