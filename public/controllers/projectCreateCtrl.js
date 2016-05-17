(function() {
	 var app = angular.module('crewjob');
	 var projectCreateCtrl = function($scope, $location, $timeout, $cookies, portfolioServices, toastinoService, FileUploader,
			categoriesServices){

	 	$scope.prcategory = [];	 	

			categoriesServices.getAll()
							.success(function(response){
								$scope.categories = response.categories;

								// angular.forEach(angular.element('.categories-box-row-create-project'), function(val, key){
								// 	console.log(key);
								// });

							})
							.error(function(promise){
								console.log("Categories Error" + promise);
							});
		// $('body').on('click', '.categories-box-row-create-project', function(){
		// 	console.log($(this));
		// 	if($(this).hasClass('active')){
		// 		if(!$scope.prcategory.contains($(this).data('cat_id'))){
		// 			var index = $scope.prcategory.indexOf($(this).data('cat_id'));
		// 				if (index > -1) {
		// 				    $scope.prcategory.splice(index, 1);
		// 				}
		// 		}
				
		// 		$(this).removeClass('active');
				
		// 	}else{
		// 		$(this).addClass('active');
		// 		$scope.prcategory.push($(this).data('cat_id'));
		// 	}
		// 	console.log($scope.prcategory);
		// });

		angular.bind('click', '.categories-box-row-create-project', function(){
			console.log(this);
		})

	 }
	 app.controller('projectCreateCtrl', projectCreateCtrl); 
}());

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}