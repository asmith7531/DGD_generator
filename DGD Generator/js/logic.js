$(document).ready(function () {

    var Location = function () {
      this.date = $(".date").val();
      //this.country=(".country").val(); ///// country will not give me the value need to examine why
      this.address1 = $(".address1").val();
      this.address2 = $(".address2").val();
      this.city = $(".city").val();
      this.region = $(".region").val();
  
    }
    var shipment;
    $("#addNewLocationBtn").click(function addLocation() {
      shipment = new Location();
      console.log(shipment)
    })
  
    var i = 0;
    //creates an object for the current batch
    var Batch = function () {
      this.po = $(".po").val();
      this.batchNum = $(".batchNum").val();
      this.hazmat = $(".hazmat").val();
      this.bottles = $(".bottles").val();
    }
    var batches = []
    // console.log(i)
    //submit button function and click event, 
    $(".addBatchBtn").click(function addBatch() {
    
      // if (shipment === undefined) {
      //   alert("Please enter a Destination first!")
      // }
  
      i++
      // console.log(i)
      //creates an object for the current batch
      batches[i] = new Batch()
      shipment.batches = batches;
      // console.log(shipment)
  
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
      var boxvolume6x1 = ["", 1, 2, 3, 4, 5, 6]
  
      //declares partial box value to be set after the below logic runs but I need it to be available in this scope
      var partialBoxVol = undefined;
  
      var boxChoice = boxOptions[box]
      //declares an arbitrary box volume variable that will be reassigned later 
      let fullBoxVolume = 0;
  
      shipment.batches[i].boxChoice = boxChoice;
  
      //this is the logic that determines how many full boxes we have and how many bottles are in the remaining partial box (there is one of these conditionals that follow similar logic for each of the different sizes of box)
      if (boxChoice === ("4x1")) {
        // console.log(i);
        // console.log("4x1");
        //returning the box size
        //divides the total number of bottles in the order by the number of bottles per box and rounds down 
        shipment.batches[i].fullBoxes = Math.floor(bottles / 4);
        // console.log(fullBoxes)
        //sets a variable equal to the remainder
        var remainingBottles = bottles % 4;
  
        //if a remainder exists this code will run 
        if (remainingBottles != 0) {
          partialBoxVol = boxvolume4x1[remainingBottles];
          shipment.batches[i].partialBoxVol = partialBoxVol
          // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
        }
        shipment.batches[i].fullBoxVolume = 15.14;
      } else if (boxChoice === ("4x4")) {
        // console.log("4x4");
        shipment.batches[i].fullBoxes = Math.floor(bottles / 4);
        shipment.remainingBottles = bottles % 4;
  
        if (remainingBottles != 0) {
          shipment.partialBoxVol = boxvolume4x4[remainingBottles];
          // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
        }
        fullBoxVolume = 16;
      } else if (boxChoice === ("2x10")) {
        // console.log("2x10");
        shipment.batches[i].fullBoxes = Math.floor(bottles / 2);
        shipment.batches[i].remainingBottles = bottles % 2;
  
        if (remainingBottles != 0) {
          shipment.batches[i].partialBoxVol = boxvolume2x10[remainingBottles];
          // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
        }
        shipment.batches[i].fullBoxVolume = 20;
      } else if (boxChoice === ("6x1")) {
        // console.log("6x1");
        shipment.batches[i].fullBoxes = Math.floor(bottles / 6);
        shipment.batches[i].remainingBottles = bottles % 6;
  
        if (remainingBottles != 0) {
          partialBoxVol = boxvolume6x1[remainingBottles];
          // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
        }
        shipment.batches[i].fullBoxVolume = 6;
      }
      //defines new table row
      var newtr = $("<tr>")
  
      //function to add variable info to the table passing the variable in as a parameter
      function newHTML(text) {
        //defines new html element
        var newtd = $('<td>')
        newtd.text(text);
        newtr.append(newtd);
      }
  
      newHTML(shipment.batches[i].po)
      newHTML(shipment.batches[i].batchNum)
      newHTML(shipment.batches[i].hazmat)
      newHTML(shipment.batches[i].boxChoice)
      newHTML(shipment.batches[i].fullBoxVolume)
      newHTML(shipment.batches[i].fullBoxes)
      newHTML(shipment.batches[i].partialBoxVol)
      $("#output").append(newtr)
    })
    //overpack dictionary 
    var  overpack = {
      "4x1":{
        large:27,
        medium:18,
        small:8
      },
      "4x4":{
        large:18,
        medium:12,
        small:8
      },
      "2x10":{
        large:27,
        medium:18,
        small:8
      },
      "6x1":{
        large:12
      }
    }///look up bracket notation to fix this
    // console.log(overpack[shipment.batches[1].boxChoice].large)
    ///////////////////////////////////////////////////////////////////////////////////////////////// write a function that will count the overpacks, use the dictionary to 
    //overpack function which runs once our overpack button is clicked
    $(".overpack").click(function overpack() {
      //checks if user entered a destination
      if (shipment == undefined)
        alert("Enter a Destination First!")
      //checks if user entered an order
      else if (shipment.batches === undefined) {
        alert("Please enter an order first!")
      } else {
        //gets the number of batches going to this location
        var numOfBatches = shipment.batches.length - 1;
        //loops to compare the batches to each other 
        for (var i = 1; i <= numOfBatches; i++) {
          for (var j = 1; j <= numOfBatches; j++) {
            //logic so the loop does not compare multiple times
            if((i!=j) &&(i<j)) {
              //checks if the hazardous material is the same and the type of box is the same
             if((shipment.batches[i].hazmat===shipment.batches[j].hazmat)&&(shipment.batches[i].boxChoice===shipment.batches[j].boxChoice)){
               //if they are the same the full boxes from each are added together
              var totalBoxes = shipment.batches[i].fullBoxes + shipment.batches[j].fullBoxes
              // console.log(totalBoxes)
              if (shipment.batches[i].boxChoice === "4x1"){
                
              }
              else if (shipment.batches[i].boxChoice === "4x4"){
                
              }
              else if (shipment.batches[i].boxChoice === "2x10"){
                
              }
              else if (shipment.batches[i].boxChoice === "6x1"){
                
              }
             }
            }
          }
        }
        // console.log("Large: "+overpacks.large);
        // console.log("Medium: "+overpacks.medium);
        // console.log("Small: "+overpacks.small);
        // console.log("IOP: "+overpacks.iop);
      }
    })
  })
  
  
  