// Get a handle to the canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Define the background image
let backgroundImage = new Image();
backgroundImage.src = 'Background.png';



let gameOver = false;  // Add this line
let gameOverImage = new Image();  // Add this line
gameOverImage.src = 'GameOver.png';  // Add this line


// Define the life image
let lifeImage = new Image();
lifeImage.src = 'Live.png'; // Replace 'life_icon.png' with the path to your life icon image


// Define the player
let player = {
    x: 50,
    y: 400,
    width: 100,
    height: 100,
    dx: 0,  // velocity along the x axis
    dy: 0,  // velocity along the y axis
    gravity: 0.5,
    jumpForce: 10,
    jumping: false,
    sprite: new Image(),
    lives: 3,
};

// Define the enemy
let enemy = {
    x: 300,
    y: 400,
    width: 50,
    height: 50,
    dx: -2,  // velocity along the x axis
    dy: 0,  // velocity along the y axis
    gravity: 0.5,
    jumpForce: 10,
    jumping: false,
    sprite: new Image(),
    rotation: 0,  // Add this line
    dead: false,  // Add this line
};


// Load the enemy sprite
enemy.sprite.src = "Enemy.png";

// Load the player sprite
player.sprite.src = "Player.png";

// Define the platform
let platform = {
    x: 0,
    y: canvas.height - 100,
    width: canvas.width,
    height: 50,
    color: '#0c0'
};

// Function to draw the player and platform
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Display the game over image when the game is over
    if (gameOver) {
        context.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);  // Add this line
    } else{
         // Draw the background image
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Draw the lives in the top left corner
    for (let i = 0; i < player.lives; i++) {
        context.drawImage(lifeImage, 10 + i * 30, 10, 20, 20); // Adjust size and spacing as needed
    }

    context.drawImage(player.sprite, player.x, player.y, player.width, player.height);


    // Save the current transformation state
    context.save();

    // Translate to the center of the enemy sprite
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

    // Apply rotation to the enemy based on its rotation property (in radians)
    context.rotate(enemy.rotation);

    // Apply vertical flip to the enemy sprite
    context.scale(1, 1);  // This line flips the sprite vertically



     // Don't draw the enemy if it's dead
    if (!enemy.dead) {
        // Draw the enemy
        context.drawImage(enemy.sprite, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
    }
    }



    // Restore the transformation state to its original
    context.restore();

};

// Function to update the game state
function update() {

    // Update player position based on velocity
    player.x += 2*player.dx;
    player.y += 2*player.dy;


    // Check if the player is colliding with the enemy
    if (!enemy.dead && 
        player.x < enemy.x + enemy.width && 
        player.x + player.width > enemy.x && 
        player.y < enemy.y + enemy.height && 
        player.y + player.height > enemy.y) {
        // The player loses a life
        player.lives--;
        player.x = 500
        player.y = 100
}
    
    // If the player loses all lives, the game is over
    if (player.lives < 0) {
            gameOver = true;
        }


    // Check for collision with the platform
    if (player.y + player.height > platform.y) {
        player.y = platform.y - player.height;
        player.jumping = false;
    } else {
        player.dy += player.gravity;
    }

    // Check for collision with the canvas boundaries
    if (player.x < 0) {
        player.x = 0; // Prevent player from moving outside the left boundary
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width; // Prevent player from moving outside the right boundary
    }

    if (player.y < 0) {
        player.y = 0; // Prevent player from moving outside the top boundary
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height; // Prevent player from moving outside the bottom boundary
        player.jumping = false;
    }


    // Update enemy position based on velocity
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;


    // Check for collision with the canvas boundaries
    if (enemy.x < 0) {
        enemy.x = 0; // Prevent player from moving outside the left boundary
        enemy.dx = enemy.dx * -1
        enemy.rotation += Math.PI;



    } else if (enemy.x + enemy.width > canvas.width) {
        enemy.x = canvas.width - enemy.width; // Prevent enemy from moving outside the right boundary
        enemy.dx = enemy.dx * -1;
        enemy.rotation += Math.PI;

    }



    if (enemy.y < 0) {
        enemy.y = 0; // Prevent enemy from moving outside the top boundary

    } else if (enemy.y + enemy.height > canvas.height) {
        enemy.y = canvas.height - enemy.height; // Prevent enemy from moving outside the bottom boundary
        enemy.jumping = false;
    }


    // Check if the player is colliding with the enemy from above
    if (!enemy.dead && player.x == enemy.x && player.y < enemy.y)
    {
        // The enemy is dead
        enemy.dead = true;
    }
    
    draw();
};

// Function to handle keydown events
function handleKeyDown(e) {

    if (e.code === "ArrowLeft") {
        player.dx = -5; // Move left
    } else if (e.code === "ArrowRight") {
        player.dx = 5; // Move right
    } else if (e.code === "Space" && !player.jumping) {
        // Space key was pressed
        player.dy = -player.jumpForce;
        player.jumping = true;
        music.play();
    }

};


// Function to handle keyup events
function handleKeyUp(e) {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        player.dx = 0; // Stop horizontal movement
        music.play();
    }
};

// Attach the keydown event
window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

// Start the game loop
setInterval(update, 1000/60);