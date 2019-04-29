$(document).ready(function () {
  const Location = function () {
    this.date = $(".date").val();
    //this.country=(".country").val(); ///// country will not give me the value need to figure out why
    this.address1 = $(".address1").val();
    this.address2 = $(".address2").val();
    this.city = $(".city").val();
    this.region = $(".region").val();
    orders = [];
  }
  var shipment;
  //creates an object for the current batch
  var Batch = function () {
    this.po = $(".po").val();
    this.batchNum = $(".batchNum").val();
    this.hazmat = $(".hazmat").val();
    this.bottles = $(".bottles").val();
  }
  $("#addNewLocationBtn").click(function addLocation() {
    shipment = new Location();
    // console.log(shipment)
    alert("Destination Added!")
  })
  //iterator
  var i = 0;
  var orders = []
  // console.log(i)
  //submit button function and click event, 
  $(".addBatchBtn").click(function addBatch() {

    if (shipment === undefined) {
      alert("Please enter a Destination first!")
    }

    i++
    // console.log(i)
    //creates an object for the current batch
    orders[i] = new Batch()
    shipment.orders = orders;
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
    var partialBoxVol = 0;

    var boxChoice = boxOptions[box]
    //declares an arbitrary box volume variable that will be reassigned later 
    let fullBoxVolume = 0;

    shipment.orders[i].boxChoice = boxChoice;

    //this is the logic that determines how many full boxes we have and how many bottles are in the remaining partial box (there is one of these conditionals that follow similar logic for each of the different sizes of box)
    if (boxChoice === ("4x1")) {
      //divides the total number of bottles in the order by the number of bottles per box and rounds down 
      shipment.orders[i].fullBoxes = Math.floor(bottles / 4);
      //sets a variable equal to the remainder
      var remainingBottles = bottles % 4;

      //if a remainder exists this code will run 
      if (remainingBottles != 0) {
        partialBoxVol = boxvolume4x1[remainingBottles];
        shipment.orders[i].partialBoxVol = partialBoxVol
        // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
      }
      shipment.orders[i].fullBoxVolume = 15.14;
    } else if (boxChoice === ("4x4")) {
      //divides the total number of bottles in the order by the number of bottles per box and rounds down 
      shipment.orders[i].fullBoxes = Math.floor(bottles / 4);
      //sets a variable equal to the remainder
      var remainingBottles = bottles % 4;

      //if a remainder exists this code will run 
      if (remainingBottles != 0) {
        partialBoxVol = boxvolume4x4[remainingBottles];
        shipment.orders[i].partialBoxVol = partialBoxVol
        // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
      }
      shipment.orders[i].fullBoxVolume = 16;
    } else if (boxChoice === ("2x10")) {
      //divides the total number of bottles in the order by the number of bottles per box and rounds down 
      shipment.orders[i].fullBoxes = Math.floor(bottles / 2);
      //sets a variable equal to the remainder
      var remainingBottles = bottles % 2;

      //if a remainder exists this code will run 
      if (remainingBottles != 0) {
        partialBoxVol = boxvolume2x10[remainingBottles];
        shipment.orders[i].partialBoxVol = partialBoxVol
        // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
      }
      shipment.orders[i].fullBoxVolume = 20;
    } else if (boxChoice === ("6x1")) {
      //divides the total number of bottles in the order by the number of bottles per box and rounds down 
      shipment.orders[i].fullBoxes = Math.floor(bottles / 6);
      //sets a variable equal to the remainder
      var remainingBottles = bottles % 6;

      //if a remainder exists this code will run 
      if (remainingBottles != 0) {
        partialBoxVol = boxvolume6x1[remainingBottles];
        shipment.orders[i].partialBoxVol = partialBoxVol
        // console.log("There is one partial box with a volume of: " + partialBoxVol + " liters");
      }
      shipment.orders[i].fullBoxVolume = 6;
    }

    ///////////////////////////////////////////

    //defines new table row
    var newtr = $("<tr>")

    //function to add variable info to the table passing the variable in as a parameter
    function newHTML(text) {
      //defines new html element
      var newtd = $('<td>')
      newtd.text(text);
      newtr.append(newtd);
    }

    newHTML(shipment.orders[i].po)
    newHTML(shipment.orders[i].batchNum)
    newHTML(shipment.orders[i].hazmat)
    newHTML(shipment.orders[i].boxChoice)
    newHTML(shipment.orders[i].fullBoxVolume)
    newHTML(shipment.orders[i].fullBoxes)
    newHTML(shipment.orders[i].partialBoxVol)
    $("#output").append(newtr)
  })
  ///////////////////////////////////////////////

  //overpack function which runs once our overpack button is clicked
  $(".overpack").click(function overpack() {

    //pushing the orders to a separate list to make them easier to work with using the Lodash library
    const orderList = [];
    for (var i = 1; i < shipment.orders.length; i++) {
      orderList.push(shipment.orders[i])
    }

    //groups the orders by hazmat, box dims, batch
    const groupsDGD = _.groupBy(orderList, function (orderList) {
      return `${orderList.hazmat}-${orderList.fullBoxVolume}-${orderList.batchNum}`;
    });
    console.log(groupsDGD)

    var boxTotals = []

    const consolidateList = _.groupBy(orderList, function (orderList) {
      return `${orderList.boxChoice}`;
    });
    console.log(consolidateList)
    
    for (var box in consolidateList) {
      var hazmat = consolidateList[box]
      
      var box = box
      var boxCount = 0;
      for (var batch in consolidateList[box]) {
        boxCount += hazmat[batch].fullBoxes
        // console.log(hazmat[batch])
        if (hazmat[batch].partialBoxVol != 0 || null || undefined) {
          boxCount += 1
        }
      }
      
      boxTotals[box] = (boxCount);
    }
    
    console.log(overpackList)
    //overpack dictionary 
    var overpackDims = {
      overpack4x1: {
        large: 27,
        medium: 18,
        small: 8
      },
      overpack4x4: {
        large: 18,
        medium: 12,
        small: 8
      },
      overpack2x10: {
        large: 18,
        medium: 12,
        small: 8
      },
      overpack6x1: {
        large: 18,
        medium: 12,
        small: 8
      }
    }
    var overpackList = {};
    for (var i in boxTotals) {
      console.log(i)
      switch (i) {

        case "4x1":
        while (boxTotals[i] > 0) {
          if (boxTotals[i] > overpackDims.overpack4x1.large) {
            overpackList.large += 1;
            boxTotals[i] - overpackDims.overpack4x1.large;
          } else if ( overpackDims.overpack4x1.small < boxTotals[i] < overpackDims.overpack4x1.medium) {
            overpackList.large += 1;
            boxTotals[i] - overpackDims.overpack4x1.medium
          } else if (4 < boxTotals[i] < overpackDims.overpack4x1.small) {
            overpackList.small += 1;
            boxTotals[i] - overpackDims.overpack4x1.small
          } else if (boxTotals[i] > 0) {
            overpackList.iop += 1;
            boxTotals[i] - 1
          }
          break;
        }
        case "4x4":
       
        while (boxTotals[i] > 0) {
          if (boxTotals[i] >overpackDims.overpack4x4.large ) {
            overpackList.large += 1;
            boxTotals[i] - 27
          } else if (8 < boxTotals[i] < overpackDims.overpack4x4.medium) {
            overpackList.large += 1;
            boxTotals[i] - 18
          } else if (4 < boxTotals[i] < overpackDims.overpack4x4.small) {
            overpackList.small += 1;
            boxTotals[i] - 8
          } else if (boxTotals[i] > 0) {
            overpackList.iop += 1;
            boxTotals[i] - 1
          }
          break;
        }
        case "2x10":
      
        while (boxTotals[i] > 0) {
          if (boxTotals[i] > 27) {
            overpackList.large += 1;
            boxTotals[i] - 27
          } else if (8 < boxTotals[i] < 18) {
            overpackList.large += 1;
            boxTotals[i] - 18
          } else if (4 < boxTotals[i] < 8) {
            overpackList.small += 1;
            boxTotals[i] - 8
          } else if (boxTotals[i] > 0) {
            overpackList.iop += 1;
            boxTotals[i] - 1
          }
          break;
        }
        case "6x1":
        
        while (boxTotals[i] > 0) {
          if (boxTotals[i] > 27) {
            overpackList.large += 1;
            boxTotals[i] - 27
          } else if (8 < boxTotals[i] < 18) {
            overpackList.large += 1;
            boxTotals[i] - 18
          } else if (4 < boxTotals[i] < 8) {
            overpackList.small += 1;
            boxTotals[i] - 8
          } else if (boxTotals[i] > 0) {
            overpackList.iop += 1;
            boxTotals[i] - 1
          }
          break;
        }
      }
    }
    console.log(boxTotals)
    console.log(overpackList)
  })
  
})