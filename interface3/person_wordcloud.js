var wordcloud_div = d3.select("#word_cloud")
					  .style("width","960px")
					  .style("height","500px")

var margin = {top: 30, right: 50, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var g = wordcloud_div.append("svg")
			        .attr("width", width)
			        .attr("height", height)
			      	.append("g")
			      	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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

	var wordScale = d3.scaleLinear()
			    	  .domain([0,d3.max(word_entries, function(d) { return d.value; })])
			    	  .range([5, 50])

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

    	console.log(words)

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
			        .text(function(d) { return d.key; });

   	}

   d3.layout.cloud().stop();
}


