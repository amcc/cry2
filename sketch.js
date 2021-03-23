// info stuff
let closeButton;
let infoHtml;
let hideInfoHtml = false;
let camToggle;
let showVideo = false;

// set up the matter module by creating variables
let MatterEngine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create an engine
let engine;
let world;
let boxes = [];
let circles = [];

let circleX;
let circleY;
let circleRadius;
let circleSides = 100;

let eyes = [];

// posenet variables
let video;
let poseNet;
let poses = [];
let graphics;

// surface
let ground;
let leftWall;
let rightWall;

let dome;

let rightEye = [-100, -100]
let leftEye = [-100, -100]
let rightHand = [-100, -100]
let leftHand = [-100, -100]

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(20);
  pixelDensity(1);
  // create and run the matter engine
  engine = MatterEngine.create();
  world = engine.world;
  MatterEngine.run(engine);


  // add the ground for boxes to fall on to
  let matterOptions = {
    isStatic: true
  }

  circleX = width / 2;
  circleY = height * 4 / 5;
  circleRadius = height / 3;

  dome = Bodies.circle(width / 2, height * 4 / 5, height / 3, matterOptions, circleSides);

  // add the ground to the world
  World.add(world, [dome])

  // poseNet settings
  // fix for retina resolutions which scale in
  pixelDensity(1);
  graphics = createGraphics(width, height);
  graphics.clear();
  colorMode(HSB);
  graphics.colorMode(HSB);

  video = createCapture({
    audio: false,
    video: {
      facingMode: "user",
      frameRate: 10
    }
  });
  video.size(width, height);
  video.hide()

  // Create a new poseNet method with a single detection
  let poseOptions = {
    maxPoseDetections: 5,
  }
  poseNet = ml5.poseNet(video, modelReady, poseOptions);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    // console.log(poses);
  });

  video.addClass('video')
  video.addClass('hide');
  infoHtml = select('#info-inner');
  closeButton = select('#close');
  camToggle = select('#cam-toggle');
  console.log(video.width)
}

function modelReady() {
  select('#status').html("Cry");
}

function draw() {
  clear();

  // draw image
  if (showVideo) image(video, 0, 0, width, height);

  //poseNet drawing

  drawBalls();
  image(graphics, 0, 0);

  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
  }

  stroke(255)
  strokeWeight(10)
  noFill()
  let rightCircleYPos = (circleY - circleRadius) + (circleRadius - sqrt(sq(circleRadius) - sq(abs((rightEye[0])-width/2))));
  let leftCircleYPos = (circleY - circleRadius) + (circleRadius - sqrt(sq(circleRadius) - sq(abs((leftEye[0])-width/2))));
  let rightEyeY = rightEye[1] > rightCircleYPos ? rightCircleYPos : rightEye[1]
  let leftEyeY = leftEye[1] > leftCircleYPos ? leftCircleYPos : leftEye[1]

  circle(rightEye[0], rightEyeY, 50)
  circle(leftEye[0], leftEyeY, 50)

}

// A function to draw ellipses over the detected keypoints
function drawBalls() {
  // Loop through all the poses detected
  // for (let i = 0; i < poses.length; i++) {
  // For each pose detected, loop through all the keypoints
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let leftEyePoint = pose.keypoints.find(keypoint => keypoint.part === 'leftEye');
      let rightEyePoint = pose.keypoints.find(keypoint => keypoint.part === 'rightEye');
      // measure distance between eyes
      let d = int(dist(leftEyePoint.position.x, leftEyePoint.position.y, rightEyePoint.position.x, rightEyePoint.position.y));

      let rightWrist = pose.keypoints.find(keypoint => keypoint.part === 'rightWrist');
      let leftWrist = pose.keypoints.find(keypoint => keypoint.part === 'leftWrist');

      let keypoint = pose.keypoints[j];

      if (keypoint.part === "leftEye") leftEye = [keypoint.position.x, keypoint.position.y]
      if (keypoint.part === "rightEye") rightEye = [keypoint.position.x, keypoint.position.y]
      if (keypoint.part === "rightWrist") rightHand = [keypoint.position.x, keypoint.position.y]
      if (keypoint.part === "leftWrist") leftHand = [keypoint.position.x, keypoint.position.y]

      if ((keypoint.part == "leftEye" || keypoint.part == "rightEye") && frameCount % 4 === 0) {
        let handHue = (leftWrist.position.x / width) * 360;
        let noseSize = 6 + (height - rightWrist.position.y) / 10;
        if (keypoint.score > 0.1) {

          let matterOptions = {
            friction: 0.2,
            restitution: random(0.3,1),
            hue: handHue
          }

          circles.push(new Circle(keypoint.position.x, keypoint.position.y + d / 6, noseSize, matterOptions))
        }
      }
    }
  }
}

function hideInfo() {
  if (hideInfoHtml) {
    infoHtml.removeClass('hidden');
    closeButton.html('X close');
  } else {
    infoHtml.addClass('hidden');
    closeButton.html('info');
  }
  hideInfoHtml = !hideInfoHtml;
}

function toggleCam() {
  if (showVideo) {
    // video.removeClass('show');
    // video.addClass('hide')
    camToggle.removeClass('active')
  } else {
    // video.addClass('show');
    // video.removeClass('hide')
    camToggle.addClass('active')
  }
  showVideo = !showVideo;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width, height);
}