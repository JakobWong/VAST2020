var wordcloud_div = d3.select("#word_cloud")
					  .style("width","600px")
					  .style("height","500px")

var width = 600
var height = 500
var g = wordcloud_div.append("svg")
			        .attr("width", width)
			        .attr("height", height)
			      	.append("g")
			      	.attr("transform", "translate(0,0)")
			      	.append("g")
			        .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")

var updateWordCloud = function(person){

	// compute word frequency
	var data_of_the_person = person_image_list.filter(function(d){return d.Person == person;})
	var word_count = {};

	// compute the frequency of each label that appears in data_of_the_person
	data_of_the_person.forEach(function(d){
		var label_list = d.CorrectLabel;
		label_list.forEach(function(label){
			if(word_count[label]){
				word_count[label] ++;
			}else{
				word_count[label] = 1;
			}
		})
	})

	var word_entries = d3.entries(word_count);
	word_entries.sort(function(a,b){return a.value - b.value});
	word_entries.forEach(function(d){
		d.isSelected = false;
	})

	var word_list = d3.select('#word_list')
					  .selectAll('text')
					  .data(word_entries,function(d){return d.key;})
	word_list.exit().remove();

	word_list.enter()
	  .append('text')
	  // .text(function(d){return "\u00A0" + d.key + "\u00A0"})
	  .style("font-size","10px")
	  // .style("font-family", "Impact")
      .style("color", function(d,i) {return colorScale(d.key); })
      .text(function(d){return "\u00A0" + d.key + "\u00A0"})	
      .on('click',function(d){
      	if (!d.isSelected){
      		d.isSelected = !d.isSelected
      		var target_label = d.key;
	      	var id_list = [];
	      	data_of_the_person.forEach(function(person){
	      		if(person.CorrectLabel.includes(target_label)){
	      			id_list.push(person.id);
	      		}
	      	})
	      	for (var i = id_list.length - 1; i >= 0; i--) {
	      		d3.select('#img'+id_list[i])
	      		  .style('border',"10px solid gold");     		
      		}
      	}
      	else{
      		d.isSelected = !d.isSelected
      		var target_label = d.key;
	      	var id_list = [];
	      	data_of_the_person.forEach(function(person){
	      		if(person.CorrectLabel.includes(target_label)){
	      			id_list.push(person.id);
	      		}
	      	})
	      	for (var i = id_list.length - 1; i >= 0; i--) {
	      		d3.select('#img'+id_list[i])
	      		  .style('border',"10px solid transparent");     		
      		}
      	}

      })


	var wordScale = d3.scaleLinear()
			    	  .domain([0,d3.max(word_entries, function(d) { return d.value; })])
			    	  .range([5, 40])

  	d3.layout.cloud().size([width, height])
          .timeInterval(20)
          .words(word_entries)
          .fontSize(function(d) { return wordScale(+d.value); })
          .text(function(d) { return d.key; })
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .on("end", draw)
          .start();

    console.log(word_entries)
				      
    function draw(words) {

    	words.forEach(function(d){
    		d.isSelected = false;
    	})

		var wordCloud = g.selectAll("text")
			        .data(words,function(d){return d.key;})

		wordCloud.exit().remove();
		
		wordCloud.enter().append("text")
			      	.transition()
					.duration(100)
			        .style("font-size", function(d) {return wordScale(d.value) + "px"; })
			        .style("font-family", "Impact")
			        .style("fill", function(d, i) { return colorScale(d.key); })
			        .attr("text-anchor", "middle")
			        .attr("transform", function(d) {
			          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			        })
			        .text(function(d) { return d.key; })

   	}

   d3.layout.cloud().stop();
}


