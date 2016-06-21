(function(){
	var app = angular.module('crewjob');
	var homeCtrl = function($scope, projectServices){
		$scope.message = "Home";
		projectServices.getLast()
			.success(function(response){
				console.log(response);
				if(response.status){
					$scope.lastProjects = response.last;
				}
			}).error(function(reason){
				console.log(reason);
			});
	};

	app.controller('homeCtrl', homeCtrl);
}());

console.log(moment(moment('20160617')._d).format('ZZ'));
console.log(moment().format('[Днес е ] dddd'));