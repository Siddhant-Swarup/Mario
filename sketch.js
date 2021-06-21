var score = 0;
var obstaclegroup, obstacle1, obstacle2;
var booster = 0;
var hard = 0, medium = 0;
let jumpSound, coinSound;
var gamemode = "play";
var mariocollide;
//preload function is executed once,used to load resources
function preload() {
    bgimg = loadImage("images/bgnew.jpg");

    mario_run = loadAnimation("images/mar1.png", "images/mar2.png", "images/mar3.png", "images/mar4.png", "images/mar5.png", "images/mar6.png", "images/mar7.png");
    mariocollide = loadAnimation("images/dead.png");
    brickImage = loadImage("images/brick.png");

    coins = loadAnimation("images/con1.png", "images/con2.png", "images/con3.png", "images/con4.png", "images/con5.png", "images/con6.png");


    obstacle1 = loadAnimation("images/mush1.png", "images/mush2.png", "images/mush3.png", "images/mush4.png", "images/mush5.png", "images/mush6.png");
    obstacle2 = loadAnimation("images/tur1.png", "images/tur2.png", "images/tur3.png", "images/tur4.png", "images/tur5.png");

    hardimage = loadImage("images/hard_image.jfif");
    mediumimage = loadImage("images/medium_image.jpg");
    //Sounds
    soundFormats('mp3');
    coinSound = loadSound("sounds/coinSound");
    jumpSound = loadSound("sounds/jump");
    dieSound=loadSound("sounds/dieSound");

}
//setup function will execute only once,used to create components like sprites
function setup() {
    createCanvas(1000, 600);
    //sprite for background
    bg = createSprite(800, 300, 500, 500);
    bg.addImage(bgimg)
    bg.scale = 0.5;
    //option sprite in menu
    hard = createSprite(500, 300);
    hard.addImage(hardimage);
    hard.visible = false;
    //option sprite in menu
    medium = createSprite(500, 200);
    medium.scale = 0.3;
    medium.addImage(mediumimage);
    medium.visible = false;


    //sprite for the player
    mario = createSprite(150, 450, 20, 40)
    mario.addAnimation("running", mario_run)
    mario.addAnimation("collide", mariocollide)
    mario.scale = 0.28;
    mario.debug=true;


    //limit player going out of the view
    skylimit = createSprite(200, 0, 400, 20)
    skylimit.visible = false;
    ground = createSprite(200, 600, 400, 20)
    ground.visible = false;
    //non friendly characters group
    bricksGroup = new Group();
    //friendly characters group
    coinGroup = new Group();
    //non friendly characters 
    obstaclegroup = new Group();

}



function draw() {
    //decide the mode of the game using if condition
    if (gamemode == "play") {
        //to move the background repeatedly in x direction
        if (bg.x < 100) {
            bg.x = bg.width / 4;
        }

        //menu
        if (keyDown("o")) {
            hard.visible = true;
            medium.visible = true;
        }

        if (mousePressedOver(hard)) {
            booster = 1;
            hard.visible = false;
            medium.visible = false;

        }
        if (mousePressedOver(medium)) {
            booster = 0;
            hard.visible = false;
            medium.visible = false;
        }


        //For Booster
        if (keyDown("a")) {
            booster = 1;
            mario.frameDelay=2;
        }
        else {
            booster = 0;
            mario.frameDelay=15;
        }

        //change the velocity of background in booster mode
        if (booster == 1) {
            bg.velocityX = -20;
        }
        else {
            bg.velocityX = -6;
        }

        //mario jump
        if (keyDown("space")) {
            mario.velocityY = -16;
            jumpSound.play();
        }

        //select hard option in menu
        //gravity to player
        mario.velocityY = mario.velocityY + 0.98;


        //mario interaction with brick sprite
        for (var i = 0; i < bricksGroup.length; i++) {
            var temp = bricksGroup.get(i)

            if (temp.isTouching(mario)) {
                mario.collide(temp);
            }
        }

        //interaction with coin 
        for (var a = 0; a < coinGroup.length; a++) {
            var temp = coinGroup.get(a);

            if (temp.isTouching(mario)) {
                coinSound.play();
                temp.destroy();
                temp = null;
                score = ++score;
            }
        }

        //Mario position when it collide obstacle
        if (mario.x < 200) {
            mario.x = 200;
        }
        //platform for the mario to stand
        mario.collide(ground);
        //avoid mario to go out of the view
        mario.collide(skylimit);
        //function call to generate bricks
        generatebricks();
        //function call to generate coin
        generatecoin();
        //function call to generate obstacle
        generate_obstacle();
        //obstacle interacting with mario,change gamemode to end
        
        if(obstaclegroup.isTouching(mario)){
            gamemode="end";
            mario.changeAnimation("collide",mariocollide);
            dieSound.play();
        }
    }
    else if (gamemode ==="end") {
        bg.velocityX=0;
        obstaclegroup.setVelocityXEach(0);
        bricksGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        mario.velocityX=0;
        mario.velocityY=0;
        coinGroup.setLifetimeEach(-1);
        bricksGroup.setLifetimeEach(-1);
        obstaclegroup.setLifetimeEach(-1);
        mario.setCollider("rectangle",0,0,300,10);
        mario.y=570;
    }

    //draw all the sprite on the canvas
    drawSprites();

    document.getElementById("scoreboard").innerHTML = score;
}

//Functions

//This generate bricks
function generatebricks() {
    if (frameCount % 60 === 0) {
        var brick = createSprite(1100, 600, 40, 10);
        brick.y = random(50, 450);
        brick.addImage(brickImage);
        brick.scale = 0.5;
        //change of velocity for brickgroup in booster mode
        if (booster == 1) {
            bricksGroup.setVelocityXEach(-20);
        }
        else {
            bricksGroup.setVelocityXEach(-5);
        }
        brick.lifetime = 300;
        bricksGroup.add(brick);

    }
}
//generate coins
function generatecoin() {
    if (frameCount % 60 === 0) {
        var coin = createSprite(1100, 600, 40, 10);
        coin.y = random(80, 400);
        coin.addAnimation("coins", coins);
        coin.scale = 0.1;
        //change velocity of coingroup in booster mode
        if (booster == 1) {
            coinGroup.setVelocityXEach(-20);
        }
        else {
            coinGroup.setVelocityXEach(-5);
        }
        coin.lifetime = 1000;
        coinGroup.add(coin);
    }
}
//generate obstacles
function generate_obstacle() {
    if (frameCount % 100 === 0) {
        var obs = createSprite(1000, 545, 10, 40);
        obs.scale = 0.2;
        obs.velocityX = -4;
        //get a random number 1,2.Using random function and Math.round
        var rand = Math.round(random(1, 2));
        //Use switch statement to add different animation to the sprite,it is dependent on rand variable
        switch (rand) {
            case 1:
                obs.addAnimation("Mushroom", obstacle1);
                break;
            case 2:
                obs.addAnimation("Turtle", obstacle2);
                break;
            default:
                break;
        }
        obs.lifetime = 300;
        obstaclegroup.add(obs);
    }
}