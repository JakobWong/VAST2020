var svg = d3.select("svg"),
    margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

// Setup x
var x = d3.scaleLog().rangeRound([0, width]);

var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// initialization
d3.csv("/data/q1.csv", function(error, data){

    if (error) throw error;

    data = data.filter(function(d){return d.Label == "birdCall"})

    // change string from csv into number format
    data.forEach(function(d){
      d.Score = +d.Score+1e-6;
      d.left = +d.left;
      d.top = +d.top;
      d.Width = +d.Width;
      d.Height = +d.Height;
      d.id = +d[""];
    })


    x.domain(d3.extent(data, function(d) { return d.Score; }));

    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function(d) { return x(d.Score); }).strength(1))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(4))
        .stop();

    for (var i = 0; i < 120; ++i) simulation.tick();

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20+".0s"));

    var voronoi_data = d3.voronoi()
                        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
                        .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .polygons(data)
                        
    var cell = g.append("g")
        .attr("class", "cells")
      .selectAll("g").data(voronoi_data,function(d){ return d.data.id;}).enter().append("g")
        .on("click", function(d){read_image(d.data.FileName, d.data.left,d.data.top,d.data.Width,d.data.Height); })
    
    cell.append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return d.data.x; })
        .attr("cy", function(d) { return d.data.y; });

    // voroni
    cell.append("path")
        .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

    cell.append("title")
        .text(function(d) { return d.data.Label + "\n" + d.data.Score + "\n" + d.data.FileName; });
  });

function read_label(){
  var e = document.getElementById("labelSelecter");
  var selectedLabel = e.options[e.selectedIndex].value;
  update_by_label(selectedLabel)
  var c = document.getElementById("example-image")
  var ctx = c.getContext("2d")  
  var img = new Image()
  img.src = "MC2-Image-Data/TrainingImages/".concat(selectedLabel).concat('/').concat(selectedLabel).concat('_1.jpg');
  img.onload = function() {
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

function read_image(path,x,y,w,h){
  var resize_scale = 5;
  var c = document.getElementById("my-canvas")
  var ctx = c.getContext("2d")  
  var img = new Image()
  img.src = path
  img.onload = function() {
    ctx.canvas.width = math.ceil(img.width/resize_scale);
    ctx.canvas.height = math.ceil(img.height/resize_scale);
    var xx = math.ceil(x/resize_scale);
    var yy = math.ceil(y/resize_scale);
    var ww = math.ceil(w/resize_scale);
    var hh = math.ceil(h/resize_scale);
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.beginPath();
      ctx.rect(xx,yy,ww,hh);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 5;
      ctx.stroke();
  }
}

function update_by_label(label){

    d3.csv("/data/q1.csv", function(error, data){

      if (error) throw error;

      data = data.filter(function(d){return d.Label == label})

      // change string from csv into number format
      data.forEach(function(d){
        d.Score = +d.Score+1e-6;
        d.left = +d.left;
        d.top = +d.top;
        d.Width = +d.Width;
        d.Height = +d.Height;
        d.id = +d[""];
      })

      data.sort(function(a,b) { return +a.Score - +b.Score })


      x.domain(d3.extent(data, function(d) { return d.Score; }));

      var simulation = d3.forceSimulation(data)
          .force("x", d3.forceX(function(d) { return x(d.Score); }).strength(1))
          .force("y", d3.forceY(height / 2))
          .force("collide", d3.forceCollide(4))
          .stop();

      for (var i = 0; i < 120; ++i) simulation.tick();

      g.selectAll("g.axis.axis--x")
       .call(d3.axisBottom(x).ticks(20));

      var voronoi_data = d3.voronoi()
                          .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; })
                          .polygons(data)
      console.log(voronoi_data)
                          
      var cell = g.select("g.cells")
                .selectAll("g")
                  .data(voronoi_data,function(d){ return d.data.id;});

      cell.exit().remove();

      cell.enter().append("g")
          .on("click", function(d,i){ 
            read_image(d.data.FileName, d.data.left,d.data.top,d.data.Width,d.data.Height); })

      cell = g.select("g.cells")
              .selectAll("g")

      cell.append("circle")
          .attr("r", 3)
          .attr("cx", function(d) { return d.data.x; })
          .attr("cy", function(d) { return d.data.y; });

      // voroni
      cell.append("path")
          .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

      cell.append("title")
          .text(function(d) { return d.data.Label + "\n" + d.data.Score + "\n" + d.data.FileName; });
      
    });
}