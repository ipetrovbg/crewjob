(function(){    var app = angular.module('crewjob');    var userCtrl = function($scope, $route, $routeParams){        $scope.id = $routeParams.user_id;    };    app.controller('userCtrl', userCtrl);}());