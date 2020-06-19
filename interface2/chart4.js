// Adjacency Matrix

make_chart4();

function make_chart4(){

	var people = ["Person1", "Person2", "Person3", "Person4", "Person5", 
			  	  "Person6", "Person7", "Person8", "Person9", "Person10", 
				  "Person11", "Person12", "Person13", 
	              "Person14", "Person15", "Person16", "Person17", "Person18", 
	              "Person19",  "Person20", "Person21", "Person22", 
	              "Person23", "Person24", "Person25", "Person26", "Person27", 
	              "Person28", "Person29",  "Person30", "Person31", 
	              "Person32", "Person33", "Person34", "Person35", "Person36", 
	              "Person37", "Person38", "Person39", "Person40"]

  var labels  = ["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
                "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
                "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
                "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
                "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
                "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
                "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
                "pinkCandle", "vancouverCards", "hairRoller"]

	var json_path = 'i3_new_data.json'

	var width = 800, height = 800;

	var margin =  {top: 50, bottom: 50, left: 50, right: 50};

	//define svg
    var svg = d3.select("#adjacency_matrix")
              .attr("class","mainchart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)

    // create matrix
    d3.json(json_path,function(error,data){

    	if (error) throw error;

    	var person_label_table = {};

	    data.forEach(function(d,i){
	      var person = d.Person;
	      var label_list = d.CorrectLabel;
	      if(!person_label_table[person]){
	      	person_label_table[person]={};
	      }
	      else{
	      	label_list.forEach(function(label){
	      		if(!person_label_table[person][label]){
	      			person_label_table[person][label] = 1;
	      		}
	      	})
	      }
	    })

	    var data_for_chart4 = [];
	    for (var i = 0; i < people.length; i++) {

	    	var person_i = people[i];
	    	var label_list_i = person_label_table[person_i];

	    	for (var j = i+1; j < people.length; j++) {
    			var person_j = people[j];
    			var weight = 0;
    			for(var label in label_list_i){
    				if(person_label_table[person_j][label] == 1){
    					weight += 1;
    				}
    			}
    			var grid = {"id": person_i + "-" + person_j, "x": j, "y": i, "weight": weight};
    			data_for_chart4.push(grid);
	    	}
	    }

	    console.log(data_for_chart4)

	    svg.append("g")
	       .attr('transform',"translate("+margin.left+","+margin.top+")")
	       .selectAll("rect")
		   .data(data_for_chart4)
		   .enter()
		   .append("rect")
		   .attr("class","grid")
		   .attr("width",20)
		   .attr("height",20)
		   .attr("x", d=> d.x*20)
		   .attr("y", d=> d.y*20)
		   .style("fill-opacity", d=> d.weight * .1)
		   .on("mouseover", gridOver);

		svg.append("g")
		   .attr('transform',"translate("+margin.left+","+(margin.top-10)+")")
		   .selectAll("text")
		   .data(people)
		   .enter()
		   .append("text")
		   .attr("x", (d,i) => i * 20 + 10)
		   .text(d =>  d.substring(6,d.length))
		   .style("text-anchor","middle")
		   .style("font-size","10px")

		svg.append("g")
		   .attr("transform","translate(40,50)")
		   .selectAll("text")
		   .data(people)
		   .enter()
		   .append("text")
		   .attr("y",(d,i) => i * 20 + 10)
		   .text(d => d.substring(6,d.length))
		   .style("text-anchor","end")
		   .style("font-size","10px")

		// svg.selectAll("rect.grid").on("mouseover", gridOver); 
	
		function gridOver(d) {
			console.log(d.weight)
			// console.log(d3.selectAll("rect"))
			svg.selectAll("rect")
			   .style("stroke-width", function(p) { return p.x == d.x || p.y == d.y ? "3px" : "1px"});
	
		};

    })
}