//Initialise global variables
let doodleguy;
let platforms = [];
let score = 0;
let gameState = 0;
let backgroundColour = "rgb(0,181,226)";

//Resets score, doodle guys position, platforms and sets game state to load the game.
function startGame() {
  score = 0;
  platforms = [];
  doodleguy = new DoodleGuy();
  //create first platform from where doodleguy starts
  platforms.push(new Platform(doodleguy.x, doodleguy.y + 60));
  gameState = 1;
}

//doodle guy class
//defines his size, dimensions and movement variables
class DoodleGuy {
  constructor() {
    this.x = 200;
    this.y = 350;
    this.height = 60;
    this.width = 40;

    this.velocity = 0;
    this.gravity = 0.6;

    this.jumpheight = 17;

    //sets the last platform as null to not increment score on collision
    this.lastPlatform = null;
  }

  // Handles movement of the doodleguy character
  doodleMovement() {
    //Creates a falling effect on doodleguy
    this.velocity += this.gravity;
    this.y += this.velocity;

    //Switches his position on the screen when he crossed over to and end of eitherside
    //gives the illusion of having moved like pacman
    if (this.x + this.width < 0) this.x = width;
    if (this.x > width) this.x = -this.width;

    this.platformCollision();

    //D key moves right
    if (keyIsDown(68)) {
      this.x += 8;
    }
    //A key moves left
    if (keyIsDown(65)) {
      this.x -= 8;
    }
    //less than screen height then doodleguy fell
    if (this.y > height) {
      gameState = 2; //Game over state
    }
  }

  doodleJump() {
    //apply upward velocity
    this.velocity -= this.jumpheight;
  }
  //draws doodleguy
  doodleDraw() {
    push();
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  platformCollision() {
    let spaceCalc = this.height - 30;
    for (let platform of platforms) {
      //Check if doodleguy is in platform bouinds
      if (
        //checks bottom of doodle guy is above or equal to height of the top part platform
        this.y + this.height <= platform.y + platform.height &&
        //checks bottom of doodle guy after velcoity + grav is applied is below or same level as platform
        this.y + this.height + this.velocity >= platform.y &&
        //checks doodle guy is aligned horizontally with platform for his right edge
        this.x + this.width > platform.x &&
        //left edge
        this.x < platform.x + platform.width
      ) {
        //if the platform is breakable and not broken then break it
        if (platform.type === "breakable" && !platform.isBroken) {
          platform.breakPlatform(); // Break the platform
        }
        //platform not breakable
        else if (platform.type !== "breakable") {
          //Put dodleguty on the top of the paltform
          this.y = platform.y - spaceCalc;
          //Stop velocity
          this.velocity = 0;

          //increments the score for landing on new platform
          if (this.lastPlatform !== platform) {
            score += 1;
            this.lastPlatform = platform;
          }
          this.doodleJump();
        }
      }
    }
  }
}

class Platform {
  constructor(x, y, type = "static") {
    this.x = x;
    this.y = y;

    this.height = 15;
    this.width = 60;
    this.type = type;

    //Moving Platform
    if (this.type === "moving") {
      //direction is randomised between -1, left or 1 right
      //if rand num is less than .5 move platform left
      if (random() < 0.5) {
        this.direction = -1;
        //else ran num is greater than .5 move ti right
      } else {
        this.direction = 1;
      }
      //speed random between 1 and 3
      this.speed = random(1, 3);
    }

    //Breakable Platform
    if (this.type === "breakable") {
      //initally platform is set as not broken
      this.isBroken = false;
    }
  }

  platformDraw() {
    //if platform is break and is broken don't draw it
    if (this.type === "breakable" && this.isBroken) {
      return;
    }

    if (this.type === "moving") {
      fill(100, 100, 255); //Blue
    } else if (this.type === "breakable") {
      fill(100, 65, 23); //Brown
    } else {
      fill(100, 255, 100); //Green
    }

    rect(this.x, this.y, this.width, this.height);
  }

  platformUpdate() {
    //platform type of moving
    if (this.type === "moving") {
      //updates platforms horizontal position by adding direction * speed
      this.x += this.direction * this.speed;
      //checks if platform has hit the edges of screen then reverse direction
      if (this.x <= 0 || this.x + this.width >= width) {
        this.direction *= -1;
      }
    }
  }

  //function to break platofrm
  breakPlatform() {
    if (this.type === "breakable") {
      this.isBroken = true;
    }
  }
}

function setup() {
  canvasX = 400;
  canvasY = 600;

  createCanvas(canvasX, canvasY);
}
//draw function
function draw() {
  background(backgroundColour);
  if (gameState === 1) {
    //play game state
    //Draw doodleguy
    doodleguy.doodleDraw();
    doodleguy.doodleMovement();
    scoreKeeping();
    scrollUp();

    for (let platform of platforms) {
      //update and draw platforms
      platform.platformUpdate();
      platform.platformDraw();
    }
  } else if (gameState === 2) {
    //game over sate
    gameOver();
  } else {
    //start screen
    drawButton();
  }
}

function scrollUp() {
  //Check if doodleguy moves above screen midpoint
  if (doodleguy.y < height / 2) {
    //the scroll increment
    let scrollHeight = height / 2 - doodleguy.y;
    //Centers doodleguy
    doodleguy.y = height / 2;
    //Adjust the platforms to move them down
    for (let platform of platforms) {
      platform.y += scrollHeight;
    }
  }

  //Remove platforms as they go off the screen
  for (let i = platforms.length - 1; i >= 0; i--) {
    //if selected platform is less than the height of the screen + 10 remove it and replace it
    if (platforms[i].y > height + 10) {
      platforms.splice(i, 1);
    }
  }

  //Get y position of all platforms, min to return smallest value, map creates array of the y positions
  //Min ensures the platform appears above the previous
  let prevPlatformY = Math.min(...platforms.map((platform) => platform.y));

  //while less than 20 platforms in platforms array
  while (platforms.length < 20) {
    let x = random(width); //Random X position within canvas
    let y = prevPlatformY - random(50, 70); //Platforms spaced randomly between 100 and 200 units vertically

    //Randomly decide how many platforms to place on the same Y level
    let numPlatforms;
    //if rand num less than .2 there will be 3 platforms on the same y level
    if (random() < 0.2) {
      numPlatforms = 3;
      //else rand num is greather than .2 there will be one
    } else {
      numPlatforms = 1;
    }
    //place platforms at random x based on how many platforms from numPlatforms
    for (let i = 0; i < numPlatforms; i++) {
      //force platforms to stay in canvas
      let platformX = random(0, width - 60);

      let platformType;
      //assigns platform types
      //if generated rand num is less than 0.7 if it is static platform
      if (random() < 0.7) {
        platformType = "static";
      } else {
        //if it's greater than .7 but less than .8 then its moving
        if (random() < 0.8) {
          platformType = "moving";
          //else greater than .8 it's breakable
        } else {
          platformType = "breakable";
        }
      }
      //add the new platform to the platforms array
      platforms.push(new Platform(platformX, y, platformType));
    }
    //used to position next platforms
    prevPlatformY = y;
  }
}

function drawButton() {
  rectMode(CENTER);
  fill(255);
  rect(canvasX / 2, canvasY / 2, 200, 100);

  fill(0);
  textAlign(CENTER, CENTER); //Center align button text
  textSize(24); //Set the text size
  text("START", canvasX / 2, canvasY / 2); //Position the text at the button center
}

//game over screen button and text
function gameOver() {
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You Fell!", width / 2, height / 2 - 50);

  textSize(24);
  text("Final Score: " + score, width / 2, height / 2);

  textSize(24);
  text("RESTART", canvasX / 2, canvasY / 2 + 100);
  fill(255);
}

//scorekeeping draw
function scoreKeeping() {
  fill(255, 255, 255);
  textAlign(CENTER, CENTER); //Center align button text
  textSize(24); //Set the text size
  text(score, canvasX / 2, canvasY / 15);
}

function mousePressed() {
  //if the game state is un started load the start screen boundaries
  if (gameState === 0) {
    //Check if the mouse is within the rectangle boundaries
    if (
      mouseX >= canvasX / 2 - 100 &&
      mouseX <= canvasX / 2 + 100 &&
      mouseY >= canvasY / 2 - 50 &&
      mouseY <= canvasY / 2 + 50
    ) {
      startGame();
    }
  }
  //if the game is in game over state then load the respawn boundaries
  if (gameState === 2) {
    if (
      mouseX >= width / 2 - 100 &&
      mouseX <= width / 2 + 100 &&
      mouseY >= height / 2 + 50 &&
      mouseY <= height / 2 + 150
    ) {
      startGame();
    }
  }
}
