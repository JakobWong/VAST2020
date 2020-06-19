// for chart 1, generate input data by python.
// draw a bar chart based on the data
// there are 43 bars in total, each for a class
// the y value, or the height of a bar relates to number of people that has at least one image with that class

make_chart3();

function make_chart3(){
  var json_path = 'i3_new_data.json'

  //Defining the margin conventions
  var width = 2400, height = 1000;

  var margin = {top: 20, bottom: 20, left: 20, right: 20};

  //define svg
  var svg = d3.select("#ontology_graph")
              .attr("class","mainchart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + " , " + margin.top + ")")

  var force = d3.forceSimulation() 
                .force("charge", d3.forceManyBody().strength(-800).distanceMin(100).distanceMax(1000)) 
                .force("link", d3.forceLink().id(function(d) { return d.id })) 
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("y", d3.forceY(0.001))
                .force("x", d3.forceX(0.001))

  var color = function (group) {
      if (group == 1) {
          return "#aaa"
      } else if (group == 2) {
          return "#fbc280"
      } else {
          return "#405275"
      }
  }

  function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.5).restart();
      d.fx = d.x;
      d.fy = d.y;
  }
  
  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }
  
  function dragended(d) {
      if (!d3.event.active) force.alphaTarget(0.5);
      d.fx = null;
      d.fy = null;
  } 

  var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
  
  var people = ["Person1", "Person10", "Person11", "Person12", "Person13", 
              "Person14", "Person15", "Person16", "Person17", "Person18", 
              "Person19", "Person2", "Person20", "Person21", "Person22", 
              "Person23", "Person24", "Person25", "Person26", "Person27", 
              "Person28", "Person29", "Person3", "Person30", "Person31", 
              "Person32", "Person33", "Person34", "Person35", "Person36", 
              "Person37", "Person38", "Person39", "Person4", "Person40", 
              "Person5", "Person6", "Person7", "Person8", "Person9"]

  var labels  = ["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
                "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
                "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
                "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
                "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
                "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
                "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
                "pinkCandle", "vancouverCards", "hairRoller"]

  var data_for_chart3  = {"nodes":[],"links":[]};

  people.forEach(function(person){
    data_for_chart3["nodes"].push({
      "id": person,
      "group":1
    })
  })

  labels.forEach(function(label){
    data_for_chart3["nodes"].push({
      "id": label,
      "group":2
    })
  })

  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    var person_label_table = {};

    people.forEach(function(person){
      person_label_table[person] = {};

      labels.forEach(function(label){
        person_label_table[person][label] = 0;
      })
    })

    data.forEach(function(d,i){
      var person = d.Person;
      var label_list = d.CorrectLabel;
      label_list.forEach(function(label){
        person_label_table[person][label] += 1;
      })
    })

    people.forEach(function(person){
      labels.forEach(function(label){
        var value = person_label_table[person][label];
        if(value){
          data_for_chart3["links"].push({
            "source": person,
            "target": label,
            "value": person_label_table[person][label]
          })
        }
      })
    })

    force.nodes(data_for_chart3.nodes) 
         .force("link")
         .links(data_for_chart3.links)

    var link = svg.selectAll(".link")
                  .data(data_for_chart3.links)
                  .enter()
                  .append("line")
                  .attr("class", "link");
 
    var node = svg.selectAll(".node")
                  .data(data_for_chart3.nodes)
                  .enter().append("g")
                  .attr("class", "node")
                  .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended))

    console.log(data_for_chart3.links)
    node.append('circle')
        .attr("id",function(d){return "c" + d.id})
        .attr('r', 13)
        .attr('fill', function (d) {
            return color(d.group);
        })
        .on("mouseover",function(d){
          if (d.group == 1){
            // search for all labels that the person has
            var label_list = [];
            var label_value_dict = {};
            data_for_chart3.links.forEach(function(link){
              // console.log(link)
              if (link.source.id == d.id){
                label_list.push(link.target.id);
                label_value_dict[link.target.id] = link.value;
              }
            })

            var maxValue = 0;
            for (var label in label_value_dict){
              if(label_value_dict[label] > maxValue){
                maxValue = label_value_dict[label]
              }
            }

            label_list.forEach(function(label){
              d3.selectAll("#c"+label)
                .attr('r',20)
                .attr('fill',"#fb8072")
                .attr('opacity',label_value_dict[label]/maxValue)
            })

            var person_list = [];
            var person_value_dict = {};
            label_list.forEach(function(label){
              data_for_chart3.links.forEach(function(link){
                if(link.target.id == label){
                  person_list.push(link.source.id);
                  person_value_dict[link.source.id] = link.value;
                }
              })
            })

            var maxValue = 0;
            for (var person in person_value_dict){
              if(person_value_dict[person] > maxValue){
                maxValue = person_value_dict[person]
              }
            }

            person_list.forEach(function(person){
              d3.selectAll("#c"+person)
                .attr('r',20)
                .attr('fill',"#8dd3c7")
                .attr('opacity',person_value_dict[person]/maxValue)
            })

          }

          d3.select(this)
            .attr('fill',"gold")
        })
        .on('mouseout',function(d){
          labels.forEach(function(label){
            d3.select('#c'+label)
              .attr('r', 13)
              .attr('fill', function (d) {return color(2);})
              .attr('opacity',1.0)
          })

          people.forEach(function(person){
            d3.select('#c'+person)
              .attr('r', 13)
              .attr('fill', function (d) {return color(1);})
              .attr('opacity',1.0)
          })
        })

    node.append("text")
        .attr("dx", -18)
        .attr("dy", 8)
        .style("font-family", "overwatch")
        .style("font-size", "18px")
        .text(function (d) {
            return d.id
        });

    force.on("tick", function () {
        link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });

  });
}