(function(){
	var app = angular.module('crewjob', ["ngRoute", "ui.router", "angular-loading-bar", "ngCookies", "uiGmapgoogle-maps"]);

app.config(['$routeProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider',
	function($routeProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {
    	cfpLoadingBarProvider.spinnerTemplate = '<div></div>';

	      $routeProvider.
	      when('/', {
	        templateUrl: 	'templates/home.html',
	        controller: 	'homeCtrl'
	      }).
	        otherwise({        redirectTo: '/'      });  
	      $locationProvider.html5Mode(true);
  }]);

}());