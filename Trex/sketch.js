var PLAY = 1;
var END = 0;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var frames = 70;
var oFrames = 20;
var state = "start";
var spawnGap = 89;
var ducking = false;
var jumping = false;

var auto = false;

var score = 0;

var cloudsGroup;
var obstaclesGroup;
var phtGroup;

function preload(){
  trex_standing = loadAnimation("TrexStanding.png");
  trex_running = loadAnimation("TrexRun1.png","TrexRun2.png");
  trex_collided = loadImage("TrexDead.png");
  trex_ducking = loadAnimation("TrexDuck1.png", "TrexDuck2.png")
  trex_jump = loadSound("jump3.wav");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png")
  
  obstacleImage1 = loadImage("obstacle1.png")
  obstacleImage2 = loadImage("obstacle2.png")
  obstacleImage3 = loadImage("obstacle3.png")
  obstacleImage4 = loadImage("obstacle4.png")
  obstacleImage5 = loadImage("obstacle5.png")
  obstacleImage6 = loadImage("obstacle6.png")
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  
  createCanvas(600,200)

  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -0;
  
  //creating invisible ground
  invisibleGround = createSprite(200,195,400,10);
  invisibleGround.visible = false;
  
 //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.setCollider("rectangle");
  trex.addAnimation("standing", trex_standing);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("ducking", trex_ducking);
  trex.addImage("collided", trex_collided);
  
  trex.scale = 1.4;
  tBox = createSprite(trex.x, trex.y-10, 35, 35);
  tBox.visible = false;
  
  tSensor = createSprite(95, 160, 5, 50)
  tSensor.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  gameOver = createSprite(250, 50, 200, 40);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;
  
  restart = createSprite(250, 90, 20, 20);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}

function draw() {
  //set background color
  background(200);
  tBox.collide(ground);
  
  if (keyWentDown("Q") && auto==false){
      auto = true;
    } else if (keyWentDown("Q") && auto==true){
      auto = false;
    }
  
  if (keyWentDown("space")||keyWentDown("up")||keyWentDown("w")){
      if(auto==false){
        jumping=true;
        trex_jump.play();
      }
    }else{
      jumping=false;
    }
  
  
  //state set
  lastState=state;
  if (ducking==false && state != "start"){
    state="play";
  }
  
  if (keyDown("s") || keyDown("down")){
    ducking=true;
    }else{
      ducking=false;
    }
  
  tBox.y = trex.y-5;
  
  //hitbox change
  if (state=="duck"){
  tBox.height=20;
  }else{
  tBox.height=40;
  }
  
  tSensor.x = Math.round(random(70, 145));
  
   if(tBox.y != trex.y-5){
    trex.y=tBox.y;
  }
  
  //Start state
    if (state=="start")
    {
      score = 0; 
      
      trex.collide(invisibleGround);
      
      trex.velocityY = trex.velocityY + 3.5;
      
      gameOver.visible = false;
      restart.visible = false;
      
      text("press Q to auto play", 20, 20);
      
      text("Press Space to start", 250, 60);
      trex.changeAnimation("standing")

      //jump when space key is pressed to start game
      if(jumping==true)
      {
      trex.velocityY = -28;
      state="jump"
      }
    }
  
  if(state=="jump"){
    trex.velocityY = trex.velocityY + 3.5;
    if(trex.isTouching(invisibleGround)){
      state="play";
    }
  }
  
  //play state
  if(state=="play" || state=="duck")
  {
    //Ducking
    if (ducking==true){
      state="duck"
    }
    
    
  if (auto==true){
      text("Auto-Play", 20, 20)
  }
    
    if(state=="duck"){
      trex.changeAnimation("ducking")
    }
    score = score + ground.velocityX/22*-1;
    gameOver.visible = false;
    restart.visible = false;
    
    if(frameCount % 4==0){
   nextFrame();
   }
      
    //increasing speed
    if (score<500){
  ground.velocityX = -11;
  spawnGap = 90;
}else if (score>500 && score<1000) {
  ground.velocityX = -14;
  spawnGap = 85;
}else if (score>1000 && score<1500) {
  ground.velocityX = -17;
  spawnGap = 80;
}else if (score>1500 && score<2000) {
  ground.velocityX = -20;
  spawnGap = 75;
}else if (score>2000 && score<2500){
  ground.velocityX = -23;
}else if (score>2500 && score<3000){
  ground.velocityX = -26;
}else if (score>3000){
  ground.velocityX = -29;
}
    frames = frames + Math.round(random(2, 4));
    oFrames = oFrames + Math.round(random(2, 4));
    
    if(tSensor.isTouching(obstaclesGroup) && state=="play" && auto==true){
      jumping=true;
    }else if (state=="end"){
      jumping=false;
    }
    
  // jump when the space key is pressed
    if(jumping==true && trex.collide(ground))
    {
      trex.velocityY = -28;
      trex.changeAnimation("standing", trex_standing);
     } else if (state=="play" && trex.isTouching(ground)) {
      trex.changeAnimation("running", trex_running);
    }
  
  trex.velocityY = trex.velocityY + 3.5;
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
    
  //Spawn Clouds
  if (frames>110)
    {
     spawnClouds();
     frames = 0;
    }
  if (oFrames>spawnGap){
    spawnObstacles();
    oFrames = 0;
  }
   //if(obstaclesGroup.legth>1){
   // for (var i=0; i<obstaclesGroup.length; i++){
     // if(obstaclesGroup.get(i).x<trex.x+100){
        //  console.log("hello world")
       //  jumping=true;
     // }
//}
  //}
  }
 
  //end state
  if(tBox.isTouching(obstaclesGroup)){
    state="end";
    trex.changeImage("collided");
    trex.velocityY = 0;
    ground.velocityX = 0;
    invisibleGround.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(10);
    cloudsGroup.setLifetimeEach(10);
  }
  
  if(state=="end"){
    if (trex.y>160){
      trex.y = 160;
    }
    gameOver.visible = true;
    restart.visible = true;
    
    if (jumping || mousePressedOver(restart)){
    resetGame();
  }
    
  }
  drawSprites();
  
  text("Score: " + Math.round(score), 500, 20);
  
}

//function to spawn the clouds
function spawnClouds(){
  //Create clouds
  randoY = Math.round(random(0, 100))
  cloud = createSprite(750, randoY, 10, 10)
  //cloud.lifetime = 700/3;
  cloud.lifetime = 120;
  cloud.addImage(cloudImage);
  
  //Increase speed
  if (score<500){
  cloudsGroup.setVelocityXEach(-11);
}else if (score>500 && score<1000) {
  cloudsGroup.setVelocityXEach(-14);
}else if (score>1000 && score<1500) {
 cloudsGroup.setVelocityXEach = (-17);
}else if (score>1500 && score<2000) {
 cloudsGroup.setVelocityXEach = (-20); 
}else if (score>2000 && score<2500){
  cloudsGroup.setVelocityXEach = (-23);
}else if (score>2500 && score<3000){
 cloudsGroup.setVelocityXEach = (-26);
}else if (score>3000){
  cloudsGroup.setVelocityXEach = (-29);
}
  
    //adding cloud to the group
   cloudsGroup.add(cloud);
  
  
  trex.depth = cloud.depth+1;
}

function spawnP(){
  PhtY = Math.round(random(30, 50));
  Pht = createSprite(750, PhtY, 20, 20);
  Pht.lifetime = 130;
  
  PhtGroup.add(Pht);
  if (score<500){
  PhtGroup.setVelocityXEach(-11);
}else if (score>500 && score<1000) {
  PhtGroup.setVelocityXEach(-14);
}else if (score>1000 && score<1500) {
  PhtGroup.setVelocityXEach(-17);
}else if (score>1500 && score<2000) {
  PhtGroup.setVelocityXEach(-20); 
}else if (score>2000 && score<2500){
  PhtGroup.setVelocityXEach(-23);
}else if (score>2500 && score<3000){
  PhtGroup.setVelocityXEach(-26);
}else if (score>3000){
  PhtGroup.setVelocityXEach(-29);
}
}

function spawnObstacles() {
  randoImage = Math.round(random(1, 6));
  obstacles = createSprite(750, 162, 10, 10);
  //obstacles.lifetime = 700/3;
  obstacles.lifetime = 130;
  
  //adding obstacles to the group
  obstaclesGroup.add(obstacles);
  
  //increase speed
  if (score<500){
  obstaclesGroup.setVelocityXEach(-11);
}else if (score>500 && score<1000) {
  obstaclesGroup.setVelocityXEach(-14);
}else if (score>1000 && score<1500) {
  obstaclesGroup.setVelocityXEach(-17);
}else if (score>1500 && score<2000) {
 obstaclesGroup.setVelocityXEach(-20); 
}else if (score>2000 && score<2500){
  obstaclesGroup.setVelocityXEach(-23);
}else if (score>2500 && score<3000){
  obstaclesGroup.setVelocityXEach(-26);
}else if (score>3000){
  obstaclesGroup.setVelocityXEach(-29);
}
  obstacles.scale = 0.52;
  switch (randoImage) {
    case 1: obstacles.addImage(obstacleImage1);
    break;
    case 2: obstacles.addImage(obstacleImage2);
    break;
    case 3: obstacles.addImage(obstacleImage3);
    break;
    case 4: obstacles.addImage(obstacleImage4);
    break;
    case 5: obstacles.addImage(obstacleImage5);
    break;
    case 6: obstacles.addImage(obstacleImage6);
    break;
    default:
    break;
  }
  
}

function resetGame(){
  frames = 70;
  oFrames = 20;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0; 
  state="play"
}
//Other spawn option
//Divides by 100  and checks for the remainder
//If the remainder  = 0 it makes a sprite
//Less will spawn more often
//if (framecount % 100==0){
//spawn...

//}

function nextFrame(){
  trex.nextFrame();
}
