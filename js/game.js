'use strict'
const canvas = document.getElementById("game-screen");
const ctx = canvas.getContext("2d");

let onandoff = document.getElementById('onandoff');
let diff = document.getElementById('difficulty');
let score = document.getElementById('score');

//canvas map 
let tileCount = 24;
let tileSize = canvas.width / tileCount - 2;

let isRunning = false;
let timer;
let speed = 10;
let scoreNum = 0;
//snake body and head position
let headX = 10;
let headY = 10;
const snakeTail = [];
let tailLength = 4;
//apple position
let appleX = 5;
let appleY = 5;

//snake head direction
let inputsXVelocity = 1;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;

//audio sound
const eatSound = new Audio("music/bite.mp3");
const clickSound = new Audio("music/click.mp3");
const dieSound = new Audio("music/die.mp3");
const myAudio = new Audio("music/backgroundMusic.mp3");

//music button
let isPlaying = false;
function togglePlay() {
  if (isPlaying) {
    myAudio.pause()
    onandoff.innerHTML="Off";
  } else {
    myAudio.play();
    onandoff.innerHTML="<span class='color-white'>On</span>";
    myAudio.loop=true;
  }
myAudio.onplaying = function() {
  isPlaying = true;
};
myAudio.onpause = function() {
  isPlaying = false;
};
};

//start button to draw the screen out
$('.start').on('click',() => {
  clickSound.play();
  drawGame();
  $('.rule').hide();
  $('.game-over').hide();

});
//pause button to stop snake moving
$('.pause').on('click',() => {
  clickSound.play();
  clearTimeout(timer);
  isRunning = false;
});

//restart button to clean everything on the screen 
$('.yes').on('click',() => {
  clickSound.play();
  clearScreen();
  clearSnakeBody();
  $('.game-over').hide();
});

//keyboard control the snake, 
document.addEventListener("keydown", (event) => {

    //up
    if (event.keyCode == 38 || event.keyCode == 87) {
      //87 is w
      if(inputsYVelocity != 1){
        inputsYVelocity = -1;
        inputsXVelocity = 0;
      };
    }
  
    //down
    if (event.keyCode == 40 || event.keyCode == 83) {
      // 83 is s
      if(inputsYVelocity != -1){ 
        inputsYVelocity = 1;
        inputsXVelocity = 0;
      }
     };
  
    //left
    if (event.keyCode == 37 || event.keyCode == 65) {
      // 65 is a
      if(inputsXVelocity != 1){
        inputsYVelocity = 0;
        inputsXVelocity = -1;
      }
    };
  
    //right
    if (event.keyCode == 39 || event.keyCode == 68) {
      //68 is d
      if(inputsXVelocity != -1){
        inputsYVelocity = 0;
        inputsXVelocity = 1;
      }
    }
  });

  //game difficulty level button, each level has different button
  $('.h_diff').on('click',() => {
    speed=18;
    diff.innerHTML = "Difficulty : Difficult"
  });

  $('.diff').on('click',() => {
    speed=15;
    diff.innerHTML = "Difficulty : Medium"
  });

  $('.easy').on('click',() => {
    diff.innerHTML = "Difficulty : Easy"
    speed=10;
  });

  //draw the game screen in the canvas
  function drawGame() {
  isRunning = true;
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;
  
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }
  
  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();


  timer = setTimeout(drawGame, 1000 / speed);
}

//to check if it is gameover
function isGameOver() {
  let gameOver = false;
  

  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount +1) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount+1) {
    gameOver = true;
  }

  //snake head hit snake body
  for (let i = 0; i < snakeTail.length; i++) {
    if (snakeTail[i].x === headX && snakeTail[i].y === headY) {
      gameOver = true;
      break;
    }
  }

  //if is gameover, show the restart modal
  if (gameOver) {
    dieSound.play();
    isRunning = false;
    $('.game-over').show();
  }
    return gameOver;
  };
  

//stoprunning, clean score, tail length, and reposition the snakeHead
function clearSnakeBody(){
  clearTimeout(timer);
  tailLength=4;
  headX = 10;
  headY = 10;
  snakeTail.length = 0;
  scoreNum=0;
  score.innerHTML= "Score:" + 0;

}

//clear everything in the canvas screen
function clearScreen() {
  ctx.fillStyle = "#3D6800"; //background color
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
}

//draw the snake
function drawSnake() {
  //snake tail
  for (let i = 0; i < snakeTail.length; i++) {
    ctx.fillStyle = "green";
    ctx.fillRect(snakeTail[i].x * tileCount, snakeTail[i].y * tileCount, tileSize, tileSize);
    ctx.strokeRect(snakeTail[i].x * tileCount, snakeTail[i].y * tileCount, tileSize, tileSize);
  };
    
  snakeTail.push({x:headX, y:headY});
  while (snakeTail.length > tailLength) {
   snakeTail.shift();
  }

  //snake head
  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
  ctx.strokeRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

//snake change direction
function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

//draw the red apple
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

//check if apple collide with snakeHead.
//if apple and snakeHead(x and y) are the same, regenerate the apple
///tail length and score add 1
function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    scoreNum++;
    eatSound.play();
  }
};

//score update in scoreboard once apple collide with snakeHead
function drawScore() {
  score.innerHTML= "Score:" + scoreNum;
};


