// for chart 1, generate input data by python.
// draw a bar chart based on the data
// there are 43 bars in total, each for a class
// the y value, or the height of a bar relates to number of people that has at least one image with that class

make_chart3();

function make_chart3(){
  var json_path = 'i3_new_data.json'

  //Defining the margin conventions
  var width = 900, height = 900;

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
          return "#265999"
      } else if (group == 2) {
          return "#CA9703"
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

  var r_people_node = 25;

  // Data loading 
  d3.json(json_path, function(error, data) {

    if (error) throw error;

    var nested_data =  d3.nest()
                         .key(function(d) { return d.Person; })
                         .entries(data);

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
                  .attr("id",function(d){return "link_"+d.source.id+"_"+d.target.id})
                  .attr("class", "link")
                  .style("stroke-width", function(d){return thickness(d.normalized_value)})
                  
    var node = svg.selectAll(".node")
                  .data(data_for_chart3.nodes)
                  .enter().append("g")
                  .attr("class", function(d){
                    return (d.group == 1)? "people node": "object node";
                  })
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

    d3.selectAll('.people').append('circle')
        .attr("id",function(d){return "c_" + d.id})
        .attr('r', function(d){ return r_people_node})
        .attr("class","peopleCircle")
        .attr('opacity',1.0)
        .on("mouseover",function(d){ highlightPeopleNode(d);})
        .on('mouseout',function(d){ dehighlightNode(d);})

    d3.selectAll('.object').append('rect')
        .attr("id",function(d){return "rect_" + d.id})
        .attr("class","objectRect")
        .attr('width', function(d){return d.id.length * 15})
        .attr('height', function(d){return 30})
        .attr('x',function(d){return - d.id.length * 7.5})
        .attr('y',-15)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr('opacity',1.0)
        .on("mouseover",function(d){ highlightObjectNode(d);})
        .on('mouseout',function(d){ dehighlightNode(d);})

    // var min_value = document.getElementById("minNumEdge").value
      // var max_value = document.getElementById("maxNumEdge").value

      // update_graph_by_min_max(min_value,max_value)

    var showPeopleNode = function(name, isShown){
      if (isShown){
        d3.select("#c_"+name)
          .attr('opacity',1.0)

        d3.select("#nodeName_"+ name)
          .attr('opacity',1.0)

        d3.select("#nodeStats_"+ name)
          .attr('opacity', 1.0)
      }
      else{
        d3.select("#c_"+name)
          .attr('opacity',0)

        d3.select("#nodeName_"+ name)
          .attr('opacity',0)

        d3.select("#nodeStats_"+ name)
          .attr('opacity', 0)
      }
    }

    var showObjectNode = function(name, isShown){
      if (isShown){
        d3.select("#rect_"+name)
          .attr('opacity',1.0)

        d3.select("#nodeName_"+name)
              .attr('opacity',1.0)

        d3.select("#nodeStats_"+ name)
              .attr('opacity', 1.0)
      }
      else{
        d3.select("#rect_"+name)
          .attr('opacity',0)

        d3.select("#nodeName_"+name)
              .attr('opacity',0)

        d3.select("#nodeStats_"+ name)
              .attr('opacity', 0)
      }
    }

    var showLink = function(person,object,isShown){
      if (isShown){
        d3.select("#link_"+person+"_"+object)
          .attr('opacity',1.0)
      }
      else{
        d3.select("#link_"+person+"_"+object)
          .attr('opacity',0)
      }
    }

    var highlightObjectNode = function(d){
      if(!hidden_node_list[d.id]){
        var people_list = [];
        data_for_chart3.links.forEach(function(link){
          
          if (link.target.id == d.id){
            people_list.push(link.source.id);
          }
        })

        data_for_chart3.links.forEach(function(link){
          if (link.target.id != d.id || !people_list.includes(link.source.id)){

            showLink(link.source.id, link.target.id, false);
            showPeopleNode(link.source.id, false);
            showObjectNode(link.target.id, false);
          }
        })

        var numbers = [];
        people_list.forEach(function(person){

          d3.select("#c_"+person)
            .attr('r',r_people_node)
            .attr('fill',"#8dd3c7")
            .attr('opacity',1.0)

          d3.select("#nodeName_"+person)
            .attr('opacity',1.0)

          d3.select("#nodeStats_"+person)
            .attr('opacity',1.0)
            .text(function(){ return person_label_table[person][d.id] + "/" + person_numphoto_array[person] })

          numbers.push(person_label_table[person][d.id]/person_numphoto_array[person])
        })

        d3.selectAll("#nodeStats_"+d.id)
          .attr('opacity',1.0)
          .text(function(){ return math.mean(numbers).toFixed(5) + " +/- " + math.std(numbers).toFixed(5);})

        showImage(d.id);
        showPersonImages(people_list,d.id);
      }
    }

    var highlightPeopleNode = function(d){
      if(!hidden_node_list[d.id]){
          // search for all labels that the person has
          var label_list = [];
          var label_value_dict = {};
          data_for_chart3.links.forEach(function(link){
            if (link.source.id == d.id){
              if(!hidden_node_list[link.target.id]){
                label_list.push(link.target.id);
                label_value_dict[link.target.id] = link.value;
              }
            }
          })

          var maxValue = 0;
          for (var label in label_value_dict){
            if(label_value_dict[label] > maxValue){
              maxValue = label_value_dict[label]
            }
          }

          // highlight the labels that the person node go to
          label_list.forEach(function(label){
            if(!hidden_node_list[label]){
              d3.selectAll("#rect_"+label)
                .attr('width', function(d){return label.length * 15})
                .attr('height', function(d){return 30})
                .attr('fill',"#fb8072")
            }
          })

          var people_list = [];
          var person_value_dict = {};

          data_for_chart3.links.forEach(function(link){
            if (label_list.includes(link.target.id)){
              if(!hidden_node_list[link.source.id]){
                people_list.push(link.source.id);
                person_value_dict[link.source.id] = link.value;
              }
            }
            else{
              showLink(link.source.id,link.target.id,false);
              showPeopleNode(link.source.id,false);
              showObjectNode(link.target.id,false);
            }
          })

          var maxValue = 0;
          for (var person in person_value_dict){
            if(person_value_dict[person] > maxValue){
              maxValue = person_value_dict[person]
            }
          }

          people_list.forEach(function(person){
            d3.select("#c_"+person)
              .attr('r',r_people_node)
              .attr('fill',"#8dd3c7")
              .attr('opacity',1.0)

            d3.select("#nodeName_"+person)
              .attr('opacity',1.0)
          })

          d3.select(this)
            .attr('fill',"gold")
      }
    }

    var dehighlightNode = function(d){

      labels.forEach(function(label){
        if(!hidden_node_list[label]){
          showObjectNode(label,true);
        }
      })

      people.forEach(function(person){
        if(!hidden_node_list[person]){
          showPeopleNode(person,true);
          d3.select("#nodeStats_"+person)
            .attr('opacity',0)
        }
      })

      data_for_chart3.links.forEach(function(link){
        if(!hidden_node_list[link.source.id]  && !hidden_node_list[link.target.id]){
          showLink(link.source.id, link.target.id, true);
        }
      })

      // var min_value = document.getElementById("minNumEdge").value
      // var max_value = document.getElementById("maxNumEdge").value

      // update_graph_by_min_max(min_value,max_value)
    }


    var showImage = function(label){
      d3.select('#hover_image')
        .attr('src',"ExampleImages/"+label+".jpg")
        .style('max-width','220px')
        .style('width',"220px")
    }

    var showPersonImages = function(people_list,label){
      var numPerson = people_list.length;
      people_images_div.selectAll("div").remove();
      people_images_div.selectAll("h1").remove();

      // var categoryTitle = document.createElement("h1")
      // categoryTitle.innerHTML = 'rubiksCube<br>';
      // document.getElementById('people_images').appendChild(categoryTitle);


      for (var i = 0; i < people_list.length; i++) {
        var person = people_list[i]

        var columnDiv = document.createElement('div');
        columnDiv.setAttribute("id",person+"_column")
        columnDiv.classList.add('personColumn')
        document.getElementById('people_images').appendChild(columnDiv);

        var personSpan = document.createElement("h2")
        personSpan.innerHTML = person;
        personSpan.classList.add('personHeader');        
        columnDiv.appendChild(personSpan);

        var personStats = document.createElement('span');
        personStats.innerHTML = person_label_table[person][label] + "/" + person_numphoto_array[person]+ ' images<hr>';
        personStats.classList.add('personStats');  
        columnDiv.appendChild(personStats);

        columnDiv.appendChild(document.createElement("br"));

        // var person_div = people_images_div.append('div')
        //                  // .style('flex', 1.0/numPerson)
        //                 //  .style('max-width',1.0/numPerson)
        //                  .style('max-width',100)
        //                  .style('padding','0px')
        //                  .append('text')
        //                  .style('font-size','20px')
        //                  .text(person)

        var j = 0
        for (; j < nested_data.length; j++){
          if (nested_data[j].key == person)
            break;
        }

        var image_list = nested_data[j].values;

        image_list.sort(function(x,y) {
          return y.CorrectLabel.includes(label) - x.CorrectLabel.includes(label);
        });

        for(j = 0; j < image_list.length; j++){

          
          // var caption_path = image_list[j].Path.split('.')[0] + 'caption.txt'
          // var img = person_div.append('img')
          //            .style('margin-top', '8px')
          //            .style('vertical-align','middle')
          //            .style('width','100%')
          //            .attr('src',image_list[j].Path)
          //            .style('border',function(){
          //             if (image_list[j].CorrectLabel.includes(label))
          //               return '4px solid gold'
          //             else
          //               return '4px solid transparent'
          //            })

          
          var iimg = document.createElement('img');
          iimg.src = image_list[j].Path;
          if (image_list[j].CorrectLabel.includes(label)) {
            iimg.classList.add('highlightedImage');
          } else {
            iimg.classList.add('unhighlightedImage')
          }
          columnDiv.appendChild(iimg);

          var pictureName = document.createElement('div')
          var pictureNameText = '<b>'+ image_list[j].Person + '_' + image_list[j].Pic + '</b><br/>';
          
          if (caption_text[image_list[j].Person+"_"+image_list[j].Pic]){
            pictureNameText += caption_text[image_list[j].Person+"_"+image_list[j].Pic];
          } 
          pictureName.classList.add('personColumnCaption');     
          pictureName.innerHTML = pictureNameText;
          columnDiv.appendChild(pictureName);       
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
      // var hidden_label_list = [];
      data_for_chart3.links.forEach(function(link){
        var label = link.target.id;
        if (num_people_of_label[link.target.id] < min_value){

          showLink(link.source.id,link.target.id,false);
          showObjectNode(link.target.id,false);

          hidden_node_list[link.target.id] = true;
        }
        else if (num_people_of_label[link.target.id] > max_value) {
          showLink(link.source.id,link.target.id,false);
          showObjectNode(link.target.id,false);

          hidden_node_list[link.target.id] = true;
        }
        else{
          showLink(link.source.id,link.target.id,true);
          showObjectNode(link.target.id,true);

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
            if(hidden_node_list[label]){
              num_edges_to_hide += 1;
            }
          }
        })
        if (num_edges == num_edges_to_hide){ 
          hidden_node_list[person] = true; 
          showPeopleNode(person,false);
        }
      })     
    }

    d3.selectAll(".people").append("text")
                            .attr('class', 'nodeName')
                            .attr('id',function(d){return "nodeName_"+d.id})
                            .attr("dy", 5)
                            .text(function (d) {
                              return (d.id[d.id.length-2] == 'n')? 'p' + d.id[d.id.length-1]: 'p' + d.id[d.id.length-2] + d.id[d.id.length-1]
                              })

    d3.selectAll(".object").append("text")
                           .attr('class', 'nodeName')
                           .attr('id',function(d){return "nodeName_"+d.id})
                           .text(function (d) {return d.id})

    d3.selectAll(".people").append("text")
                           .attr('class','nodeStats')
                           .attr('id',function(d){return "nodeStats_"+d.id})
                           .attr("dy", 18)
                           .text(" ")

    d3.selectAll(".object").append("text")
                           .attr('class','nodeStats')
                           .attr('id',function(d){return "nodeStats_"+d.id})
                           .attr("dy", 10)
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


    var min_value = document.getElementById("minNumEdge").value
    var max_value = document.getElementById("maxNumEdge").value

    update_graph_by_min_max(min_value,max_value)

  });
}