(function () {
    var app = angular.module('crewjob', ["ngRoute", "ui.router", "angular-loading-bar", "ngCookies",
        "uiGmapgoogle-maps", "angular-carousel", "ADM-dateTimePicker", "mexassi.toastino", "ngAnimate", "angularFileUpload", "infinite-scroll", "ngRating"]);

    app.run(['$rootScope', '$route', 'userServices', 'projectServices', '$location', function($rootScope, $route, userServices, projectServices, $location) {
        $rootScope.$on('$routeChangeSuccess', function() {

            if($route.current.params.user_id){
                userServices.getUser($route.current.params.user_id)
                    .success(function(response){
                        if(response.status){
                            if(response.user.name){
                                document.title = $route.current.title + ' - ' + response.user.name + '  - CrewJob';
                            }else{
                                document.title = $route.current.title + ' - ' + response.user.email + '  - CrewJob';
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
    app.config(['$routeProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider',
        function ($routeProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {
            cfpLoadingBarProvider.spinnerTemplate = '<div></div>';
            $routeProvider.when('/', {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl',
                title: 'Начало - CrewJob'
            }).when('/user/:user_id', {
                templateUrl: 'templates/user_details.html',
                controller: 'userCtrl',
                title: 'Потребител',
                name: ':user_id'
            }).when('/projects', {
                templateUrl: 'templates/projects.html',
                controller: 'projectsCtrl',
                title: 'Проекти - CrewJob'
            }).when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl',
                title: 'Вход - CrewJob'
            }).when('/account', {
                templateUrl: 'templates/account.html',
                controller: 'accountCtrl',
                title: 'Регистрация - CrewJob'
            }).when('/portfolio', {
                templateUrl: 'templates/portfolio.html',
                controller: 'portfolioCtrl',
                resolve: { loginRequired: loginRequired },
                title: 'Портфолио - CrewJob'
            }).when('/uploads/files/:file_name', {
                templateUrl: 'templates/files.html',
                controller: 'filesCtrl'
            }).when('/uploads/project/:file_name', {
                templateUrl: 'templates/files.html',
                controller: 'filesCtrl'
            }).when('/projects/create', {
                templateUrl: 'templates/project-create.html',
                controller: 'projectCreateCtrl',
                resolve: { loginRequired: loginRequired },
                title: 'Стартирай проект - CrewJob'
            }).when('/projects/:project_id', {
                templateUrl: 'templates/project-view.html',
                controller: 'projectViewCtrl',
                title: 'Проект'
            }).when('/projects/:project_edit_id/edit', {
                templateUrl: 'templates/project-edit.html',
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