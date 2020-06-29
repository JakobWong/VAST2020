// for chart 1, generate input data by python.
// draw a bar chart based on the data
// there are 43 bars in total, each for a class
// the y value, or the height of a bar relates to number of people that has at least one image with that class

make_chart3();

function make_chart3(){
  var json_path = 'i3_new_data.json'

  //Defining the margin conventions
  var width = 800, height = 800;

  var margin = {top: 20, bottom: 20, left: 20, right: 20};

  //define svg
  var svg = d3.select("#graph_display")
              .attr("class","mainchart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(0,0)")

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

  var hidden_node_list = {};
  people.forEach(function(person){
    hidden_node_list[person] = false;
  })
  labels.forEach(function(label){
    hidden_node_list[label] = false;
  })

  var people_images_div = d3.select('#people_images');

  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    var nested_data =  d3.nest()
                         .key(function(d) { return d.Person; })
                         .entries(data);

    console.log(nested_data)

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

    var person_numphoto_array = {}
    people.forEach(function(person){
      person_numphoto_array[person] = 0;
    })

    data.forEach(function(d,i){
      person_numphoto_array[d.Person] += 1;
    })

    people.forEach(function(person){
      labels.forEach(function(label){
        var value = person_label_table[person][label];
        if(value){
          data_for_chart3["links"].push({
            "source": person,
            "target": label,
            "value": person_label_table[person][label],
            "normalized_value": person_label_table[person][label] / person_numphoto_array[person]
          })
        }
      }) 
    })

    force.nodes(data_for_chart3.nodes) 
         .force("link")
         .links(data_for_chart3.links)

    var min_value = d3.min(data_for_chart3.links.map(function(d){return d.value}))
    var max_value = d3.max(data_for_chart3.links.map(function(d){return d.value}))

    var thickness = d3.scaleLinear().domain([0,1]).range([1,15]);


    var link = svg.selectAll(".link")
                  .data(data_for_chart3.links)
                  .enter()
                  .append("line")
                  .attr("id",function(d){return "link"+d.source.id+"_"+d.target.id})
                  .attr("class", "link")
                  .style("stroke-width", function(d){return thickness(d.normalized_value)})
                  
    var node = svg.selectAll(".node")
                  .data(data_for_chart3.nodes)
                  .enter().append("g")
                  .attr("class", "node")
                  .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended))

    var num_people_of_label = {};
    labels.forEach(function(label){
      num_people_of_label[label] = 0;
      people.forEach(function(person){
        if(person_label_table[person][label]){
          num_people_of_label[label] += 1
        }
      })
    })

    node.append('circle')
        .attr("id",function(d){return "c" + d.id})
        .attr('r', function(d){
          return (d.group == 1)? 13 : 2 * num_people_of_label[d.id]})
        .attr('fill', function (d) {
            return color(d.group);
        })
        .attr('opacity',1.0)
        .on("mouseover",function(d){
          if(!hidden_node_list[d.id]){
            if (d.group == 1){
            // search for all labels that the person has
            var label_list = [];
            var label_value_dict = {};
            data_for_chart3.links.forEach(function(link){
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
                .attr('r',2 * num_people_of_label[label])
                .attr('fill',"#fb8072")
            })

            var people_list = [];
            var person_value_dict = {};

            data_for_chart3.links.forEach(function(link){
              if (label_list.includes(link.target.id)){
                people_list.push(link.source.id);
                person_value_dict[link.source.id] = link.value;
              }
              else{
                d3.select("#link"+link.source.id+"_"+link.target.id)
                  .attr('opacity',0)

                d3.selectAll("#c"+link.source.id)
                  .attr('opacity',0)

                d3.selectAll("#c"+link.target.id)
                  .attr('opacity',0)

                d3.selectAll("#text"+link.target.id)
                  .attr('opacity',0)

                d3.selectAll("#text"+link.source.id)
                  .attr('opacity',0)

                d3.selectAll("#tspan"+link.source.id+"_"+"number")
                  .attr('opacity',0)
              }
            })

            var maxValue = 0;
            for (var person in person_value_dict){
              if(person_value_dict[person] > maxValue){
                maxValue = person_value_dict[person]
              }
            }

            people_list.forEach(function(person){
              d3.selectAll("#c"+person)
                .attr('r',13)
                .attr('fill',"#8dd3c7")
                .attr('opacity',1.0)

              d3.selectAll("#text"+person)
                .attr('opacity',1.0)
            })

            }
            if (d.group == 2){
          
              var people_list = [];
              data_for_chart3.links.forEach(function(link){
                
                if (link.target.id == d.id){
                  people_list.push(link.source.id);
                }
              })

              data_for_chart3.links.forEach(function(link){
                if (link.target.id != d.id || !people_list.includes(link.source.id)){
                  d3.select("#link"+link.source.id+"_"+link.target.id)
                    .attr('opacity',0)

                  d3.selectAll("#c"+link.source.id)
                    .attr('opacity',0)

                  d3.selectAll("#c"+link.target.id)
                    .attr('opacity',0)

                  d3.selectAll("#text"+link.target.id)
                    .attr('opacity',0)

                  d3.selectAll("#text"+link.source.id)
                    .attr('opacity',0)

                  d3.selectAll("#tspan"+link.source.id+"_"+"number")
                    .attr('opacity',0)
                }
              })

              var numbers = [];
              people_list.forEach(function(person){
                d3.selectAll("#c"+person)
                  .attr('r',13)
                  .attr('fill',"#8dd3c7")
                  .attr('opacity',1.0)

                d3.selectAll("#text"+person)
                  .attr('opacity',1.0)

                d3.selectAll("#tspan"+person+"_"+"number")
                  .attr('opacity',1.0)
                  .text(function(){
                    return person_label_table[person][d.id] + "/" + person_numphoto_array[person]
                  })

                numbers.push(person_label_table[person][d.id]/person_numphoto_array[person])
              })

              d3.selectAll("#tspan"+d.id+"_"+"number")
                .attr('opacity',1.0)
                .text(function(){
                  return math.mean(numbers).toFixed(5) + " +/- " + math.std(numbers).toFixed(5);
                })

              showImage(d.id);
              console.log(data_for_chart3.links)
              showPersonImages(people_list,d.id);
          }

            d3.select(this)
              .attr('fill',"gold")

          }
        })
        .on('mouseout',function(d){
          labels.forEach(function(label){
            d3.select('#c'+label)
              .attr('r', function(){return 2 * num_people_of_label[label]})
              .attr('fill', function (d) {return color(2);})
              .attr('opacity',1.0)
          })

          people.forEach(function(person){
            d3.select('#c'+person)
              .attr('r', 13)
              .attr('fill', function (d) {return color(1);})
              .attr('opacity',1.0)
          })

          data_for_chart3.links.forEach(function(link){
            d3.select("#link"+link.source.id+"_"+link.target.id)
                  .attr('opacity',1.0)

            d3.selectAll("#c"+link.source.id)
              .attr('opacity',1.0)

            d3.selectAll("#c"+link.target.id)
              .attr('opacity',1.0)

            d3.selectAll("#text"+link.target.id)
              .attr('opacity',1.0)

            d3.selectAll("#text"+link.source.id)
              .attr('opacity',1.0)

            d3.selectAll("#tspan"+link.source.id+"_"+"number")
              .attr('opacity',0)

            d3.selectAll("#tspan"+link.target.id+"_"+"number")
                .attr('opacity',0)

          })

          var min_value = document.getElementById("minNumEdge").value
          var max_value = document.getElementById("maxNumEdge").value

          update_graph_by_min_max(min_value,max_value)
        })

    var showImage = function(label){
      d3.select('#hover_image')
        .attr('src',"ExampleImages/"+label+".jpg")
        .style('max-width','220px')
        .style('width',"220px")
    }

    var showPersonImages = function(people_list,label){
      var numPerson = people_list.length;
      people_images_div.selectAll("div").remove();

      for (var i = 0; i < people_list.length; i++) {
        var person = people_list[i]

        var person_div = people_images_div.append('div')
                         // .style('flex', 1.0/numPerson)
                         .style('max-width',1.0/numPerson)
                         .style('padding','0 4px')
                         .append('text')
                         .style('font-size','20px')
                         .text(person)

        var j = 0
        for (; j < nested_data.length; j++){
          if (nested_data[j].key == person)
            break;
        }

        var image_list = nested_data[j].values;
        for(j = 0; j < image_list.length; j++){
          var caption_path = image_list[j].Path.split('.')[0] + 'caption.txt'
          var img = person_div.append('img')
                     .style('margin-top', '8px')
                     .style('vertical-align','middle')
                     .style('width','100%')
                     .attr('src',image_list[j].Path)
                     .style('border',function(){
                      if (image_list[j].CorrectLabel.includes(label))
                        return '4px solid gold'
                      else
                        return '4px solid transparent'
                     })
          if (caption_text[image_list[j].Person+"_"+image_list[j].Pic]){
            person_div.append('text')
                      .text(caption_text[image_list[j].Person+"_"+image_list[j].Pic])
            // console.log(caption_text[image_list[j].Person+"_"+image_list[j].Pic])
          }
          
        }

      }

    }

    d3.select("#minNumEdge").on("input", function() {
      var max_value = document.getElementById("maxNumEdge").value
      update_graph_by_min_max(+this.value,max_value);
    });

    d3.select("#maxNumEdge").on("input", function() {
      var min_value = document.getElementById("minNumEdge").value
      update_graph_by_min_max(min_value,+this.value);
    });

    var update_graph_by_min_max = function(min_value, max_value){
      var hidden_label_list = [];
      data_for_chart3.links.forEach(function(link){
        var label = link.target.id;
        if (num_people_of_label[link.target.id] < min_value){

          d3.select("#link"+link.source.id+"_"+link.target.id)
            .attr('opacity',0)

          d3.selectAll("#c"+link.target.id)
            .attr('opacity',0)

          d3.selectAll("#text"+link.target.id)
            .attr('opacity',0)
          hidden_label_list.push(label);

          hidden_node_list[link.source.id] = true;
          hidden_node_list[link.target.id] = true;
        }
        else if (num_people_of_label[link.target.id] > max_value) {
          d3.select("#link"+link.source.id+"_"+link.target.id)
            .attr('opacity',0)

          d3.selectAll("#c"+link.target.id)
            .attr('opacity',0)

          d3.selectAll("#text"+link.target.id)
            .attr('opacity',0)
          hidden_label_list.push(label);

          hidden_node_list[link.source.id] = true;
          hidden_node_list[link.target.id] = true;
        }
        else{
          d3.select("#link"+link.source.id+"_"+link.target.id)
            .attr('opacity',1.0)

          d3.selectAll("#c"+link.target.id)
            .attr('opacity',1.0)

          d3.selectAll("#text"+link.target.id)
            .attr('opacity',1.0)


          hidden_node_list[link.source.id] = false;
          hidden_node_list[link.target.id] = false;
        }
    })

    // hide isolated people nodes
    people.forEach(function(person){
      var num_edges = 0;
      var num_edges_to_hide = 0;
      labels.forEach(function(label){
        if (person_label_table[person][label]){
          num_edges += 1;
          if(hidden_label_list.includes(label)){
            num_edges_to_hide += 1;
          }
        }
      })
      if (num_edges == num_edges_to_hide){
        
        d3.selectAll("#c"+person)
          .attr('opacity',0)

        d3.selectAll("#text"+person)
          .attr('opacity',0)
      }
    })

      
    }
    

    node.append("text")
        .append("tspan")
        .attr('id',function(d){return "text"+d.id})
        .attr("dx", -18)
        .attr("dy", 8)
        .style("font-family", "overwatch")
        .style("font-size", "18px")
        .text(function (d) {return d.id})

    node.selectAll("text")
        .append("tspan")
        .attr('id',function(d){return "tspan"+d.id+"_"+"number"})
        .attr("dx", -36)
        .attr("dy", 16)
        .style("font-family", "overwatch")
        .style("font-size", "18px")
        .text(" ")

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