(function () {
    var app = angular.module('crewjob', ["ngRoute", "ui.router", "angular-loading-bar", "ngCookies",
        "uiGmapgoogle-maps", "angular-carousel", "ADM-dateTimePicker", "mexassi.toastino", "ngAnimate", "angularFileUpload"]);

    app.run(['$rootScope', '$route', 'userServices', function($rootScope, $route, userServices) {
        $rootScope.$on('$routeChangeSuccess', function() {

            if($route.current.params.user_id){
                userServices.getUser($route.current.params.user_id)
                    .success(function(response){
                        if(response.user.name){
                            document.title = $route.current.title + ' - ' + response.user.name;
                        }else{
                            document.title = $route.current.title + ' - ' + response.user.email;
                        }

                    });
            }else{
                document.title = $route.current.title;
            }

        });
    }]);
    app.config(['$routeProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider',
        function ($routeProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {
            cfpLoadingBarProvider.spinnerTemplate = '<div></div>';
            $routeProvider.when('/', {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl',
                title: 'Начало'
            }).when('/user/:user_id', {
                templateUrl: 'templates/user_details.html',
                controller: 'userCtrl',
                title: 'Потребител',
                name: ':user_id'
            }).when('/projects', {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl',
                title: 'Проекти'
            }).when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl',
                title: 'Вход'
            }).when('/account', {
                templateUrl: 'templates/account.html',
                controller: 'accountCtrl',
                title: 'Регистрация'
            }).when('/portfolio', {
                templateUrl: 'templates/portfolio.html',
                controller: 'portfolioCtrl',
                resolve: { loginRequired: loginRequired },
                title: 'Портфолио'
            }).when('/uploads/files/:file_name', {
                templateUrl: 'templates/files.html',
                controller: 'filesCtrl'
            }).otherwise({redirectTo: '/'});

            $locationProvider.html5Mode(true);

            function loginRequired($q, $location, auth) {
                var deferred = $q.defer();
                auth.isAuth().then(function(response){
                    if(response.auth){
                        deferred.resolve();
                    }else{
                        $location.path('/login');
                    }
                });

                return deferred.promise;
            }


        }]);
}());