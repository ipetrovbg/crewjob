(function () {
    var app = angular.module('crewjob', ["ngRoute", "ui.router", "angular-loading-bar", "ngCookies",
        "uiGmapgoogle-maps", "angular-carousel", "ADM-dateTimePicker", "mexassi.toastino", "ngAnimate", "angularFileUpload"]);

    app.config(['$routeProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider',
        function ($routeProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {
            cfpLoadingBarProvider.spinnerTemplate = '<div></div>';
            $routeProvider.when('/', {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            }).when('/user/:user_id', {
                templateUrl: 'templates/user_details.html',
                controller: 'userCtrl'
            }).when('/projects', {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            }).when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            }).when('/account', {
                templateUrl: 'templates/account.html',
                controller: 'accountCtrl'
            }).when('/portfolio', {
                templateUrl: 'templates/portfolio.html',
                controller: 'portfolioCtrl'
            }).when('/uploads/files/:file_name', {
                templateUrl: 'templates/files.html',
                controller: 'filesCtrl'
            }).otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(true);
        }]);
}());