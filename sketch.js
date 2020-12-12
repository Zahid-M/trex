var obstaclesGroup
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstacle1
var obstacle2
var obstacle3
var obstacle4
var obstacle5
var obstacle6
var gameOver
var restart
var PLAY = 1
var gamestate = PLAY
var END = 0
var newImage;
var score = 0
var highScore = 0
var checkpointSound
var dieSound
var jumpSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  
  checkpointSound = loadSound("checkPoint.mp3")
  dieSound = loadSound("die.mp3")
  jumpSound = loadSound("jump.mp3")
  
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  //trex.setCollider("rectangle",0,0,350,90)
  trex.debug = true
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  gameOver = createSprite(300,75,10,10)
  restart = createSprite (300,150,10,10)
   
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup()
  cloudsGroup = createGroup()
  
  console.log("Hello"+ 5)
  
  gameOver.addImage(gameOverImage)
  restart.addImage(restartImage)
  gameOver.scale=0.6
  restart.scale=0.6
  
}

function draw() {
  
  background("red");
  
  trex.collide(invisibleGround);
  
  drawSprites();
  
  text("score:"+score,500,25)
  if (score % 100 === 0 && score > 0){
  checkpointSound.play()  
  }
  
  text("highScore:"+highScore,400,25)
  
  console.log(gamestate) 
  
  if(gamestate === PLAY){
    if(keyDown("space")&& trex.y >= 160) {
    trex.velocityY = -13;
    jumpSound.play()
    }   
    
    trex.velocityY = trex.velocityY + 0.8
    
    ground.velocityX = -7 - 2 * score/100
    
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    
    //spawn the clouds
    spawnClouds();
     
    gameOver.visible = false
    restart.visible = false
    
    createObstacle();
    if(obstaclesGroup.isTouching(trex)){
    gamestate = END
    dieSound.play()
    //trex.velocityY = -9
    }
    score = score + Math.round(getFrameRate()/30)
 } 
 
  if(gamestate === END){
  ground.velocityX = 0 
  cloudsGroup.setVelocityXEach(0)
  obstaclesGroup.setVelocityXEach(0)
  obstaclesGroup.setLifetimeEach(-1)
  trex.velocityY=0
  cloudsGroup.setLifetimeEach(-1)
  trex.changeAnimation("collided",trex_collided)
  gameOver.visible = true
  restart.visible = true
  if (mousePressedOver(restart)){
  reset()
  }
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    cloudsGroup.add(cloud)
  
    //assigning lifetime to the variable
    cloud.lifetime = 200
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

function createObstacle(){
  if(frameCount % 75 === 0){
  obstacle = createSprite(600,160,10,10)  
  obstacle.velocityX = -7 - 2 * score/100
  selectNumber = Math.round(random(1,6))
  switch(selectNumber){
    case 1: 
    obstacle.addImage(obstacle1);
    break
    case 2:
    obstacle.addImage(obstacle2);  
    break
    case 3: 
    obstacle.addImage(obstacle3);
    break
    case 4: 
    obstacle.addImage(obstacle4);
    break
    case 5: 
    obstacle.addImage(obstacle5);
    break
    case 6: 
    obstacle.addImage(obstacle6);
    break
    default:
    break
     }
  obstacle.scale = 0.5
  obstaclesGroup.add(obstacle)
  obstacle.lifetime = 120
  }
}

function reset(){
  gamestate = PLAY
  gameOver.visible = false
  restart.visible = false
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running",trex_running)
  if (score > highScore){
    highScore = score
  }  
  score = 0
}