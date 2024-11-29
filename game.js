let doodleguy;
let platforms = [];
let score = 0;
let platformSpaceFactor = 1.3;

class DoodleGuy {
  constructor() {
    this.x = 200;
    this.y = 500;
    this.height = 60;
    this.width = 40;

    this.velocity = 0;
    this.gravity = 0.5;

    this.jumpheight = 15;
  }
  //Handles movement of the doodleguy character
  doodleMovement() {
    //Creates a falling effect on doodleguy
    this.velocity += this.gravity;
    this.y += this.velocity;

    this.platformCollision();

    //D key moves right
    if (keyIsDown(68)) {
      this.x += 5;
    }
    //A key moves left
    if (keyIsDown(65)) {
      this.x -= 5;
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
        this.y = platform.y - this.height;
        //Stop velocity
        this.velocity = 0;
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

  //adds platforms
  let maxPlatforms = 5;
  let platSpace = height / maxPlatforms;

  platforms.push(new Platform(doodleguy.x, doodleguy.y + 60));

  for (let i = 1; i <= maxPlatforms; i++) {
    let x = random(width);
    let y = (i * platSpace) / platformSpaceFactor;

    platforms.push(new Platform(x, y));
  }
}

let gameState = 0;

function draw() {
  background(0);
  if (gameState === 1) {
    //Draw doodleguy
    doodleguy.doodleDraw();
    doodleguy.doodleMovement();
    scoreKeeping();

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
  // Check if the mouse is within the rectangle boundaries
  if (
    mouseX >= canvasX / 2 - 100 &&
    mouseX <= canvasX / 2 + 100 &&
    mouseY >= canvasY / 2 - 50 &&
    mouseY <= canvasY / 2 + 50
  ) {
    gameState = 1; // Start the game
  }
}

function scoreKeeping() {
  fill(255, 255, 255);
  textAlign(CENTER, CENTER); //Center align button text
  textSize(24); //Set the text size
  text(score, canvasX / 2, canvasY / 15);
}
