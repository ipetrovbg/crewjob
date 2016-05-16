(function () {
    var app = angular.module('crewjob');
    var navigationCtrl = function ($scope, $cookies, $location, $timeout, auth, toastinoService) { 
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
        $scope.logout = function () {
            
            
            auth.logout().then(function(response){
                console.log(response);
                if(response.logout){
                    $cookies.remove('email');
                    $cookies.remove('ID');
                    $cookies.remove('lastTab');                    
                        toastinoService.makeSuccessToast('Излязохте успешно. Благодарим Ви, че използвате сайта ни!', 'long');
                    $timeout(function () {
                     document.location.reload(true);
                    }, 1000);
                }else{
                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                }
                
                
            });
            
        };
        if ($cookies.get('ID')) {

             $scope.isAuthenticated = true;
        } 
        else {
            $scope.isAuthenticated = false;
        }

    }
    app.controller('navigationCtrl', navigationCtrl);
}());