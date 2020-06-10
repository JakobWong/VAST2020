// for chart 1, generate input data by python.
// draw a bar chart based on the data
// there are 43 bars in total, each for a class
// the y value, or the height of a bar relates to number of people that has at least one image with that class
 
make_chart2();

function make_chart2(){

  var json_path = 'new_data.json';

  //Defining the margin conventions
  var margin = {top: 50, right: 30, bottom: 50, left: 100},
      width = 1000 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
            .range([0, width]);

  var y = d3.scaleLinear()
            .range([height, 0]);

  //Container
  var svg = d3.select("#scattor_plot")
              .attr("class","mainchart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom + 50)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the div for the tooltip
  var div = d3.select("#scattor_plot").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0);

  // colorScale
  var color = d3.scaleOrdinal(d3.schemeCategory20)

  var people = ["Person1", "Person10", "Person11", "Person12", "Person13", 
              "Person14", "Person15", "Person16", "Person17", "Person18", 
              "Person19", "Person2", "Person20", "Person21", "Person22", 
              "Person23", "Person24", "Person25", "Person26", "Person27", 
              "Person28", "Person29", "Person3", "Person30", "Person31", 
              "Person32", "Person33", "Person34", "Person35", "Person36", 
              "Person37", "Person38", "Person39", "Person4", "Person40", 
              "Person5", "Person6", "Person7", "Person8", "Person9"]

  // create data for x axis
  var person_object_array = {};
  var person_numphoto_array = {};

  people.forEach(function(d){
    person_object_array[d] = [];
    person_numphoto_array[d] = 0;
  })

  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    data.forEach(function(d,i){
      // if object not added, add object
      if (!person_object_array[d.Person].includes(d.Label)){
        person_object_array[d.Person].push(d.Label);
      }
    })

    data.forEach(function(d,i){
      person_numphoto_array[d.Person] += 1;
    })

    var data_for_chart2 = [];

    people.forEach(function(person){
      data_for_chart2.push({
        "Person": person,
        "NumObject": person_object_array[person].length,
        "NumPhoto": person_numphoto_array[person]
      })
    })

    x.domain([d3.min(data_for_chart2,function(d){return d.NumObject;}),
              d3.max(data_for_chart2,function(d){return d.NumObject;})])

    y.domain([d3.min(data_for_chart2,function(d){return d.NumPhoto;}),
              d3.max(data_for_chart2,function(d){return d.NumPhoto;})])

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);
    
    svg.selectAll(".dot")
      .data(data_for_chart2)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5.0)
      .attr("cx", function(d) { return x(d.NumObject); })
      .attr("cy", function(d) { return y(d.NumPhoto); })
      .style("fill", function(d) { return color(d.Person); })
      .on("mouseover", function(d) {    
        div.transition()    
            .duration(200)    
            .style("opacity", .9);    
        div.html(d.Person + "<br>"  + "NumObject:" + d.NumObject + "<br>" + "NumPhoto:" + d.NumPhoto )  
           .style("left", (d3.event.pageX) + "px")   
           .style("top", (d3.event.pageY - 28) + "px");  
      })          
      .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
      });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Sepal Width (cm)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Sepal Length (cm)")
             
  });
}