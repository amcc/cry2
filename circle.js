function Circle(x, y, radius, options, circleSides = 30) {
  // options for a body

  this.body = Bodies.circle(x, y, radius, options, circleSides);
  this.radius = radius;
  this.hue = options.hue;
  // add the body to the world
  World.add(world, this.body)

  // draw the body to the canvas
  // using p5 and rotate, translate it
  // to the right position/angle
  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    noStroke();
    fill(this.hue, 100, 100);
    ellipse(0, 0, this.radius*2,this.radius*2, circleSides)
    pop()
  }
}