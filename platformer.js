// Get a handle to the canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Make the canvas adaptive to the screen size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Adjust platform position based on canvas height
    platform.y = canvas.height - 100; // Platform is always 100px from the bottom
    player.y = platform.y - player.height; // Reset player y-position
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create touch controls
const controlsDiv = document.createElement('div');
controlsDiv.id = 'controls';

const leftButton = document.createElement('button');
leftButton.id = 'leftButton';
leftButton.textContent = 'Left';

const jumpButton = document.createElement('button');
jumpButton.id = 'jumpButton';
jumpButton.textContent = 'Jump';

const rightButton = document.createElement('button');
rightButton.id = 'rightButton';
rightButton.textContent = 'Right';

controlsDiv.appendChild(leftButton);
controlsDiv.appendChild(jumpButton);
controlsDiv.appendChild(rightButton);

document.body.appendChild(controlsDiv);

// Add styles for controls
document.head.innerHTML += `
    <style>
        #controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        }
        #controls button {
            padding: 15px 30px;
            font-size: 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 80px; /* Fixed width for responsiveness */
            height: 80px; /* Fixed height for responsiveness */
        }
    </style>
`;

// Define the background image
let backgroundImage = new Image();
backgroundImage.src = 'Background.png';

let gameOver = false;
let gameOverImage = new Image();
gameOverImage.src = 'GameOver.png';

// Define the life image
let lifeImage = new Image();
lifeImage.src = 'Live.png';

// Define the platform
let platform = {
    x: 0,
    y: 0, // Temporary value
    width: 0, // Will be set dynamically
    height: 50,
    color: '#0c0'
};

// Define the player
let player = {
    x: 50,
    y: 0, // Temporary value
    width: 100,
    height: 100,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpForce: 10,
    jumping: false,
    sprite: new Image(),
    lives: 3,
};

// Define the enemy
let enemy = {
    x: 0, // Temporary value
    y: 400,
    width: 50,
    height: 50,
    dx: -2,
    dy: 0,
    gravity: 0.5,
    jumpForce: 10,
    jumping: false,
    sprite: new Image(),
    rotation: 0,
    dead: false,
};

// Load sprites
enemy.sprite.src = "Enemy.png";
player.sprite.src = "Player.png";

// Function to draw
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        context.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Draw background
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Draw lives
        for (let i = 0; i < player.lives; i++) {
            context.drawImage(lifeImage, 10 + i * 30, 10, 20, 20);
        }

        // Draw player
        context.drawImage(player.sprite, player.x, player.y, player.width, player.height);

        // Draw enemy with transformations
        context.save();
        context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        context.rotate(enemy.rotation);
        context.scale(1, -1); // Correct vertical flip
        if (!enemy.dead) {
            context.drawImage(enemy.sprite, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
        }
        context.restore();

        // Draw platform
        context.fillStyle = platform.color;
        context.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

// Update function
function update() {
    // Player movement
    player.x += 2 * player.dx;
    player.y += 2 * player.dy;

    // Player collision with enemy
    if (!enemy.dead && 
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {
        player.lives--;
        player.x = 50; // Reset position
        player.y = platform.y - player.height;
    }

    if (player.lives < 0) {
        gameOver = true;
    }

    // Player platform collision
    if (player.y + player.height > platform.y) {
        player.y = platform.y - player.height;
        player.jumping = false;
    } else {
        player.dy += player.gravity;
    }

    // Player boundary checks
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;

    // Enemy movement
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

    // Enemy boundary checks
    if (enemy.x < 0) {
        enemy.x = 0;
        enemy.dx *= -1;
        enemy.rotation += Math.PI;
    } else if (enemy.x + enemy.width > canvas.width) {
        enemy.x = canvas.width - enemy.width;
        enemy.dx *= -1;
        enemy.rotation += Math.PI;
    }

    if (enemy.y < 0) enemy.y = 0;
    if (enemy.y + enemy.height > canvas.height) {
        enemy.y = canvas.height - enemy.height;
        enemy.jumping = false;
    }

    // Player jumps on enemy
    if (!enemy.dead && 
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y &&
        player.y + player.height > enemy.y) {
        enemy.dead = true;
    }

    draw();
}

// Touch event handlers
leftButton.addEventListener('touchstart', () => {
    player.dx = -5;
});

leftButton.addEventListener('touchend', () => {
    if (player.dx === -5) player.dx = 0;
});

rightButton.addEventListener('touchstart', () => {
    player.dx = 5;
});

rightButton.addEventListener('touchend', () => {
    if (player.dx === 5) player.dx = 0;
});

jumpButton.addEventListener('touchstart', () => {
    if (!player.jumping) {
        player.dy = -player.jumpForce;
        player.jumping = true;
    }
});

// Start the game loop
setInterval(update, 1000 / 60);
