// Define label list
var labels = ["canadaPencil", "giftBag", "hairClip", "silverStraw", "cloudSign",
              "redBow", "turtle", "gClamp", "pumpkinNotes", "rainbowPens", "glassBead",
              "eyeball", "legoBracelet", "trophy", "stickerBox", "rubiksCube", "noisemaker",
              "spiderRing", "partyFavor", "miniCards", "pinkEraser", "foamDart", "birdCall",
              "yellowBag", "gyroscope", "cupcakePaper", "cactusPaper", "blueSunglasses",
              "redWhistle", "cowbell", "lavenderDie", "brownDie", "plaidPencil", "metalKey",
              "carabiner", "yellowBalloon", "voiceRecorder", "redDart", "sign", "paperPlate",
              "pinkCandle", "vancouverCards", "hairRoller"]

// Define container for exmaple images 
var top_div = d3.select("#example_images")
                .style("overflow","scroll")
                .style("display","flex")
                .style("height","160px")
                .selectAll('div')
                .data(labels).enter()
                .append('div')

var exmaple_images = top_div.append('img')
                            .attr('src',function(d){return "MC2-Image-Data/TrainingImages/"+d+"/"+d+"_1.jpg"})
                            .attr('width',100)
                            .attr('height', 80)      

var exmaple_labels = top_div.append('div')
                            .style('padding-left','50px')
                            .html(function(d){return d})    