var snake;
var scl = 20;
var calponia;
var danger;
var portal;
let img;
var high;

function setup() {
  var myCanvas = createCanvas(600, 600);
  myCanvas.parent("game")
  snake = new Snake();
  getScore();
  frameRate(10);
  pickLocation();
  dangerZone();
  portalZone()
  setInterval(dangerZone, 10000);
  setInterval(portalZone, 10000);
  img = loadImage('../assets/images/calponia.png');
  tint(0, 0, 128);
  setInterval(changeColor, 100);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function changeColor() {
  r = getRandomInt(256);
  g = getRandomInt(256);
  b = getRandomInt(256);
  tint(r, g, b)
}

function pickLocation() {
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  calponia = createVector(floor(random(cols)), floor(random(rows)));
  calponia.mult(scl);
}

function dangerZone() {
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  danger = createVector(floor(random(cols)), floor(random(rows)));
  danger.mult(scl);
}

function portalZone() {
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  portal = createVector(floor(random(cols)), floor(random(rows)));
  portal.mult(scl);
}

function getScore() {
  var highScoreUser = "";
  const Url = "/highscore";
  $.get(Url, function(data){
    highScoreUser = data["highscore"] + " by User: " + data["userName"]
    document.querySelector('.currentHighscore').innerHTML = highScoreUser
  })
  return true
}


function postScore(totalLength) {
  userName = prompt('Enter your Username and submit score', '');
  if (userName == null) {
    userName = "You dont entered a username, so this must be enough ;)"
  }
  const Url = "/highscore";
  const data={
    userName:userName,
    score:totalLength
  }
  $.post(Url, data, function(data, status){
  })
  getScore();
}

function draw() {
  background(51);

  if (snake.eat(calponia)) {
    pickLocation();
  }
  if (snake.eatDanger(danger)) {
    dangerZone();
  }
  if (snake.eatPortal(portal)) {
    portalZone();
  }
  snake.killSnake();
  snake.updatePosition();
  snake.showSnake();

  //fill(0,0,255);
  //rect(calponia.x, calponia.y, scl, scl);
  image(img, calponia.x, calponia.y, scl, scl)

  fill(255, 0, 0);
  rect(danger.x, danger.y, scl, scl);

  fill(0, 255, 0);
  rect(portal.x, portal.y, scl, scl);
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    snake.dir(0, -1);
  } else if (keyCode == DOWN_ARROW) {
    snake.dir(0, 1);
  } else if (keyCode == RIGHT_ARROW) {
    snake.dir(1, 0);
  } else if (keyCode == LEFT_ARROW) {
    snake.dir(-1, 0);
  }
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = 1;
  this.ySpeed = 0;
  this.totalLength = 0;
  this.tail = [];

  this.killSnake = function () {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        postScore(this.totalLength)
        this.totalLength = 0;
        this.tail = [];
        this.x = 0;
        this.y = 0;
      }
    }
  }

  this.dir = function (x, y) {
    this.xSpeed = x;
    this.ySpeed = y;
  }

  this.updatePosition = function () {
    if (this.totalLength === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.totalLength - 1] = createVector(this.x, this.y)

    this.x = this.x + this.xSpeed * scl;
    this.y = this.y + this.ySpeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);

  }

  this.showSnake = function () {
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);
    document.querySelector('.counter').innerHTML = this.totalLength + 1;
  }

  this.eat = function (pos) {
    var distance = dist(this.x, this.y, pos.x, pos.y);
    if (distance < 1) {
      this.totalLength++;
      return true;
    } else {
      return false;
    }
  }
  this.eatDanger = function (pos) {
    var distance = dist(this.x, this.y, pos.x, pos.y);
    if (distance < 1) {
      postScore(this.totalLength)
      this.totalLength = 0;
      this.tail = [];
      this.x = 0;
      this.y = 0;
      return true;
    } else {
      return false;
    }
  }
  this.eatPortal = function (pos) {
    var distance = dist(this.x, this.y, pos.x, pos.y);
    if (distance < 1) {
      var cols = floor(width / scl);
      var rows = floor(height / scl);
      randomCoordinates = createVector(floor(random(cols)), floor(random(rows)));
      randomCoordinates.mult(scl)
      this.x = randomCoordinates.x
      this.y = randomCoordinates.y
      return true;
    } else {
      return false;
    }
  }
}