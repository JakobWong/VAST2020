var json_path = 'q1.json';

//Defining the margin conventions
var margin = {top: 50, right: 30, bottom: 50, left: 100},
      width = 6000 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

//Container
var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the img_tooltip
var image_div = d3.select("#image_div") 
                  .attr("class", "tooltip")       
                  .style("opacity", 0);

var img = new Image();
var c = document.getElementById("my_canvas");
var ctx = c.getContext("2d");

//Global variables 
var x = function(d) { return d.Label; };
var y = function(d) { return d.Score; };
       
//X scale
var xScale = d3.scale.ordinal()
             .domain(["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
                      "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
                      "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
                      "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
                      "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
                      "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
                      "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
                      "pinkCandle", "vancouverCards", "hairRoller"])
             .rangePoints([0, width]);

//Y scale
var yScale = d3.scale.linear()
               .domain([0, 1])
               .range([height, 0]);

// colorScale
var colorScale = d3.scale.category20b()
             .domain(["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
                      "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
                      "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
                      "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
                      "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
                      "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
                      "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
                      "pinkCandle", "vancouverCards", "hairRoller"])

//Saving the apllied x scale in a variable  
var yValue = function(d) { return yScale(y(d)); };
 
//Saving the apllied x scale in a variable  
var xValue = function(d) { return xScale(x(d)) + xScale.rangeBand()/2; };
       
//X axis
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom"); 
  
//Y axis    
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left");       

//Defining the forcement 
var bubbleChart = d3.forceChart()
                    .size([height, width])
                    .x(xValue)  
                    .y(yValue)
                    .yGravity(2)    
                    .xGravity(1/3);

var new_data = [];


read_all_data();

is_correct_data_only = false;

function correct_data_only(){

  if (!is_correct_data_only){

    var button = document.getElementById("correctDataViewer");
    button.style.backgroundColor = "green";

    is_correct_data_only = true;

    //Draw bubbles
    svg.selectAll("g.node")
       .select("circle")
       .attr("opacity",function(d){return (d.Status == "Correct")? 1.0: 0.0;})

  }else{
    is_correct_data_only = false;
    var button = document.getElementById("correctDataViewer");
    button.style.backgroundColor = "white";
    
    //Draw bubbles
    svg.selectAll("g.node")
       .select("circle")
       .attr("opacity",function(d){return (d.Status == "Incorrect")? 0.3: 1.0;})

  }
}


is_incorrect_data_only = false;

function incorrect_data_only(){

  if (!is_incorrect_data_only){

    var button = document.getElementById("incorrectDataViewer");
    button.style.backgroundColor = "green";

    is_incorrect_data_only = true;

    //Draw bubbles
    svg.selectAll("g.node")
       .select("circle")
       .attr("opacity",function(d){return (d.Status == "Incorrect")? 1.0: 0.0;})

    svg.selectAll("g.node")
       .on('contextmenu', d3.contextMenu(menu2, {
          onOpen: function() {},
          onClose: function() {},
          position: function(d, i) {
            var elm = this;
            var bounds = elm.getBoundingClientRect();
            // eg. align bottom-left
            return {
              top: bounds.top,
              left: bounds.left
            }
          }
        }))

  }else{
    is_incorrect_data_only = false;
    var button = document.getElementById("incorrectDataViewer");
    button.style.backgroundColor = "white";
    
    //Draw bubbles
    svg.selectAll("g.node")
       .select("circle")
       .attr("opacity",function(d){return (d.Status == "Incorrect")? 0.3: 1.0;})

    svg.selectAll("g.node")
       .on('contextmenu', d3.contextMenu(menu, {
          onOpen: function() {},
          onClose: function() {},
          position: function(d, i) {
            var elm = this;
            var bounds = elm.getBoundingClientRect();
            // eg. align bottom-left
            return {
              top: bounds.top,
              left: bounds.left
            }
          }
        }))

  }
}

function read_all_data(){
  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    data.forEach(function(d){
      new_data.push({"FileName":d.FileName, "Label":d.Label,
                     "left":d.left, "top":d.right, 
                     "Width":d.Width,"Height":d.Height,
                     "Status":d.Status,"Score":d.Score});
    })

    console.log(data)
             
    //Draw x axes
    svg.append("g")
       .attr("class", "x-axis ")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .append("text")
       .attr("dx", width)
       .attr("dy", -6)
       .style("text-anchor", "end")
       // .text("Score");
     
    //Draw y axes
    svg.append("g")
       .attr("class", "y-axis ")
       .attr("transform", "translate(-50," + 0 + ")")
       .call(yAxis)
       .selectAll(".tick line")
       .attr("x2", width)
       .attr("stroke-dasharray", "1, 2");
    
    // Draw example images
    svg.append("g")
       .attr("class", "y-axis ")
       .attr("transform", "translate(-50," + 0 + ")")
       .call(yAxis)
       .selectAll(".tick line")
       .attr("x2", width)
       .attr("stroke-dasharray", "1, 2");

    // // Draw legend
    // svg.append("g")
    //    .call(legend);
                
    //Draw bubbles
    svg.append("g")
       .call(bubbleChart, data)
       .attr("class", "bubbles")
       .selectAll(".node")
       .append("circle")
       .attr("r", function(d) { return d.r0; })
       .attr("fill", function(d) { return colorScale(d.Label)})
       .attr("opacity", function(d){ return (d.Status == "Incorrect") ? 0.3 : 1.0});

    var labels = ["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
                        "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
                        "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
                        "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
                        "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
                        "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
                        "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
                        "pinkCandle", "vancouverCards", "hairRoller"]

    var trainingset = [];
    labels.forEach(function(label){
      trainingset.push({"img":"MC2-Image-Data/TrainingImages/"+label+"/"+label+"_1.jpg"});
    })

    var ticks = svg.select(".x-axis").selectAll(".tick")
                   .data(trainingset)
                   .append("svg:image")
                   .attr("xlink:href", function (d) { return d.img ; })
                   .attr("width", 100)
                   .attr("height", 100)
                   .attr("x", -60)
                   .attr("y", -100)
                   .style("opcaity",0.7)

  
  console.log(new_data); 
  });
}