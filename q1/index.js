var json_path = 'new_data.json';

//Defining the margin conventions
var margin = {top: 50, right: 30, bottom: 50, left: 100},
    width = 6000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

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
d3.select("#bloc1")
  .append("svg")
  .attr("height",height + margin.top + margin.bottom)
  .attr("width",margin.left)
  .append("g")
  .attr("transform", "translate(70,"+ margin.top+")")
  .attr("class", "y-axis ")
  .call(yAxis)
  .selectAll(".tick line")
  // .attr("x2", width)
  .attr("stroke-dasharray", "1, 2");

//Container
var svg = d3.select("#bloc2")
            .attr("class","mainchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 50)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// //Container for gallery
// var svg2 = d3.select("#my_exmaple_images")
//             .append("svg")
//             .attr("width", 1000)
//             .attr("height", 1000)
//             .append("g")
//             .attr("transform", "translate(" + margin.left + ",0)");

// Define the div for the img_tooltip
var img = document.createElement('img'); 

var image_div = d3.select("#image_div") 
                  .attr("class", "tooltip")       
                  .style("opacity", 0);

var c = document.getElementById("my_canvas");
var ctx = c.getContext("2d");

document.onclick = function(){
  ctx.clearRect(0,0,200,160)
}
var example_image_gallery = d3.select("my_example_images")

//Global variables 
var x = function(d) { return d.Label; };
// var y = function(d) { return d.Score; };
       
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
var xValue = function(d) { return xScale(x(d)) + xScale.rangeBand()/2; };
       
//X axis
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom");    

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
       .attr("opacity",function(d){ return (d.Status == "Correct")? 1.0: 0;})

  }else{
    is_correct_data_only = false;
    var button = document.getElementById("correctDataViewer");
    button.style.backgroundColor = "white";
    
    //Draw bubbles
    svg.selectAll("g.node")
       .select("circle")
       .attr("opacity",function(d){return 1.0;})

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
            var bodyRect = document.body.getBoundingClientRect();
            return {
              top: bounds.top - bodyRect.top,
              left: bounds.left - bodyRect.left
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
       .attr("opacity",function(d){return 1.0;})

    svg.selectAll("g.node")
       .on('contextmenu', d3.contextMenu(menu, {
          onOpen: function() {},
          onClose: function() {},
          position: function(d, i) {
            var elm = this;
            var bounds = elm.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();
            return {
              top: bounds.top - bodyRect.top,
              left: bounds.left - bodyRect.left
            }
          }
        }))

  }
}

function read_all_data(){
  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    // var min = 1.0;
    // data.forEach(function(d){
    //   if (d.Score < min && d.Score > 1e-6){
    //     min = d.Score;
    //   }
    // })
    // console.log(min)

    data.forEach(function(d,i){
      d.id = i;
      new_data.push({"FileName":d.FileName, "Label":d.Label,
                     "left":d.left, "top":d.top, 
                     "Width":d.Width,"Height":d.Height,
                     "Status":d.Status,"Score":d.Score,
                     "Id":d.id});
    })

    // console.log(data)
             
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
     

                
    //Draw bubbles
    svg.append("g")
       .call(bubbleChart, data)
       .attr("class", "bubbles")
       .selectAll(".node")
       .append("circle")
       .attr("class", function(d){return "c"+d.id;})
       .attr("r", function(d) { return d.r0; })
       .attr("fill", function(d) { return colorScale(d.Label)})
       .style("stroke-width", 2.0)
       .style("stroke", function(d){ 
        if (d.Status == "Incorrect"){
          return "red";
        }
        else if (d.Status == "Correct"){
          return "green";
        }
        return "transparent";});

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
      trainingset.push({"img":"MC2-Image-Data/TrainingImages/"+label+"/"+label+"_1.jpg", "label": label});
    })

    trainingset.forEach(function(d){
      d.isSelected = false;
    })

    var exmaple_images = svg.select(".x-axis").selectAll(".tick")
                   .data(trainingset)
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
                  show_gallery(d.label);
                }
                else{
                  d.isSelected = !d.isSelected;
                  d3.select(this)
                    .style('stroke','transparent');

                  remove_gallery();
                }
                })

    function show_gallery(label){

      var selected_subset = data.filter(function(d){return d.Label == label});
      var num_col = 60;
      var num_row = math.ceil(selected_subset.length / num_col);
      selected_subset.sort((a,b)=> b.Score - a.Score);

      //Container for gallery
      var bottom_div = d3.select("#my_example_images")
                             .style("overflow","scroll")
                             .style("height","400px")

      selected_subset.forEach(function(d){
        d.isSelected = false;})

      var selected_items = []

      var menu3 =  [
        {
          title: 'correctly classified',
          action: function() {
            for (var j = 0; j < selected_items.length; j++) {
              item = selected_subset[selected_items[j]]
              item_id = item.id;

              d3.select("circle."+ "c" + item_id)
                .attr("r",function(d){
                  d.Status = "Correct";
                  return d.r0;})
                .style("stroke","green")
                .style("stroke-width",2 + 4 * item.Score)                
                .attr("opacity",1)

              d3.select("img.img_" + item_id)
                .style('border',"10px solid green")

              new_data[item_id].Status = "Correct";
            }
            selected_items.splice(0,selected_items.length)
          },
        },
        {
          title: 'misclassified',
          action: function() {
            for (var j = 0; j < selected_items.length; j++) {
              item = selected_subset[selected_items[j]]
              item_id = item.id;

              d3.select("circle."+ "c" + item_id)
                .attr("r",function(d){
                  d.Status = "Incorrect";
                  return d.r0;})
                .style("stroke","red")
                .style("stroke-width",2 + 4 * item.Score)
                .attr("opacity",1)


              d3.select("img.img_" + item_id)
                .style('border',"10px solid red")

              new_data[item_id].Status = "Incorrect";
            }
            selected_items.splice(0,selected_items.length)
          }
        },
        {
          title: 'relabel',
          action: function() {
            var dropdown = document.getElementById('dropdownSelection');
            dropdown.onchange = function(){

              var e = document.getElementById("selectLabel");
              var text = e.options[e.selectedIndex].text; 
              selected_label = text;

              for (var j = 0; j < selected_items.length; j++) {
                item = selected_subset[selected_items[j]]
                item_id = item.id;

                d3.select("img.img_" + item_id)
                  .remove()

                new_data[item_id].Label = selected_label;
                new_data[item_id].Status = "Correct";
                new_data[item_id].Score = 0.95;
                console.log(new_data[item_id])
              }
              selected_items.splice(0,selected_items.length)
            }
            var modal = document.getElementById('relabelBtn');
            modal.click();
          }
        }
      ]
      
      bottom_div.selectAll('div')
                .data(selected_subset).enter()
                .append('img')
                .attr('src',function(d){return d.FileName})
                .attr('width',100)
                .attr('height', 80)
                .attr('class',function(d){return 'img_'+d.id;})
                .on('click',function(d,i){
                  if(!d.isSelected){
                    d.isSelected = !d.isSelected;
                    d3.select(this)
                      .style('border',"10px solid gold")

                    d3.select("circle." + "c"+d.id)
                      .style("stroke","gold")
                      .style("stroke-width", 5)
                      .attr("r", 15)
                      .attr("opacity",0.6);

                    selected_items.push(i);
                    console.log(selected_items)
                  }
                  else{
                    d.isSelected = !d.isSelected;
                    d3.select(this)
                    .style('border',"10px solid transparent")

                    d3.select("circle." + "c"+d.id)
                      .style("stroke",function(d){
                        if (d.Status == "Incorrect"){ return "red";}
                        else if (d.Status == "Correct"){ return "green";}
                        return "transparent";})
                      .attr("r", function(d){return d.r0;})
                      .attr("opacity",1.0);

                    var index = selected_items.indexOf(i);
                    selected_items.splice(index,1);
                    console.log(selected_items)
                  }
                })
                .on('mouseover',function(d){
                  var circle = d3.select("circle."+ "c" + d.id);
                  var bound = d3.select(circle.node().parentNode).node().getBoundingClientRect();
                  image_div.style("opacity", .85)
                           .style("left", (bound.left ) + "px")
                           .style("top", (bound.top) + "px")
                  //          .style("left", (d3.event.pageX) + "px")     
                  //          .style("top", (d3.event.pageY) + "px"); 

                  img.src = d.FileName;
                  img.onload = function() {
                    var x_ratio = math.ceil(img.width/w);
                    var y_ratio = math.ceil(img.height/h);

                    ctx.drawImage(img, 0, 0, w, h);
                    var box_left = math.ceil(+d.left/x_ratio);
                    var box_top = math.ceil(+d.top/y_ratio);
                    var box_width = math.ceil(+d.Width/x_ratio);
                    var box_height = math.ceil(+d.Height/y_ratio);
                    // ctx.beginPath();
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 5;
                    ctx.strokeRect(box_left,box_top,box_width,box_height);
                  }
                  })
                .on('contextmenu',d3.contextMenu(menu3, {
                  onOpen: function() {},
                  onClose: function() {},
                  position: function() {
                    var elm = this;
                    var bounds = elm.getBoundingClientRect();
                    var bodyRect = document.body.getBoundingClientRect();
                    console.log(bounds)
                    return {
                      top: bounds.top - bodyRect.top,
                      left: bounds.left - bodyRect.left
                    }
                  }
                }))

    }

    function remove_gallery(){
       var svg2 = d3.select("#my_example_images")
       svg2.selectAll("img").remove();
    }

  
  // console.log(new_data); 
  });
}