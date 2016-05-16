(function(){
	var app = angular.module('crewjob');
	var accountCtrl = function($scope, sha1, $cookies, $location, auth, $timeout, toastinoService){
		if($cookies.get('email')){
			$location.path('/');
		}

		$scope.register = function(){
			auth.hasEmail($scope.email)
				.then(function(response){
					if(response.hasUser == 0){

						if($scope.password && $scope.repassword){ 

							if(sha1.encode($scope.password) === sha1.encode($scope.repassword)){				

							auth.registration($scope.email, sha1.encode($scope.password))
								.then(function(response){
									
									if(response.register){
										$cookies.put('email', $scope.email);
										$cookies.put('ID', response.ID);
											toastinoService.makeSuccessToast('Успешно се регистрирахте!', 'long');
										$timeout(function(){
											document.location.reload(true);
										}, 750);
									}else{

										toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');

									}
								});
								}else{

									toastinoService.makeDangerToast('Паролите не съвпадат!', 'long');
								}	
						}else{
							toastinoService.makeDangerToast('Моля въведете пароли!', 'long');

						}
						

					}
					if(response.hasUser == 1){
						toastinoService.makeDangerToast('Потребител с този email вече съществува!', 'long');
					}
				});
		}
	};
	app.controller('accountCtrl', accountCtrl);
}());