(function () {
    var app = angular.module('crewjob', ['ngRoute', 'ui.router', 'angular-loading-bar', 'ngCookies',
        'uiGmapgoogle-maps', 'angular-carousel', 'ADM-dateTimePicker', 'mexassi.toastino', 'ngAnimate', 'angularFileUpload', 'infinite-scroll', 'ngRating', 'ui.bootstrap',
    'ngJcrop']);

    app.run(['$rootScope', '$route', 'userServices', 'projectServices', '$location', function($rootScope, $route, userServices, projectServices, $location) {
        $rootScope.base_url = base_url;
        $rootScope.$on('$routeChangeSuccess', function() {

            if($route.current.params.user_id){
                userServices.getUserSmallInfo($route.current.params.user_id)
                    .success(function(response){
                        if(response.status){
                            if(response.user.name){
                                document.title = $route.current.title + ' - ' + response.user.name + '  - CrewJob';
                            }else{
                                document.title = $route.current.title + ' - Анонимен ' + response.user.id + '  - CrewJob';
                            }
                        }
                    });
            }else if($route.current.params.project_id){
                projectServices.getProject($route.current.params.project_id)
                    .success(function(response){
                       if(response.status){
                           document.title = $route.current.title + ' - ' + response.project.name + '  - CrewJob';
                       }else{
                           $location.path('/projects');
                       }
                    }).error(function(reason){
                    console.log(reason);
                });
            }else{
                document.title = $route.current.title;
            }
        });
    }]);
    app.config(['$routeProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider', 'ngJcropConfigProvider',
        function ($routeProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider, ngJcropConfigProvider) {
            cfpLoadingBarProvider.spinnerTemplate = '<div></div>';

            ngJcropConfigProvider.setJcropConfig({
                bgColor: 'black',
                bgOpacity: .4,
                aspectRatio: 1,
                maxWidth: 150,
                maxHeight: 150
            });

            // Used to differ the uplaod example
            ngJcropConfigProvider.setJcropConfig('upload', {
                bgColor: 'black',
                bgOpacity: .4,
                aspectRatio: 1,
                maxWidth: 150,
                maxHeight: 150
            });

            $routeProvider.when('/', {
                templateUrl: '/public/templates/home.html',
                controller: 'homeCtrl',
                title: 'Начало - CrewJob'
            }).when('/user/:user_id', {
                templateUrl: '/public/templates/user_details.html',
                controller: 'userCtrl',
                title: 'Потребител',
                name: ':user_id'
            }).when('/projects', {
                templateUrl: '/public/templates/projects.html',
                controller: 'projectsCtrl',
                title: 'Проекти - CrewJob'
            }).when('/login', {
                templateUrl: '/public/templates/login.html',
                controller: 'loginCtrl',
                title: 'Вход - CrewJob'
            }).when('/account', {
                templateUrl: '/public/templates/account.html',
                controller: 'accountCtrl',
                title: 'Регистрация - CrewJob'
            }).when('/portfolio', {
                templateUrl: '/public/templates/portfolio.html',
                controller: 'portfolioCtrl',
                resolve: { loginRequired: loginRequired },
                title: 'Портфолио - CrewJob'
            }).when('/uploads/files/:file_name', {
                templateUrl: '/public/templates/files.html',
                controller: 'filesCtrl'
            }).when('/public/uploads/project/:file_name', {
                templateUrl: '/public/templates/files.html',
                controller: 'filesCtrl'
            }).when('/projects/create', {
                templateUrl: '/public/templates/project-create.html',
                controller: 'projectCreateCtrl',
                resolve: { loginRequired: loginRequired },
                title: 'Стартирай проект - CrewJob'
            }).when('/projects/:project_id', {
                templateUrl: '/public/templates/project-view.html',
                controller: 'projectViewCtrl',
                title: 'Проект'
            }).when('/projects/:project_edit_id/edit', {
                templateUrl: '/public/templates/project-edit.html',
                controller: 'projectEditCtrl',
                resolve: { loginRequired: loginRequired },
                title: 'Редактиране на проект - CrewJob'
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