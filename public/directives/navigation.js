(function(){

	var app = angular.module('crewjob');

	app.directive('navigation', function(){
		return{
			restrict: 'E',
			templateUrl: 'templates/navigation.html',
			controller: 'navigationCtrl'
		}
	});

}());