(function(){
	var portfolioServices = function ($http) {

		var updateProfile = function(gender, name, date, description){
			return $http({
				url: 'http://localhost:8000/updateProfile',
                method: 'POST',
                params: {
                    gender: gender,
                    name: name,
                    date: date,
                    description: description
                }
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};

		var userDetail = function(){
			return $http({
				url: 'http://localhost:8000/userDetails',
                method: 'POST'
			}).then(function(response){
				return response.data;
			});
		}

		var updateCategory = function(categories){
			// console.log(categories);
			return $http({
				url: 'http://localhost:8000/updateUserCategory',
                method: 'POST',
                params: {
                    categories: categories
                }
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};
		var putLink = function(link, note){
			return $http({
				url: 'http://localhost:8000/insertLink',
                method: 'POST',
                params: {
                    link: link,
                    link_note: note
                }
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};
		var getLinks = function(){
			return $http({
				url: 'http://localhost:8000/getLinks',
                method: 'POST'
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};
		var deleteLink = function(link_id){
			return $http({
				url: 'http://localhost:8000/deleteLink',
                method: 'POST',
                 params: {
                    link_id: link_id
                }
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};
		return{
			updateProfile: 	updateProfile,
			userDetail: 	userDetail,
			updateCategory: updateCategory,
			putLink: putLink,
			getLinks: getLinks,
			deleteLink: deleteLink
        };

	}
	var module = angular.module("crewjob");
    module.factory("portfolioServices", portfolioServices);

}());