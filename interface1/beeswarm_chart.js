var json_path = 'new_data.json';

//Defining the margin conventions
var margin = {top: 50, right: 30, bottom: 50, left: 100},
    width = 6000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// Define y Axis
var y = function(d) { return d.Score; };

//Saving the apllied x scale in a variable  
var yValue = function(d) { return yScale(y(d)); };

//Y scale
var yScale = d3.scale.linear()
               .domain([0.25002, 1])
               .range([height*0.9, 0]);

//Y axis    
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left");  

//Draw y axes
d3.select("#yAxis")
  .append("svg")
  .attr("height",height + margin.top + margin.bottom)
  .attr("width",margin.left)
  .append("g")
  .attr("transform", "translate(70,"+ margin.top+")")
  .attr("class", "y-axis ")
  .call(yAxis)
  .selectAll(".tick line")
  .attr("stroke-dasharray", "1, 2");  

// Define labels
var labels = ["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
              "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
              "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
              "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
              "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
              "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
              "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
              "pinkCandle", "vancouverCards", "hairRoller"]

// Define xAxis
var x = function(d) { return d.Label; };
       
//X scale
var xScale = d3.scale.ordinal()
             .domain(labels)
             .rangePoints([0, width]);

//Saving the apllied x scale in a variable  
var xValue = function(d) { return xScale(x(d)) + xScale.rangeBand()/2; };

//X axis
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom");  

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


//Container
var svg = d3.select("#beeswarm")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 50)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//Draw x axes
svg.append("g")
   .attr("class", "x-axis ")
   .attr("transform", "translate(0," + (height)+ ")")
   .call(xAxis)
   .selectAll("text")
   // .attr("dx", width)
   .attr("dy", -6)
   .style("font-size", "15px")
   .style("text-anchor", "center")

//Defining the forcement 
var bubbleChart = d3.forceChart()
                    .size([height, width])
                    .x(xValue)  
                    .y(yValue)
                    .yGravity(2)    
                    .xGravity(1/3);

// initialize new_data as an empty array. new_data is used to return modified data
var new_data = [];

// read data
d3.json(json_path, function(error, data) {
  
  if (error) throw error;

  // copy every element of data to new_data
  data.forEach(function(d,i){
    d.id = i;
    new_data.push({"FileName":d.FileName, "Label":d.Label,
                   "left":d.left, "top":d.top, 
                   "Width":d.Width,"Height":d.Height,
                   "Status":d.Status,"Score":d.Score,
                   "id":d.id, "Person":d.Person, "Pic": d.Pic});
  })

  console.log(new_data.filter(function(d){return d.Status == "Incorrect"}))

  //Draw bubbles
  svg.append("g")
     .call(bubbleChart, new_data)
     .attr("class", "bubbles")
     .selectAll(".node")
     .append("circle")
     .attr("class",function(d){return d.Label;})
     .attr("id", function(d){return "c" + d.id;})
     .attr("r", function(d) { return d.r0; })
     .attr("fill", function(d) { return colorScale(d.Label)})
     .style("stroke-width", 2.0)
     .style("stroke", function(d){ 
      if (d.Status == "Incorrect"){ console.log(d); return "red";}
      else if (d.Status == "Correct"){ return "green";}
      return "transparent";});

  // make a list of label images and attach them to the corresponding ticks of x axis
  var label_image_list = [];
  labels.forEach(function(label){
    label_image_list.push({
      "img":"MC2-Image-Data/TrainingImages/"+label+"/"+label+"_1.jpg", 
      "label": label,
      "isSelected":false});
  })

  var exmaple_images = svg.select(".x-axis").selectAll(".tick")
                         .data(label_image_list)
                         .append("svg:image")
                         .attr("xlink:href", function (d) { return d.img ; })
                         .attr("width", 100)
                         .attr("height", 80)
                         .attr("x", -50)
                         .attr("y", 10)

  var image_borders = svg.select(".x-axis").selectAll(".tick")
                   .append('rect')
                   .attr('transform',"translate(-50,15)")
                   .attr('class', 'image-border')
                   .attr('width', 100)
                   .attr('height', 70);

  image_borders.on('click', function(d){
    if (!d.isSelected){
      d.isSelected = !d.isSelected;
      d3.select(this)
      .style('stroke',"gold")
      .style('stroke-width',"10");
      var selected_subset = new_data.filter(function(dd){return dd.Label == d.label});

      show_gallery(selected_subset, d.label);
    }
    else{
      d.isSelected = !d.isSelected;
      d3.select(this)
        .style('stroke','transparent');


      remove_gallery(d.label);
    }
  })


})
