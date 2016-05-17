(function () {

    var auth = function ($http) {
        var hasEmail = function (email) {
            return $http({
                url: 'http://localhost:8000/getEmail/',
                method: 'POST',
                params: {
                    email: email
                }
            }).then(function (response) {
                return response.data;
            })
        };

        var registration = function (email, password) {
            return $http({
                url: 'http://localhost:8000/register',
                method: 'POST',
                params: {
                    email: email,
                    password: password
                }
            }).then(function (response) {
                return response.data
            });
        };
        var isEmail = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
        var login = function (email, password) {
            return $http({
                url: 'http://localhost:8000/login',
                method: 'POST',
                params: {
                    email: email,
                    password: password
                }
            }).success(function (response) {
                return response.data;
            }).error(function(promise) {
                return promise;
            });
        };

        var forseLogin = function (email, id) {
            return $http({
                url: 'http://localhost:8000/forseLogin',
                method: 'POST',
                params: {
                    email: email,
                    id: id
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            }).success(function (response) {
                return response.data;
            }).error(function(promise) {
                return promise;
            });
        };
        
        var isAuth = function(){
          return $http({
              url: 'http://localhost:8000/isAuth',
              method: 'POST'
          }).then(function(response){
              return response.data;
          });
        };
        
        var logout = function(){
            return $http({
                url: 'http://localhost:8000/logout',
                method: 'POST'
            }).then(function(response){
                return response.data;
            });
        };

        return{
            hasEmail: hasEmail,
            registration: registration,
            isEmail: isEmail,
            login: login,
            isAuth: isAuth,
            logout: logout,
            forseLogin: forseLogin
        };
    };

    var module = angular.module("crewjob");
    module.factory("auth", auth);
}());