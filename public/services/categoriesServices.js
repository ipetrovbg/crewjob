(function(){
	var categoriesServices = function ($http) {

		var getAll = function(){
			return $http({
				url: 'http://localhost:8000/categories',
                method: 'POST'
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};

		
		return{
			getAll: 	getAll
        };

	}
	var module = angular.module("crewjob");
    module.factory("categoriesServices", categoriesServices);

}());