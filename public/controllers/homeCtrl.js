(function(){
	var app = angular.module('crewjob');
	var homeCtrl = function($scope){
		$scope.message = "Home";
	};

	app.controller('homeCtrl', homeCtrl);
}());