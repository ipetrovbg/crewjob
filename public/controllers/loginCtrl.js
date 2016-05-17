(function(){
	var app = angular.module('crewjob');

	var loginCtrl = function($scope, sha1, $cookies, $location, auth, $timeout, toastinoService){

		if($cookies.get('email')){
			$location.path('/');
		}
		
		

		$scope.login = function(){
			
			auth.login($scope.email, sha1.encode($scope.password))
				.success(function(response){

					if(response.user != 0){
                        $location.path('/portfolio');
						toastinoService.makeSuccessToast('Вписахте се успешно!', 'long');
						$cookies.put('email', response.user.email);
						$cookies.put('ID', response.user.id);
                                                
						//$timeout(function(){
						//	document.location.reload(true);
						//}, 200);

						// $scope.bool = true;	

					}else{
						toastinoService.makeDangerToast('Неуспешен вход, моля опитайте отново!', 'long');
						// angular.element(document).find('#c-login').slideDown('fast');
						$scope.bool = true;			
					}
				}).error(function(promise) {
					// angular.element(document).find('#c-login').slideDown('fast');
					toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
					$scope.bool = true;
				});
		
		};
	};
	app.controller('loginCtrl', loginCtrl);
}());