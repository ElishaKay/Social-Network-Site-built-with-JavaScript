var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var beerSchema=new Schema ({

  name: String,
  style:  String,
  image: String,
  abv:  String,
  rating:  Number,
  reviews: [], 

})

var Beer = mongoose.model("Beer", beerSchema);
module.exports = Beer;
  
