app.controller('MainCtrl', ['$scope','beerFactory', function($scope, beerFactory){
  $scope.test = "controller";

  beerFactory.getAll().then(function () {
    $scope.beerArray = beerFactory.beers;
  });

  $scope.addBeer= function () {
    var beer = {name: $scope.name,
      style:$scope.style,
      abv:$scope.abv,
      image:$scope.image,
      rating:0
    }

   // $scope.beerArray.push(beer);
   beerFactory.create(beer);
   console.log(beer)
   
   // beerFactory.getAll();
 };

$scope.removeBeer = function(index) {

  //get the specific beer id
  var beerId = beerFactory.beers[index]._id;
  
  //invoke the $http delete in factory
  beerFactory.delete(beerId).then(function(response){
    //update the view
    // $scope.beerArray.splice(index,1);
    beerFactory.getAll();
    console.log(response)
  });
          // console.log ('hey from the delete')

 }

 $scope.increment= function(index) {
  $scope.beerArray[index].rating ++;
 }



}]);