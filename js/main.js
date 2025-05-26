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
const WALLS_GAP = 400;
const WALLS_WIDTH = 200;

// IA
const NBR_BIRDS = 4000;
const KEEP_COUNT = 20;
const REUSE_TIME = 20;

//#endregion

//#region Classes

class bird {
    nn = new NeuralNetwork([1, 1, 1]);
    x = 0;
    y = 0;
    yVelocity = 0;
    dead = false;
}

//#endregion

//#region Variables

// Player
let players = [];
for (let i = 0; i < NBR_BIRDS; i++) {
    players.push(new bird());
}

// Walls
let spaces = [[WALLS_START_X, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]]; // [0] : X Coordinate, [1] : Y Coordinate
for (let i = 1; i < NBR_WALLS; i++) {
    spaces.push([spaces[i - 1][0] + WALLS_GAP, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]);
}

// IA
let epoch = 0;

//#endregion

// Game loop
setInterval(() => {
    let deadCount = 0;
    for (let player of players) {
        // Move the player
        if (!player.dead) {
            // Get the next wall
            let nextWallIndex = 0;
            while (spaces[nextWallIndex][0] + WALLS_WIDTH < player.x) {
                nextWallIndex++;
            }

            // Gravity
            if (!Math.round(player.nn.out([spaces[nextWallIndex][1] - player.y]) % 2)) {
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
                if (player.x + PLAYER_SIZE >= space[0] && player.x <= space[0] + WALLS_WIDTH &&
                    (player.y <= space[1] || player.y + PLAYER_SIZE >= space[1] + SPACES_HEIGHT)) {
                    player.dead = true;
                    break;
                }
            }
        } else {
            deadCount++;
        }

        // Updates the walls
        if (spaces[0][0] - player.x < -CANVAS.width / 2 - WALLS_WIDTH / 2) {
            spaces.splice(0, 1);
            spaces.push([spaces[spaces.length - 1][0] + WALLS_GAP, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]);
        }
    }

    // Sort the player
    players.sort((a, b) => b.x - a.x);

    // End the epoch
    if (deadCount === players.length) {
        epoch++;

        // Keep the bests
        players.splice(KEEP_COUNT, deadCount - KEEP_COUNT);

        // Reset the players
        for (let player of players) {
            player.x = 0;
            player.y = 0;
            player.dead = false;
        }

        // Copy and mutate them
        let playersBest = [];
        for (let i = 0; i < REUSE_TIME; i++) {
            for (let player of players) {
                playersBest.push(new bird());
                playersBest[playersBest.length - 1].nn = player.nn.clone();
            }
        }

        for (let player of playersBest) {
            player.nn.mutate(0.1);
        }

        // Create the final array
        players.concat(playersBest);

        // Add the last players
        while (players.length < NBR_BIRDS) {
            players.push(new bird());
        }

        // Recreate the walls
        spaces = [[WALLS_START_X, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]]; // [0] : X Coordinate, [1] : Y Coordinate
        for (let i = 1; i < NBR_WALLS; i++) {
            spaces.push([spaces[i - 1][0] + WALLS_GAP, Math.floor(Math.random() * (GROUND - SPACES_HEIGHT - MIN_WALL_HEIGHT * 2) + MIN_WALL_HEIGHT)]);
        }
    }

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw the walls
    CTX.fillStyle = 'green';
    for (let space of spaces) {
        CTX.fillRect(space[0] - players[0].x + CAMERA_X, 0, WALLS_WIDTH, space[1]);
        CTX.fillRect(space[0] - players[0].x + CAMERA_X, space[1] + SPACES_HEIGHT, WALLS_WIDTH, GROUND - space[1] - SPACES_HEIGHT);
    }

    // Draw the player
    CTX.fillStyle = 'red';
    for (let player of players) {
        CTX.fillRect(player.x - players[0].x + CAMERA_X, player.y, PLAYER_SIZE, PLAYER_SIZE);
    }

    // Draw the ground
    CTX.fillStyle = 'brown';
    CTX.fillRect(0, GROUND, CANVAS.width, CANVAS.height - GROUND);
});
