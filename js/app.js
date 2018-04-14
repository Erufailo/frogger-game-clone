/********************* CLASSES ******************************/

// Enemy class
var Enemy = function () {
    // Variables applied to each of our instances go here
    this.sprite = 'images/enemy-bug.png';
    this.x = -150; //initial position left of canvas
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
    //if the player is in a range from the enemy
    if (player.getPlayer().x >= this.x - 30 && player.getPlayer().x < this.x + 30 && player.getPlayer().y === this.y) {
        player.getPlayer().x = 202;//reset the player's position
        player.getPlayer().y = 390;
        if (player.getPlayer().lives - 1 >= 0) { // the minus one is there because array range is 0-2 for 3 lives 
            const heart = document.querySelectorAll(".heart")[player.getPlayer().lives - 1];//remove the most right full heart
            heart.removeAttribute("src");
            heart.setAttribute("src", "images/heart-empty.png"); //load the image of the empty heart
            player.getPlayer().lives -= 1;
        }
    }
    //when the enemy goes to the right of the canvas reset his position
    //and get a new random speed
    if (this.x > 600) {
        this.speed = getRandomNumberBetween(3, 7);
        this.x = -150;
        this.y = randomEnemyPosition();
    }
    return dt * this.x;//apply the movement
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//reset the enemy
Enemy.prototype.reset = function () {
    this.x = -150;
    this.y = randomEnemyPosition();
    this.speed = getRandomNumberBetween(3, 7);
};

// Player Class. Written in ES6 for practice
class Player {
    //initialize the player object
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 202;
        this.y = 390;
        this.lives = 3;
    }

    update() {
        //restrain player to canvas
        if (this.x > 404) {
            this.x = 404;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.y > 390) {
            this.y = 390;
        }

        //win condition
        if (collectible.getCollectibles() >= 3) {//if all 3 gems are picked
            if (this.y < 58) {//and player is in the water
                setTimeout(() => {//reset the sprite to starting point 
                    this.x = 202;//with some delay so the player can see it 
                    this.y = 390;
                }, 100);
                createModal(true);//create modal with win condition
                play = false;//game state false
            }
        } else {//if the player has not collected all the gems
            if (this.y < 58) {//don't let him go in the water
                this.y = 58;
            }
        }
        // lose condition
        if (this.lives === 0) {
            createModal(false);//create modal with lose condition
            play = false;
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    //move the player in the canvas
    handleInput(key) {
        if (play === true) {//only if game state is true
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
    getLives() {
        return this.lives;
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
        //if gems are collected don't render them
        if (this.collected < 3) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
    update() {
        //if the player collides with gem
        if (player.getPlayer().x === this.x && player.getPlayer().y + 25 === this.y) {
            this.collected++;
            //show the collected in html
            document.querySelector(".gems").textContent = "Collected Gems: " + this.collected + "/3";
            //if the picked gems are under 3 give them a new random place in canvas
            if (this.collected < 3) {
                this.x = (getRandomNumberBetween(1, 5) - 1) * TILE_WIDTH;
                this.y = getRandomNumberBetween(1, 3) * TILE_HEIGHT;
            } else {//when collected go off-screen
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
/****************** END OF CLASSES **********************/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const TILE_WIDTH = 101;
const TILE_HEIGHT = 83;
let firstGame = true;
let play = false;
let timerID;
let allEnemies = [];
let numberOfEnemies = 4;
let player = new Player();
let collectible = new Collectible();
for (let i = 0; i < numberOfEnemies; i++) {
    allEnemies.push(new Enemy());
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //if this is first game and spacebar is pressed
    if (e.keyCode === 32 && play === false && firstGame) {
        startGame();
        firstGame = false;
    }
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
document.addEventListener('keydown', function (e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault(); //prevent the page from scrolling
    }
});

/*
 * Return a random enemy position between the 3 paths
 */
function randomEnemyPosition() {
    let x = getRandomNumberBetween(1, 3);
    if (x === 1) {
        return 58;//1st path
    } else if (x === 2) {
        return 141;//2nd path
    } else {
        return 224;//3rd path
    }
}

//returns a random number between min and max
function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
}
//Timer
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

//Modal content
function createModal(win) {
    const heading = document.querySelector(".modal-heading");
    const stats = document.querySelector(".stats");
    const info = document.querySelector(".info");
    if (win) {
        heading.textContent = "Congratulations! You Won!!"
        if (s % 60 < 10) {
            stats.textContent = "You won with " + player.getLives() + " lives! Time: " + m + ":0" + s % 60;
        } else {
            stats.textContent = "You won with " + player.getLives() + " lives! Time: " + m + ":" + s % 60;
        }

    } else {
        heading.textContent = "You lost! Better luck next time!"
    }
    info.textContent = "Press Enter To Play Again!";
    toggleModal();
    clearInterval(timerID); //stop the timer
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

//start the game state, the timer and remove the instruction image
function startGame() {
    play = true;
    timerID = setInterval(timer, 1000);
    document.querySelector(".instructions").classList.add("invisible");
}

