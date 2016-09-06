// initial game settings and variables
var rowOptions = [1, 2, 3];
var startingSideOptions = ['l', 'r'];
var speedOptions = [1, 2, 3, 4, 5];
var enemyStyleOptions = [0, 1, 2, 3];
var enemyPictureUrlList = ['images/enemy1.png',
    'images/enemy2.png', 'images/enemy3.png', 'images/enemy4.png'
];
var score = 0;
var lives = 3;
// array to hold all Enemy instances generated during game
var allEnemies = [];

// function used in generating enemies see: generateEnemy
var randomFromArray = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

// Enemies our player must avoid
// initiate enemy by designating a style(1-4)
//row(0-2), side ('l','r'), speed(1-5)
var Enemy = function(enemyStyle, row, startingSide, speed) {
    if (startingSide === 'l') {
        this.x = -50;
        this.direction = 'r'; // direction enemy will move
    } else {
        this.x = canvas.width;
        this.direction = 'l';
    }
    this.y = row * 85 + 55;

    this.speed = speed * 100;

    this.sprite = enemyPictureUrlList[enemyStyle];
};
// change in x coordinate, dependent on direction of movement
Enemy.prototype.update = function(dt) {
    if (this.direction === 'r') {
        this.x += this.speed * dt;
        if (this.x > canvas.width) {
            this.x = -50;
        }
    } else {
        this.x -= this.speed * dt;
        if (this.x < 0) {
            this.x = canvas.width;
        }
    }
    //check for a collision once updated:
    var collisionRadius = 50;
    var enemy = this;
    var dx = Math.abs(enemy.x - player.x);
    var dy = Math.abs(enemy.y - player.y);
    if (dx < collisionRadius && dy < collisionRadius) {
        player.init();
        lowerLives();
    }
};
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// generate an enemy with randomly generated settings.
var generateEnemy = function() {
    var enemyStyle = randomFromArray(enemyStyleOptions);
    var row = randomFromArray(rowOptions);
    var startingSide = randomFromArray(startingSideOptions);
    var speed = randomFromArray(speedOptions);

    var enemy = new Enemy(enemyStyle, row, startingSide, speed);

    allEnemies.push(enemy);
};
//generate the first enemy.
generateEnemy();


var Player = function() {
    this.init();
    this.sprite = 'images/mario.png';
};

Player.prototype.render = Enemy.prototype.render;
Player.prototype.update = function() {
    if (this.y < 100) { // reached river
        this.init();
        generateEnemy(); // to make game tougher
        raiseScore();
    }
};
// response to clicking arrows + setting bounds for character movement.
Player.prototype.handleInput = function(direction) {
    if (direction === 'left') {
        this.x -= 50;
        if (this.x < 0) {
            this.x = 0;
        }
    } else if (direction === 'right') {
        this.x += 50;
        if (this.x > 455) {
            this.x = 455;
        }
    } else if (direction === 'up') {
        this.y -= 50;
        if (this.y < 0) {
            this.y = 0;
        }
    } else if (direction === 'down') {
        this.y += 50;
        if (this.y > 500) {
            this.y = 500;
        }
    }
};
Player.prototype.init = function() {
    this.y = canvas.height - 140;
    this.x = canvas.width / 2 - 25;
};

var player = new Player();


var updateLivesAndScore = function() {
    $('#score').text("score:" + score + "    Lives:" + lives);
};
updateLivesAndScore();

var restartGame = function() {
    score = 0;
    lives = 3;
    updateLivesAndScore();
    player.sprite = 'images/mario.png';
    player.init();
    allEnemies = [];
    generateEnemy();
};

// when mario reaches the river:
var raiseScore = function() {
    score += 100;
    updateLivesAndScore();
    if (score === 200) {
        player.sprite = 'images/luigi.png';
    }
    if (score === 400) {
        player.sprite = 'images/mario yoshi.png';
    }
};

// the result of a collision with an enemy:
var lowerLives = function() {
    lives -= 1;
    updateLivesAndScore();
    if (lives === 0) {
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        restartGame();
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(event) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[event.keyCode]);
});

// prevents scrolling with the arrow keys while playing.
window.addEventListener("keydown", function(e) {
    // arrow keys
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
