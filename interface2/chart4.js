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

	var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 400,
    height = 400;

    var x = d3.scaleBand().range([0, width])
    var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4",
    			  "#225ea8","#225ea8","#225ea8","#225ea8","#225ea8"];
    var z = d3.scaleOrdinal().domain(d3.range(0,9)).range(colors)

	//define svg
    var svg = d3.select("#adjacency_matrix").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + 2 * margin.bottom)
			    // .style("margin-left", -margin.left + "px")
			  .append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select("#adjacency_matrix").append("div") 
              .attr("class", "tooltip_matrix")       
              .style("opacity", 0);

    // var legendElementWidth = 20;

    var legend = svg.selectAll(".legend")
          			.data(d3.range(0,6), function(d) { return d; });

	legend = legend.enter().append("g")
			      .attr("transform", function(d,i){return "translate(" + i * 25 + "," + (height + 5) + ")"})
	legend.append("rect")
			      .attr("width", 20)
			      .attr("height", 20)
			      .style("fill", function(d, i) { return colors[i]; })

	legend.append("text")
	      .attr("class", "mono")
	      .text(function(d) { return (d == 5)? "≥ " + Math.round(d): "= " + Math.round(d);; })
	      .style('font-size','10px')
	      .style('font-family','sans-serif')
	      .attr("dy", 30);



	var n = people.length;

    // create matrix
    d3.json(json_path,function(error,data){

    	if (error) throw error;

    	// make a person-person network, store it in such a data format:
    	// network = {
    	// 				nodes:[],
    	//				links:[],
    	// }
    	var person_person_network = {
    		"nodes":[],
    		"links":[]
    	};

    	people.forEach(function(person){
    		person_person_network.nodes.push({
    			"name":person,
    			"group":1
    		})
    	})

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

	    	for (var j = 0; j < people.length; j++) {
    			var person_j = people[j];
    			var value = 0;
    			
    			// if (i != j){
				for(var label in label_list_i){
    				if(person_label_table[person_j][label] == 1)
    					value += 1;
				}
    			// }
   
    			person_person_network.links.push(
    				{"source": i, 
    				 "target": j, 
    				 "value": value}
    			);
	    	}
	    }

	    var matrix = [];

	    person_person_network.nodes.forEach(function(node, i) {
		    node.index = i;
		    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
		});

		console.log(matrix)


	    // build the matrix based on person_person_network
		person_person_network.links.forEach(function(link) {
		    matrix[link.source][link.target].z += link.value;
		});

		console.log(matrix)

		x.domain(d3.range(40));

		svg.append("rect")
		   .attr("class", "background")
   		   .attr("width", width)
	       .attr("height", height);

		var row = svg.selectAll(".row")
				     .data(matrix)
				   .enter().append("g")
				     .attr("class", "row")
				     .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
				     .each(row);

		row.append("line")
      	   .attr("x2", width);

		row.append("text")
	       .attr("x", -6)
     	   .attr("y", x.bandwidth() / 2)
		   .attr("dy", ".32em")
		   .attr("text-anchor", "end")
		   .attr('font-size',12)
		   .text(function(d, i) { 
		   		var  person_name = person_person_network.nodes[i].name
		   		if (person_name[person_name.length-2] == 'n')
		   			return 'p' + person_name[person_name.length-1]; 
		   		else
		   			return 'p' + person_name[person_name.length-2] + person_name[person_name.length-1] ;})
		   .on('click',function(d,i){
		      	console.log(i,'clicked')
		      	order(i)}
		    )

		var column = svg.selectAll(".column")
					    .data(matrix)
					.enter().append("g")
					    .attr("class", "column")
				        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

		column.append("line")
		      .attr("x1", -width);

		column.append("text")
		      .attr("x", 6)
		      .attr("y", x.bandwidth() / 2)
		      .attr("dy", ".32em")
		      .attr("text-anchor", "start")
		      .attr('font-size',12)
		   	  .text(function(d, i) { 
		   		var  person_name = person_person_network.nodes[i].name
		   		if (person_name[person_name.length-2] == 'n')
		   			return person_name[0] + person_name[person_name.length-1]; 
		   		else
		   			return person_name[0] + person_name[person_name.length-2] + person_name[person_name.length-1] ;})

		function row(row) {
		    var cell = d3.select(this).selectAll(".cell")
		        .data(row)
		      .enter().append("rect")
		        .attr("class", "cell")
		        .attr("x", function(d) { return x(d.x); })
		        .attr("width", x.bandwidth())
		        .attr("height", x.bandwidth())
		        .style('fill',function(d){return z(d.z)})
		        // .style("fill-opacity", function(d) { return z(d.z); })
		        .on('mouseover',function(d){
		        	if (d.z == 0){
		        		var background_color = "#eff3ff";
		        	}
		        	else if (d.z == 1){
		        		var background_color = "#bdd7e7";
		        	}
		        	else if (d.z == 2){
		        		var background_color = "#6baed6";
		        	}
		        	else if (d.z == 3){
		        		var background_color = "#3182bd";
		        	}
		        	else if (d.z == 4){
		        		var background_color = "#08519c";
		        	}
		        	div.transition()    
			           .duration(200)    
			           .style("opacity", .9)
			           .style('background',background_color);   
			        div.html(d.z)  
			           .style("left", (d3.event.pageX) + "px")   
			           .style("top", (d3.event.pageY - 28) + "px");  
		        })
		        .on("mouseout", function(d) {   
		            div.transition()    
		                .duration(500)    
		                .style("opacity", 0); 
      			});
		}
	 	
	 	function order(selected_person_index) {
	 		var i = selected_person_index;
	 		console.log(i)
	 		var people_order = d3.range(40).sort(function(a,b){return matrix[i][b].z - matrix[i][a].z})
	 		console.log(people_order)
		    x.domain(people_order);

		    var t = svg.transition().duration(2500);

		    t.selectAll(".row")
		        .delay(function(d, i) { return x(i) * 4; })
		        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
		      .selectAll(".cell")
		        .delay(function(d) { return x(d.x) * 4; })
		        .attr("x", function(d) { return x(d.x); });

		    t.selectAll(".column")
		        .delay(function(d, i) { return x(i) * 4; })
		        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
		}

    })
}