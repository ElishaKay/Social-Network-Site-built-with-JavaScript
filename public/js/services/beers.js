app.factory('beerFactory',function ($http) {
  var beerService = {
    beers: [],
  };

  beerService.findById = function(someId){
    for (var i = 0; i < beerService.beers.length; i++) {
      if (beerService.beers[i]._id === someId) {
        console.log(beerService.beers[i])
        return beerService.beers[i];
      }
      // else return null;
    };
   //find the beer inside of beerService.beers associated with someId
    //return that beer object
  }

  beerService.getAll = function () {
    return $http.get('/beers').then(function (data) {
    // this copies the response posts to the client side
    // 'beers' under 'beerService'
    angular.copy(data.data, beerService.beers);
  });
  };

  beerService.create = function (beer) {
    return $http.post('/beers', beer).then(function (res) {
      beerService.beers.push(res.data);
    });
  };

  
  beerService.delete=function (id) {
    return $http.delete('/beers/' + id)
  };

  beerService.addReview = function(Beerid, reviewText, beer) {
    var url = "/beers/" + Beerid + "/reviews/";
    var review = {text: reviewText};
    $http.post(url, review).then(function (res) {
        console.log(res);  
    beer.reviews.push(review);    
    });
  };

  return beerService;
});