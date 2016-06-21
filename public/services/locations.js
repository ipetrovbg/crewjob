(function(){

	var locations = function($http){

		var getUserLocations = function () {
            return $http({
                url: base_url + '/getUserLocations',
                method: 'POST'
            }).then(function (response) {
                return response.data;
            })
        };
        var insertLocation = function (t, la, lo, c) {
            return $http({
                url: base_url + '/insertLocation',
                method: 'POST',
                params: {
                    t: t,
                    la: la,
                    lo:lo,
                    c:c
                }
            }).then(function (response) {
                return response.data;
            })
        };
		return {
            getUserLocations: getUserLocations,
			insertLocation: insertLocation
		}
	}

	var module = angular.module("crewjob");
    module.factory("locations", locations);
}());