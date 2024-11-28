class DoodleGuy {
  constructor() {
    this.x = 200;
    this.y = 500;
    this.height = 40;
    this.width = 60;

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
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.height = 15;
    this.width = 60;
  }
}

let doodleguy;
let platforms = [];

function setup() {
  createCanvas(400, 600);
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

function draw() {
  background(0);

  //Draw doodleguy
  rect(doodleguy.x, doodleguy.y, doodleguy.height, doodleguy.width);

  doodleguy.doodleMovement();

  for (let platform of platforms) {
    //draw platforms
    push();
    fill(100, 255, 100);
    rect(platform.x, platform.y, platform.width, platform.height);
    pop();
  }
}
