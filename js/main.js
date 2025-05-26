/**
 * Main script.
 * @author Alex Etienne.
 */

"use strict";

//#region Constants

// Get the canvas
const CANVAS = document.querySelector("canvas");
const CTX = CANVAS.getContext("2d");

// Set the size of the canvas
CANVAS.width = 800;
CANVAS.height = 800;

// Game
const GROUND = 700;
const GRAVITY_FORCE = 0.05;
const NBR_WALLS = 3;
const CAMERA_X = 300;

// Player
const SPEED = 1;
const PLAYER_SIZE = 30;
const JUMP_FORCE = -3;

// Walls
const MIN_WALL_HEIGHT = 30;
const SPACES_HEIGHT = 200;
const WALLS_START_X = 500;
const WALLS_GAP = 500;
const WALLS_WIDTH = 200;

//#endregion

//#region Classes

class bird {
    //nn = new NeuralNetwork([4, 5, 10, 5, 1]);
    x = 0;
    y = 0;
    yVelocity = 0;
    dead = false;
}

//#endregion

//#region Variables

// Player
let player = new bird();
let inputJump = false;

// Walls
let spaces = [[WALLS_START_X, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]]; // [0] : X Coordinate, [1] : Y Coordinate
for (let i = 1; i < NBR_WALLS; i++) {
    spaces.push([spaces[i - 1][0] + WALLS_GAP, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]);
}

//#endregion

// Game loop
setInterval(() => {
    // Move the player
    if (!player.dead) {
        // Gravity
        if (!inputJump) {
            player.yVelocity += GRAVITY_FORCE;
        } else {
            player.yVelocity = JUMP_FORCE;
        }

        player.y += player.yVelocity;

        // Move the player
        player.x += SPEED;

        // Kill the player
        if (player.y + PLAYER_SIZE >= GROUND) {
            player.dead = true;
        }

        // Check if the player is in a wall
        for (let space of spaces) {
            console.log(player.x + PLAYER_SIZE >= space[0] && player.x <= space[0] + WALLS_WIDTH)
            if (player.x + PLAYER_SIZE >= space[0] && player.x <= space[0] + WALLS_WIDTH &&
            player.y <= space[1] && player.y + PLAYER_SIZE >= space[1] + SPACES_HEIGHT) {
                player.dead = true;
                break;
            }
        }
    }

    // Updates the walls
    if (spaces[0][0] - player.x < -CANVAS.width / 2 - WALLS_WIDTH / 2) {
        spaces.splice(0, 1);
        spaces.push([spaces[spaces.length - 1][0] + WALLS_GAP, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]);
    }

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw the walls
    CTX.fillStyle = 'green';
    for (let space of spaces) {
        CTX.fillRect(space[0] - player.x + CAMERA_X, 0, WALLS_WIDTH, space[1]);
        CTX.fillRect(space[0] - player.x + CAMERA_X, space[1] + SPACES_HEIGHT, WALLS_WIDTH, GROUND - space[1] - SPACES_HEIGHT);
    }

    // Draw the player
    CTX.fillStyle = 'red';
    CTX.fillRect(CAMERA_X, player.y, PLAYER_SIZE, PLAYER_SIZE);

    // Draw the ground
    CTX.fillStyle = 'brown';
    CTX.fillRect(0, GROUND, CANVAS.width, CANVAS.height - GROUND);

    // Inputs reset
    inputJump = false;
});

// Inputs
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        inputJump = true;
    }
})
