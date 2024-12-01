let doodleguy;
let platforms = [];
let score = 0;

class DoodleGuy {
  constructor() {
    this.x = 200;
    this.y = 350;
    this.height = 60;
    this.width = 40;

    this.velocity = 0;
    this.gravity = 0.6;

    this.jumpheight = 17;

    //sets the last platform as null to not increment score
    this.lastPlatform = null;
  }
  //Handles movement of the doodleguy character
  doodleMovement() {
    //Creates a falling effect on doodleguy
    this.velocity += this.gravity;
    this.y += this.velocity;

    this.platformCollision();

    //D key moves right
    if (keyIsDown(68)) {
      this.x += 8;
    }
    //A key moves left
    if (keyIsDown(65)) {
      this.x -= 8;
    }
  }

  doodleJump() {
    this.velocity -= this.jumpheight;
  }
  doodleDraw() {
    push();
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  platformCollision() {
    let spaceCalc = this.height - 30;
    //note: review readability
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
        //Put dodleguty on the top of the paltform
        this.y = platform.y - spaceCalc;
        //Stop velocity
        this.velocity = 0;

        //if its not the last landed on platform then
        if (this.lastPlatform !== platform) {
          score += 1; //Increment score by one
          this.lastPlatform = platform; //set the last platform again
        }

        this.doodleJump();
      }
    }
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.height = 15;
    this.width = 60;
  }

  platformDraw() {
    fill(100, 255, 100);
    rect(this.x, this.y, this.width, this.height);
  }
}

function setup() {
  canvasX = 400;
  canvasY = 600;

  createCanvas(canvasX, canvasY);

  doodleguy = new DoodleGuy();
  //First platform
  platforms.push(new Platform(doodleguy.x, doodleguy.y + 60));
}

let gameState = 0;

function draw() {
  background(0);
  if (gameState === 1) {
    //Draw doodleguy
    doodleguy.doodleDraw();
    doodleguy.doodleMovement();
    scoreKeeping();
    scrollUp();

    for (let platform of platforms) {
      //draw platforms
      platform.platformDraw();
    }
  } else {
    drawButton();
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

function mousePressed() {
  //Check if the mouse is within the rectangle boundaries
  if (
    mouseX >= canvasX / 2 - 100 &&
    mouseX <= canvasX / 2 + 100 &&
    mouseY >= canvasY / 2 - 50 &&
    mouseY <= canvasY / 2 + 50
  ) {
    gameState = 1; //Start the game
  }
}

function scoreKeeping() {
  fill(255, 255, 255);
  textAlign(CENTER, CENTER); //Center align button text
  textSize(24); //Set the text size
  text(score, canvasX / 2, canvasY / 15);
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
    if (platforms[i].y > height + 10) {
      platforms.splice(i, 1);
    }
  }
  //Get y position of all platforms, min to return smallest value, map creates array of the y positions
  //Min ensures the platform appears above the previous
  let prevPlatformY = Math.min(...platforms.map((platform) => platform.y));

  while (platforms.length < 10) {
    let x = random(width); //Random X position within canvas
    let y = prevPlatformY - random(50, 150); //Platforms spaced randomly between 100 and 200 units vertically

    platforms.push(new Platform(x, y));

    prevPlatformY = y;
  }
}

