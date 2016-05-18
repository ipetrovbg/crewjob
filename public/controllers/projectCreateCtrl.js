(function () {
    var app = angular.module('crewjob');
    var projectCreateCtrl = function ($scope, $location, $timeout, $cookies, portfolioServices, toastinoService, FileUploader,
                                      categoriesServices, projectServices, $q) {

        $scope.prcategory = [];
        $scope.showForm = false;
        projectServices.createEmptyProject()
            .success(function(response){
                if(response.auth){
                    if(response.status){
                        $scope.showForm = true;
                        $scope.projectID = response.project;
                        /* upload profile picture */
                        $scope.projectFile = new FileUploader({
                            url: '/upload-project-file',
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                                'projectID': $scope.projectID
                            },
                            // autoUpload:true,
                            alias: "pfile",
                            removeAfterUpload: true
                        });


                        $scope.projectFile.onProgressItem = function (item, progress) {
                            console.log(progress);
                            $scope.progres = progress;
                            $('.progress-bar').css({'width': progress + '%'});
                            $('.sr-only').text(progress + '%');
                        };

                        $scope.projectFile.onAfterAddingFile = function(item){
                            console.log(item);
                        };
                        $scope.projectFile.onBeforeUploadItem = function () {
                            console.log('start');
                        };
                        /* on complete uploading */
                        $scope.projectFile.onCompleteItem = function (fileItem, response, status, headers) {
                            console.log(response);
                        };
                        /* /upload profile picture */


                    }else{
                        $scope.showForm = false;
                    }
                }else{
                    $scope.showForm = false;
                }

            }).error(function(reason){
            console.log(reason);
        });

        categoriesServices.getAll()
            .success(function (response) {
                $scope.categories = response.categories;

                // angular.forEach(angular.element('.categories-box-row-create-project'), function(val, key){
                // 	console.log(key);
                // });

            })
            .error(function (promise) {
                console.log("Categories Error" + promise);
            });
        $scope.btnCreate = true;
        $scope.createProject = function () {
            $scope.btnCreate = false;
            projectServices.createProject({'category': $scope.prcategory}, $scope.title ,$scope.description, $scope.projectID)
                .success(function(response){

                    angular.forEach($scope.projectFile.queue, function(item){
                        item.upload();
                    });



                    if(response.status){
                        $scope.projectFile.onCompleteAll = function(){

                            toastinoService.makeSuccessToast('Успешно създадохте проект!', 'long');
                            $scope.prcategory = [];
                            $scope.title = '';
                            $scope.description = '';
                            angular.element(document).find('.categories-box-row-create-project').removeClass('active');

                            $("html, body").animate({scrollTop: 0}, "fast");
                            $timeout(function(){
                                $location.path('/projects');
                            }, 1000);
                        };
                        //}
                    }else{
                        $scope.btnCreate = true;
                        toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                    }

                }).error(function(reason){
                    $scope.btnCreate = true;
                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
            });
        };

        $('body').on('click', '.categories-box-row-create-project', function () {

            if ($scope.prcategory.contains($(this).data('cat_id'))) {
                var index = $scope.prcategory.indexOf($(this).data('cat_id'));
                if (index > -1) {
                    $scope.prcategory.splice(index, 1);
                }
                $(this).removeClass('active');
            } else {
                $scope.prcategory.push($(this).data('cat_id'));
                $(this).addClass('active');
            }

            console.log($scope.prcategory);
        });
        /*/category*/

        $scope.$on('$locationChangeStart', function (event, next, current) {
            var answer = confirm("Проектът ви е недовършен. Ще бъде изтрит ако излезете сега. Наистина ли искате да излезете?");
            if (!answer) {
                event.preventDefault();
            }else{
                projectServices.getProject($scope.projectID)
                    .success(function(response){
                        if(response.status){
                            if(response.project){
                                    projectServices.deleteProject($scope.projectID)
                                        .success(function(response){
                                            console.log(response);
                                        }).error(function(reason){
                                        console.log(reason);
                                    });
                            }
                        }
                    }).error(function(reason){
                    console.log(reason);
                });
            }
        });

    };
    app.controller('projectCreateCtrl', projectCreateCtrl);
}());

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}