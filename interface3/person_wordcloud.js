var wordcloud_div = d3.select("#word_cloud")
					  .style("width","600px")
					  .style("height","300px")

var updateWordCloud = function(person){

	// clearWordCloud();

	var margin = {top: 30, right: 50, bottom: 30, left: 50};
	var width = 600 - margin.left - margin.right;
	var height = 480 - margin.top - margin.bottom;

	// compute word frequency
	var data_of_the_person = person_image_list.filter(function(d){return d.Person == person;})
	var frequency_of_label = {};

	// compute the frequency of each label that appears in data_of_the_person
	data_of_the_person.forEach(function(d){
		var label_list = d.Label;
		for (var i = label_list.length - 1; i >= 0; i--) {
			var label = label_list[i];
			if (!frequency_of_label[label]){
				frequency_of_label[label] = 1;
			}
			else{
				frequency_of_label[label] += 1;
			}
		}
	})

	// initalize data with all labels having zero frequency
	var word_entries = [];
	for(label in frequency_of_label){
		word_entries.push({
			"text":label,
			"frequency":frequency_of_label[label]
		})
	}

	var wordScale = d3.scaleLinear()
			    	  .domain([0,d3.max(word_entries, function(d) { return d.frequency; })])
			    	  .range([50, 200])

  	d3.layout.cloud().size([width, height])
          .timeInterval(20)
          .words(word_entries)
          .fontSize(function(d) { return wordScale(+d.frequency); })
          .text(function(d) { return d.text; })
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .on("end", draw)
          .start();
				      
    function draw(words) {
	    d3.select("#word_cloud").append("svg")
			        .attr("width", width)
			        .attr("height", height)
			      	.append("g")
			        .attr("transform", "translate(0,0)")
			      .selectAll("text")
			        .data(words)
			      .enter().append("text")
			        .style("font-size", function(d) { console.log(d); return wordScale(d.frequency) + "px"; })
			        .style("font-family", "Impact")
			        .style("fill", function(d, i) { return colorScale(d.text); })
			        .attr("text-anchor", "middle")
			        .attr("transform", function(d) {
			          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			        })
			        .text(function(d) { return d.text; });
   }

   d3.layout.cloud().stop();
}

// var clearWordCloud = function(){
// 	wordcloud_div.selectAll('g').exit().remove();
// }


