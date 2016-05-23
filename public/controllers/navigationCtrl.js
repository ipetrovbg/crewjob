(function () {
    var app = angular.module('crewjob');
    var navigationCtrl = function ($scope, $cookies, $location, $timeout, auth, toastinoService, $route, $rootScope, projectServices, $routeParams) {
        /*if ($cookies.get('email')) {
            $scope.user = $cookies.get('name');
            $scope.user_img = $cookies.get('img');
            $scope.isAuthenticated = true;
        } else {
            $scope.isAuthenticated = false;
        }

        $scope.active = $location.url();
        */
        // toastinoService.makeSuccessToast('Вписахте се успешно!', 'long');
        // toastinoService.makeDangerToast('Неуспешен вход, моля опитайте отново!', 'long');
        $scope.activeUrl = $location.$$url;
        //console.log($location);
       if($routeParams.project_id){
           $scope.activeUrl = '/projects';
       }else if($routeParams.project_edit_id){
            $scope.activeUrl = '/projects';
        }
        //if($location.search('id').$$search.id === true){
        //    console.log(1);
        //}
        $rootScope.projectDone = true;
        $scope.logout = function () {
            if($rootScope.projectDone){
                auth.logout().then(function(response){
                    if(response.logout){
                        $route.reload();
                        $location.path('/');
                        $cookies.remove('email');
                        $cookies.remove('ID');
                        $cookies.remove('lastTab');
                        toastinoService.makeSuccessToast('Излязохте успешно. Благодарим Ви, че използвате сайта ни!', 'long');
                        //$timeout(function () {
                        // document.location.reload(true);
                        //}, 500);
                    }else{
                        toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                    }
                });
            }else{
                projectServices.deleteProject($scope.projectID)
                    .success(function(response){
                        if(response.status){
                            auth.logout().then(function(response){
                                if(response.logout){
                                    $route.reload();
                                    $location.path('/');
                                    $cookies.remove('email');
                                    $cookies.remove('ID');
                                    $cookies.remove('lastTab');
                                    toastinoService.makeSuccessToast('Излязохте успешно. Благодарим Ви, че използвате сайта ни!', 'long');
                                    //$timeout(function () {
                                    // document.location.reload(true);
                                    //}, 500);
                                }else{
                                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                                }
                            });
                        }
                    }).error(function(reason){
                    console.log(reason);
                });
            }

            
        };

        if($cookies.get('ID')){
            $scope.isAuthenticated = true;
        }else{
            $scope.isAuthenticated = false;
        }

        auth.isAuth().then(function(response){
            if(response.auth){
                $scope.isAuthenticated = true;
            }else{
                $scope.isAuthenticated = false;
                $cookies.remove('email');
                $cookies.remove('ID');
                $cookies.remove('lastTab');
            }
        });

    };
    app.controller('navigationCtrl', navigationCtrl);
}());