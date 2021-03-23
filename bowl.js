let ground;
let leftWall;
let rightWall;
let bowlX;
let bowlY;
let bowlWidth;
let bowlHeight;
let wallWidth;
let wallHeight;

function Bowl(x, y, rot = 0) {
  
  xbowlX = 0;
  xbowlY = 0;
  xbowlWidth = 200;
  xbowlHeight = 10;
  xwallWidth = 10;
  xwallHeight = 60;
  
  
  // options for a body
  var options = {
    friction: 0.3,
    restitution: 1,
  }

  let matterOptions = {
    isStatic: true
  }
  this.ground = Bodies.rectangle(bowlX, bowlY, bowlWidth, bowlHeight, matterOptions);
  this.leftWall = Bodies.rectangle(bowlX - bowlWidth / 2, bowlY - wallHeight / 2 + wallWidth / 2, wallWidth, wallHeight, matterOptions);
  this.rightWall = Bodies.rectangle(bowlX + bowlWidth / 2, bowlY - wallHeight / 2 + wallWidth / 2, wallWidth, wallHeight, matterOptions);


  // add the ground to the world
  World.add(world, [this.ground, this.leftWall, this.rightWall])

  this.w = bowlWidth;
  this.h = bowlHeight;
  this.angle = rot;
  // add the body to the world

  // draw the body to the canvas
  // using p5 and rotate, translate it
  // to the right position/angle
  this.show = function() {
    var pos = this.ground.position;
    console.log(this.ground)
    console.log(pos)
    var angle = this.angle;
    push();
    translate(pos.x, pos.y);
                          
    var angle = this.angle;
    push();
    // translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(255, 100, 100);

    noStroke();
    // rect(pos.x, pos.y, bowlWidth, bowlHeight)
    // rect(pos.x - bowlWidth / 2, pos.y - wallHeight / 2 + wallWidth / 2, wallWidth, wallHeight)
    // rect(pos.x + bowlWidth / 2, pos.y - wallHeight / 2 + wallWidth / 2, wallWidth, wallHeight)

    pop()
  }
}