(function(){

	var app = angular.module('crewjob');

	app.directive('navigation', function(){
		return{
			restrict: 'E',
			templateUrl: '/public/templates/navigation.html',
			controller: 'navigationCtrl'
		}
	});

}());