var person_image_list = []

var json_path = 'new_data.json'

d3.json(json_path, function(error, data) {
  console.log(data)

  var nested_data = d3.nest()
            .key(function(d){return d.Person;})
            .key(function(d){return d.Pic;})
            .entries(data)

  nested_data.forEach(function(person){
    person["values"].forEach(function(image){
      // console.log(image)
      var person_image = image["values"]
      var Person = person_image[0].Person
      var Pic = person_image[0].Pic
      var FileName = person_image[0].FileName
      var CorrectLabel = [];
      var IncorrectLabel = [];
      for (var i = 0; i < person_image.length; i++) {
        if (person_image[i].Status == "Correct"){
          CorrectLabel.push(person_image[i].Label)
        }
        else if (person_image[i].Status == "Incorrect"){
          IncorrectLabel.push(person_image[i].Label)
        }

      }
      person_image_list.push({
        "Person":Person,
        "Pic":Pic,
        "FileName":FileName,
        "CorrectLabel":CorrectLabel,
        "IncorrectLabel":IncorrectLabel});
    })
  })
})

console.log(person_image_list)