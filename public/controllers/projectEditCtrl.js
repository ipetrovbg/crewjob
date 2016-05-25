(function(){    var app = angular.module('crewjob');    var projectEditCtrl = function($scope, projectServices, $routeParams, $location, toastinoService, $cookies){        //console.log($routeParams.project_edit_id);        projectServices.getProject($routeParams.project_edit_id)            .success(function(response){                console.log(response);                if(response.status){                    if($cookies.get('ID') == response.project.user_id){                        $scope.projectTitle = response.project.name;                        $scope.projectLocation = response.project.location;                        $scope.projectDescription = response.project.description;                        $scope.markersCoordsToEdit = {                            latitude: response.project.latitude,                            longitude:  response.project.longitude                        };                        $scope.map = {                            center: {                                latitude: response.project.latitude,                                longitude:  response.project.longitude                            }, zoom: 9                        };                        $scope.btnEdit = true;                        $scope.editProject = function(){                            console.log($scope.projectTitle);                            console.log($scope.projectLocation);                            console.log($scope.projectDescription);                        };                    }else{                        $location.path('projects/' + $routeParams.project_edit_id);                    }                }else{                    toastinoService.makeDangerToast("Грешка при зареждане на проекта!", 'long');                }            }).error(function(reason){        });    };    app.controller('projectEditCtrl', projectEditCtrl);}());