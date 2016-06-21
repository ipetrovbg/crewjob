(function(){
	var portfolioServices = function ($http) {

		var updateProfile = function(gender, name, date, description){
			return $http({
				url: base_url + '/updateProfile',
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
				url: base_url + '/userDetails',
                method: 'POST'
			}).success(function(response){
				return response.data;
			}).error(function(promise){
                return promise;
            });
		};

		var updateCategory = function(categories){
			// console.log(categories);
			return $http({
				url: base_url + '/updateUserCategory',
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
				url: base_url + '/insertLink',
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
				url: base_url + '/getLinks',
                method: 'POST'
			}).success(function(response){
				return response.data;
			}).error(function(promise) {
				return promise;
			});
		};
		var deleteLink = function(link_id){
			return $http({
				url: base_url + '/deleteLink',
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
        var getAllFiles = function(){
            return $http({
                url: base_url + '/getAllFiles',
                method: 'POST'
            }).success(function(response){
                return response.data;
            }).error(function (promise) {
                return promise;
            })
        };
        var deleteFile = function(file_id){
            return $http({
                url: base_url + '/deleteFile',
                method: 'POST',
                params: {
                    file_id: file_id
                }
            }).success(function(response){
                return response.data;
            }).error(function(promise){
                return promise;
            });
        };
        var changePass = function(pass){
            return $http({
                url: base_url + '/changePass',
                method: 'POST',
                params: {
                    pass: pass
                }
            }).success(function(response){
                return response.data;
            }).error(function(promise){
                return promise;
            });
        };

		return{
			updateProfile: 	updateProfile,
			userDetail: 	userDetail,
			updateCategory: updateCategory,
			putLink: putLink,
			getLinks: getLinks,
			deleteLink: deleteLink,
			getAllFiles: getAllFiles,
            deleteFile: deleteFile,
            changePass: changePass
        };

	};
	var module = angular.module("crewjob");
    module.factory("portfolioServices", portfolioServices);

}());