(function(){
	var portfolioServices = function ($http) {

		var updateProfile = function(gender, name, date, description, updated_at){
			return $http({
				url: 'http://localhost:8000/updateProfile/',
                method: 'POST',
                params: {
                    gender: gender,
                    name: name,
                    date: date,
                    description: description,
                    updated_at: updated_at
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
			}).success(function(response){
				return response.data;
			}).error(function(promise){
                return promise;
            });
		};

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
        var getAllFiles = function(){
            return $http({
                url: 'http://localhost:8000/getAllFiles',
                method: 'POST'
            }).success(function(response){
                return response.data;
            }).error(function (promise) {
                return promise;
            })
        };
        var deleteFile = function(file_id){
            return $http({
                url: 'http://localhost:8000/deleteFile',
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
                url: 'http://localhost:8000/changePass',
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

	}
	var module = angular.module("crewjob");
    module.factory("portfolioServices", portfolioServices);

}());