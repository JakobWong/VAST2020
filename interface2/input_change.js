d3.select("#minNumEdge").on("input", function() {
  update1(+this.value);
});

var update1 = function(value){
	data_for_chart3.links.forEach(function(link){
		console.log(link)
	})
}