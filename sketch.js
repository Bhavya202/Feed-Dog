var dog, sadDog, happyDog, database;
var foodS,foodStock;
var addFood, dogFeed;
var foodObj, fedTime;

//created feed and lastFed variable here
var feed, lastFed;

function preload(){
sadDog = loadImage("Dog.png");
happyDog = loadImage("happy dog.png");
}

function setup() {
  //create the canvas
  createCanvas(1000,500);

  //creates the database
  database = firebase.database();

  //create the objects
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800, 220, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //feed the dog button
  dogFeed = createButton("Feed Dog");
  dogFeed.position(700, 95)
  dogFeed.mousePressed(feedDog);

  //add the food button
  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  //create the background
  background(46,139,87);

  //write code to read fedtime value from the database 
  fedTime = database.ref("FeedTime");
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill("white");
  textSize(20);
  if(lastFed>=12){
    text("Last Feed = "+lastFed%12+" PM", 300, 50);
  }
  else if(lastFed==0){
    text("Last Feed = 12 AM", 300, 50);
  }
  else{
    text("Last Feed = "+lastFed+" AM", 300, 50);
  }
 
  //display the object
  foodObj.display();

  //makes the sprite visible
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  //code to reduce the milk bottles and set the time accordingly
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}