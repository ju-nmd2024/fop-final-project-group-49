class DoodleGuy {
  constructor() {
    this.x = 200;
    this.y = 500;
    this.height = 60;
    this.width = 40;

    this.velocity = 0;
    this.gravity = 0.5;

    this.jumpheight = 15;

    this.bottomScreen = 500;
  }

  //Handles movement of the doodleguy character
  doodleMovement() {
    //Creates a falling effect on doodleguy
    this.velocity += this.gravity;
    this.y += this.velocity;
    //auto jump at the bottom of screen'
    //note: change this when adding platform collision
    if (this.y >= this.bottomScreen) {
      this.y = this.bottomScreen;
      this.doodleJump();
    }

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
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.height = 15;
    this.width = 60;
  }

  platformDraw() {
    push();
    fill(100, 255, 100);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

let doodleguy;
let platforms = [];

function setup() {
  canvasX = 400;
  canvasY = 600;

  createCanvas(canvasX, canvasY);

  doodleguy = new DoodleGuy();

  //adds platforms
  let maxPlatforms = 4;
  let platSpace = height / maxPlatforms;

  for (let i = 1; i <= maxPlatforms; i++) {
    let x = random(200);
    let y = (i * platSpace) / 1.3;
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
  push();
  rectMode(CENTER);
  fill(255);
  rect(canvasX / 2, canvasY / 2, 200, 100);
  pop();

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
  let score = 0;

  fill(255, 255, 255);
  textAlign(CENTER, CENTER); //Center align button text
  textSize(24); //Set the text size
  text(score, canvasX / 2, canvasY / 15);
}
