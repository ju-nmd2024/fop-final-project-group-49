class DoodleGuy {
  constructor() {
    this.x = 200;
    this.y = 500;
    this.height = 40;
    this.width = 60;
  }
}

let doodleguy;

function setup() {
  createCanvas(400, 600);
  doodleguy = new DoodleGuy();
}

function draw() {
  background(0);

  //Draw doodleguy
  rect(doodleguy.x, doodleguy.y, doodleguy.height, doodleguy.width);
}
