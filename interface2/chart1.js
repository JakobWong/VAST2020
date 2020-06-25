// for chart 1, generate input data by python.
// draw a bar chart based on the data
// there are 43 bars in total, each for a class
// the y value, or the height of a bar relates to number of people that has at least one image with that class

make_chart1();

function make_chart1(){
  var json_path = 'i3_new_data.json'

  //Defining the margin conventions
  var margin = {top: 50, right: 30, bottom: 50, left: 70},
      width = 1200 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  //define svg
  var svg = d3.select("#bloc2")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + 2* margin.bottom)
              .append("g")
              .attr("transform", "translate(0, " + margin.top+")")
   

  var labels  = ["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
                "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
                "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
                "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
                "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
                "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
                "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
                "pinkCandle", "vancouverCards", "hairRoller"]

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            // .bandwidth()
            .padding(0.1);

  var y = d3.scaleLinear()
            .range([height, 0]);

  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    var label_person_array = {}

    labels.forEach(function(d){
      label_person_array[d] = [];
    })

    data.forEach(function(d,i){
      var person = d.Person;
      var label_list = d.CorrectLabel;
      label_list.forEach(function(label){
        if (!label_person_array[label].includes(person)) {
        label_person_array[label].push(person);
        } 
      })
    })

    var data_for_chart1 = [];
    labels.forEach(function(d){
      data_for_chart1.push({"Label":d, "NumPerson": label_person_array[d].length});
    })

    data_for_chart1.sort(function(a,b){return a.NumPerson - b.NumPerson;})

    // Scale the range of the data in the domains
    x.domain(data_for_chart1.map(function(d) { return d.Label; }));
    // var yMax = d3.max(data_for_chart1,function(d){return d.NumPerson;})
    y.domain([0, 14]);


    svg.selectAll("bar")
      .data(data_for_chart1)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.Label); })
      .attr("width", x.bandwidth())
      .attr("y", function(d,i) { return y(d.NumPerson); })
      .attr("height", function(d) { return height - y(d.NumPerson); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10))
      .selectAll("text")  
        .attr("y", 10)
        .attr("x", 10)
        .style('font-size','14')
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    //Draw y axis and label
    bloc1Svg = d3.select("#bloc1").append("svg");
    bloc1Svg.attr("height",height + margin.top + margin.bottom)
      .attr("width",margin.left)
      .append("g")
      .attr("transform", "translate(70,"+ margin.top+")")
      .attr("class", "y-axis ")
      .call(d3.axisLeft(y));
    bloc1Svg.append("line")
      .attr("x1",70)
      .attr("y1",margin.top)
      .attr("x2",70)
      .attr("y2",height+margin.bottom)
      .attr("stroke","black")
      .attr("stroke-width","2")
    bloc1Svg.append("g")
      .attr("transform","translate(30,"+height*.65+")")
      .append("text") 
      .attr("x",0)
      .attr("y",0)
      .attr('text-anchor','middle')
      .style("font-size","18px")
      .attr("transform", "rotate(-90)")
      .text("Number of people with this item")

    // Draw the top and right-side outlines of the bar chart
    svg.append("line")
      .attr("x1",0)
      .attr("y1",0)
      .attr("x2",width)
      .attr("y2",0)
      .attr("stroke","black")
      .attr("stroke-width","1");
    svg.append("line")
      .attr("x1",width)
      .attr("y1",0)
      .attr("x2",width)
      .attr("y2",height)
      .attr("stroke","black")
      .attr("stroke-width","1");
  });
}