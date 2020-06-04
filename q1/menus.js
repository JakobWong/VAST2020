// Define context menu
menu = [
    {
      title: 'correctly classified',
      action: function(d, i) {
        d.Status = "Correct";
        d3.select(this)
          .select("circle")
          .style("stroke","green")
          .style("stroke-width", 2 + 4 * d.Score);
        console.log(this)
      },
      disabled: false // optional, defaults to false
    },
    {
      title: 'misclassified',
      action: function(d, i) {
        d.Status = "Incorrect";
        new_data[i].Status = "Incorrect";
        console.log(new_data[i])
        d3.select(this)
          .select("circle")
          .style("stroke","red")
          .style("stroke-width", 2 + 4 * d.Score);
      }
    }
  ]

var nodeIndex = undefined;

// Define context menu2
menu2 = [
    {
      title: 'relabel',
      action: function(d, i) {
        console.log(d);
        var modal = document.getElementById('relabelBtn');
        modal.click();
        nodeIndex = i;
        // while($('#myModal').is(':visible'));
        d.Label = SetLabel();
      }
    }
  ]

var selected_label;

function SetLabel(){

  var e = document.getElementById("selectLabel");
  var text = e.options[e.selectedIndex].text;
  selected_label = text;
  console.log(selected_label);
  return text;
}

