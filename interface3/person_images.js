// init selected label
selectedLabel = undefined;
selectedImageIndex = undefined;

// define modal and btn
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");

// Define people list
var people = ["Person1", "Person10", "Person11", "Person12", "Person13", 
              "Person14", "Person15", "Person16", "Person17", "Person18", 
              "Person19", "Person2", "Person20", "Person21", "Person22", 
              "Person23", "Person24", "Person25", "Person26", "Person27", 
              "Person28", "Person29", "Person3", "Person30", "Person31", 
              "Person32", "Person33", "Person34", "Person35", "Person36", 
              "Person37", "Person38", "Person39", "Person4", "Person40", 
              "Person5", "Person6", "Person7", "Person8", "Person9"]

var imageholder = d3.select("#person_images")
					.style("width","900px")
					.style("height","600px")
					.style("overflow-y","scroll")

var labelviewholder = d3.select("#labelview")
					.style("width","600px")
					.style("height","600px")
					.style("display","flex")
					.style("flex-direction","column")
					.style("overflow-y","scroll")

var isAdd = false;
var isDelete = false;

var menu3 =  [
        {
        	title: 'add label',
          	action: function() {
          		var path = this.__data__.Path;
          		for (var i = 0; i < person_image_list.length ; i++) {
          			if (person_image_list[i].Path == path){
          				selectedImageIndex = i;
          			}
          		}
          		isAdd = true;
          		var modal = document.getElementById("myModal");
          		var btn = document.getElementById("myBtn");
          		btn.onclick = function(){
          			modal.style.display = "block";
          		}
          		btn.click();
          },
        },
        {
        	title: 'delete label',
        	action: function(){
        		var path = this.__data__.Path;
          		for (var i = 0; i < person_image_list.length ; i++) {
          			if (person_image_list[i].Path == path){
          				selectedImageIndex = i;
          			}
          		}
          		isDelete = true;
          		var modal = document.getElementById("myModal");
          		var btn = document.getElementById("myBtn");
          		btn.onclick = function(){
          			modal.style.display = "block";
          		}
          		btn.click();
        	}

        }
]

// Handler for dropdown value change
var dropdownChange = function() {
    var newPerson = d3.select(this).property('value')
    console.log(newPerson)
    updateImageholder(newPerson);
    updateLabelviewholder(newPerson);
};

var updateImageholder = function(person) {
    clearImageholder();

    var data = person_image_list.filter(function(d){return d.Person == person;})

    data.forEach(function(d){
    	d.isSelected = false;
    	d.Pic = +d.Pic;
    })

    data.sort(function(a,b) { return a.Pic - b.Pic } );
    // console.log(data)
    imageholder.selectAll('div')
			    .data(data).enter()
			    .append('img')
				.attr('src',function(d){return d.Path;})
	            .on('click',function(d,i){
	                if(!d.isSelected){
		                d.isSelected = !d.isSelected;
		                d3.select(this)
		                  .style("width","400px")
		                  .style("height","320px")
		                  .style('max-width','400px')
		                  .style('max-height','320px')
		                  .style('border',"10px solid gold");
	                }
                    else{
                      d.isSelected = !d.isSelected;
                      d3.select(this)
                      	.style("width","auto")
	                  	.style("height","auto")
	                  	.style('max-width','230px')
	                  	.style('max-height','95px')
                        .style('border',"10px solid transparent");
                  }
                })
                .on('contextmenu',d3.contextMenu(menu3, {
                  onOpen: function() {},
                  onClose: function() {},
                  position: function() {
                    var elm = this;
                    var bounds = elm.getBoundingClientRect();
                    var bodyRect = document.body.getBoundingClientRect();
                    
                    return {
                      top: bounds.top - bodyRect.top,
                      left: bounds.left - bodyRect.left
                    }
                  }
                }))
};

var updateLabelviewholder = function(person){

	clearLabelviewholder();


    var data = person_image_list.filter(function(d){return d.Person == person;})
    data.forEach(function(d){
    	d.isSelected = false;
    	d.Pic = +d.Pic;
    })

    // console.log(data)
    var div = labelviewholder.selectAll('div')
							 .data(data).enter()
					     	 .append('div')
					     	 .style('display','flex')
					     	 .attr('id',function(d){return 'label_' + d.Person + "_" + d.Pic;})

	var image_labels = div.append('text')
						  .text(function(d){return d.Pic;})

	data.forEach(function(d){
		var target_div = d3.select('#label_' + d.Person + "_" + d.Pic);
		for (var i = 0; i < d.Label.length; i++) {
			target_div.append('text')
					  .text(function(d){ return "\u00A0" + d.Label[i]+ "      " ;})
					  .style('font-family','Courier New')
					  .style('color','red')
		}
	})

}

var clearLabelviewholder = function(){
	labelviewholder.selectAll('div').remove();
}

var clearImageholder = function(){
	imageholder.selectAll("img").remove();
}


var dropdown = d3.select("#person_selection")
                 .insert("select", "svg")
                 .on("change", dropdownChange);


dropdown.selectAll("option")
    .data(people)
  .enter().append("option")
    .attr("value", function (d) { return d; })
    .text(function (d) { return d;});

var SetLabel = function(){
	if(isAdd){
		var e = document.getElementById("selectLabel");
	  	selectedLabel = e.options[e.selectedIndex].text; 
	  	if (! person_image_list[selectedImageIndex].Label.includes(selectedLabel)) {
	  		person_image_list[selectedImageIndex].Label.push(selectedLabel);
	  	}
	  	isAdd = false;
	}
	if(isDelete){
		var e = document.getElementById("selectLabel");
	  	selectedLabel = e.options[e.selectedIndex].text; 
	  	var label_list = person_image_list[selectedImageIndex].Label;
	  	for (var i = 0; i < label_list.length; i++) {
	  		if (label_list[i] == selectedLabel)
	  			person_image_list[selectedImageIndex].Label.splice(i,1);
	  	}
	  	isDelete = false;
	}
	modal.style.display = "none";
	updateLabelviewholder(person_image_list[selectedImageIndex].Person);
}