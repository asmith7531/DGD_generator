$(document).ready(function() {
  
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCugPvV9_dRb3uOIc9hCQqnNlh2IL3Jm18",
  authDomain: "dgd-database.firebaseapp.com",
  databaseURL: "https://dgd-database.firebaseio.com",
  projectId: "dgd-database",
  storageBucket: "dgd-database.appspot.com",
  messagingSenderId: "863437078907"
};
firebase.initializeApp(config);
//defining the database variable so wwe can type less
var database = firebase.database();
//function pushes location object to firebase main directory
function uploadLocation(data){
  database.ref().set({
    location:data
  })}
//function pushes data within the location/batches directory
function uploadBatch(data){
database.ref("location/batches").push({
  batch:data
})}

$(".addNewLocationBtn").click(function addLocation(){
  var location = {
    date:$(".date").val(),
    country:$(".country").val(),
    address1:$(".address1").val(),
    address2:$(".address2").val(),
    city:$(".city").val(),
    region:$(".region").val(),
    batches:0,
  }
  uploadLocation(location);
})

//submit button function and click event, 
$(".addBatchBtn").click(function addBatch() {
  //creates an object for the current batch
  var  batch = {
    po:$(".po").val(),
    batchNum:$(".batchNum").val(),
    hazmat:$(".hazmat").val(),
    bottles:$(".bottles").val(),
    // boxSize:$("boxOption").val()
  }
  console.log(batch.boxSize)
  uploadBatch(batch);
    
  //declaring the var box to equal the box type selected index of the drop down
  let box = document.getElementById("boxOption").selectedIndex;

  //sets our variable "bottles" equal to the user input for the number of bottles
  let bottles = $(".bottles").val();
  
  //declaring our variable that will hold the number of full boxes of this lot number, this will be reassigned later after we calculate it by dividing bottles by box type
  let fullBoxes = 0;
  
  //array that contains the different box types to relate the input index to a string
  const boxOptions = ["4x1", "4x4", "2x10", "6x1"]
  
  //arrays containing the possible partial box volumes for boxes, the index is in order to correspond to the number of remaining bottles (thats why [0] is an empty string)
  var boxvolume4x1 = ["", 3.785, 7.57, 11.355, 15.14]
  var boxvolume4x4 = ["", 4, 8, 12, 16]
  var boxvolume2x10 = ["", 10, 20]
  var boxvolume6x1 = ["", 1,2,3,4,5,6]
  
  //declares partial box value to be set after the below logic runs but I need it to be available in this scope
  var partialBoxVol = undefined;
  
  var boxChoice= boxOptions[box]
  //declares an arbitrary box volume variable that will be reassigned later 
  let fullBoxVolume = 0;
  
  var i = 0;  //iterator var
  
  i++

  //this is the logic that determines how many full boxes we have and how many bottles are in the remaining partial box (there is one of these conditionals that follow similar logic for each of the different sizes of box)
  if (boxChoice === ("4x1"))  {
    console.log(i);
    console.log("4x1");
    //returning the box size
    //divides the total number of bottles in the order by the number of bottles per box and rounds down 
    fullBoxes = Math.floor(bottles / 4);
    // console.log(fullBoxes)
    //sets a variable equal to the remainder
    var remainingBottles = bottles % 4;
    
    //if a remainder exists this code will run 
    if (remainingBottles != 0)  { 
      partialBoxVol=boxvolume4x1[remainingBottles];
      console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
    }
    fullBoxVolume = 15.14;
  }
  
  ////////////////////////////////////////////////
  
  else if (boxOptions[box] === ("4x4")) {
    console.log("4x4");
    fullBoxes = Math.floor(bottles / 4);
    remainingBottles = bottles % 4;
    
    if (remainingBottles != 0)  {
      partialBoxVol =  boxvolume4x4[remainingBottles];
      console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
    }
    fullBoxVolume = 16;
  }
  
    ////////////////////////////////////////////////

    else if (boxOptions[box] === ("2x10")) {
      console.log("2x10");
      fullBoxes = Math.floor(bottles / 2);
      remainingBottles = bottles % 2;

      if (remainingBottles != 0)  {
        partialBoxVol=boxvolume2x10[remainingBottles];
          console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
        }
        fullBoxVolume = 20;
    }

    //////////////////////////////////////////////////

    else if (boxOptions[box] === ("6x1")) {
      console.log("6x1");
      fullBoxes = Math.floor(bottles / 6);
      remainingBottles = bottles % 6;

      if (remainingBottles != 0)  {
        partialBoxVol=boxvolume6x1[remainingBottles];
          console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
        }
        fullBoxVolume = 6;
    }
    //defines new table row
    var newtr = $("<tr>")

    //function to add variable info to the table passing the variable in as a parameter
    function newHTML(text){
      //defines new html element
      var newtd = $('<td>')
      newtd.text(text);
      newtr.append(newtd);
    }
    
    
    newHTML(batch.po)
    newHTML(batch.batchNum)
    newHTML(batch.hazmat)
    newHTML(boxChoice)
    newHTML(fullBoxVolume)
    newHTML(fullBoxes)
    newHTML(partialBoxVol)
    $("#output").append(newtr)
}) 

  $("#overpack").click(overpack())
    
    function overpack(){
      //push data to firebase before doing this. that way we can pull all the order info that we need for this 
  }
})
