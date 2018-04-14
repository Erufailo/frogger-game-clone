# Frogger game Clone

    This is a frogger game clone for the needs of the Front End development Nanodegree at Udacity.
    Live Demo : A full working demo is [here](https://erufailo.github.io/frogger/).

## How the game Works

    In this game you have a Player and Enemies (Bugs). The goal of the player is to reach the water, without colliding into any one of the enemies. The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene. Once a the player collides with an enemy, the game is reset, the player moves back to the start square and loses one life. Once the player reaches the water the game is won. 
    The player can move to the water and wins the game only if he collects 3 gems, else he cannot go. If the player loses all three hearts he lose the game.

## Game mechanics

    When the game loads, an image with instructions appears explaining the rules to play the game. When the player presses spacebar the game begins. There are 4 enemies moving with random speeds from left to right preventing the player to cross. If the player collides with an enemy, loses one life and returns to starting point.If the player loses all 3 hearts, loses the game. Also in the paved area of the game there are blue gems that the player can pick by going to their square. The player needs 3 gems to be able to go to the water and win the game.

    If the player wins, a modal appears, congratulating him and showing stats about the game.
    If the player wins the modal says to try again. 

    In the modal there is a button that restarts the game or it can be done by pressing the enter key.

## Playability

The game is playable on a computer with keyboard, with a modern internet browser. 

## Future improvements

These are some ideas I want to implement in the near future.

* More enemy types
* Sound effects
* Stages
* Difficulty system

## Code Dependencies

The app has no particular code dependencies but uses:

* Modal code from <https://sabe.io/tutorials/how-to-create-modal-popup-box>