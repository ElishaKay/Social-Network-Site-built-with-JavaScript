app.controller('BeersCtrl', ['$scope','$stateParams','beerFactory' ,'$window', function($scope, $stateParams,beerFactory,$window) {
	$window.scrollTo(0, 0);
  $scope.beer = beerFactory.findById($stateParams.id); 
  //$scope.beer = {name: 'heinekan', abv: 40, _id: 34890835}

  $scope.addReview = function () {
  	beerFactory.addReview($stateParams.id, $scope.reviewText,$scope.beer);
  } 
}]);