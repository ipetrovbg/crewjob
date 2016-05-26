(function () {
    var app = angular.module('crewjob');
    var projectCreateCtrl = function ($scope, $location, $timeout, $cookies, portfolioServices, toastinoService, FileUploader,
                                      categoriesServices, projectServices, $rootScope, $route) {

        $scope.prcategory = [];
        $scope.showForm = false;
        //$scope.loadingLocation = false;
        $scope.la = null;
        $scope.lo = null;
        $scope.adressess = null;
        $scope.hasFile = false;
        /* on stop typing */
        var inputChangedPromise;

        $scope.inputChanged = function () {
            //$scope.loadingLocation = true;
            if (inputChangedPromise) {
                $timeout.cancel(inputChangedPromise);
            }
            inputChangedPromise = $timeout(taskToDo, 500);

        };

        function taskToDo() {
            //console.log($scope.locations);
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': $scope.locations
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.adressess = results[0].formatted_address;
                    $scope.la = results[0].geometry.location.lat();
                    $scope.lo = results[0].geometry.location.lng();
                    $scope.map = {
                        center: {
                            latitude: results[0].geometry.location.lat(),
                            longitude: results[0].geometry.location.lng()
                        }, zoom: 9
                    };
                    $scope.markersCoords = {
                        latitude: $scope.la,
                        longitude: $scope.lo
                    };
                }
            });
        }
        /* /on stop typing */
        
        projectServices.createEmptyProject()
            .success(function (response) {
                if (response.auth) {
                    if (response.status) {
                        $rootScope.projectDone = false;
                        $scope.showForm = true;
                        $scope.projectID = response.project;
                        $scope.token = response.token;
                        /* upload profile picture */
                        $scope.projectFile = new FileUploader({
                            url: '/upload-project-file',
                            headers: {
                                'X-CSRF-TOKEN': $scope.token,
                                'projectID': $scope.projectID
                            },
                            // autoUpload:true,
                            alias: "pfile",
                            removeAfterUpload: true
                        });


                        $scope.projectFile.onProgressItem = function (item, progress) {
                            $scope.progres = progress;
                            $('.progress-bar').css({'width': progress + '%'});
                            $('.sr-only').text(progress + '%');
                        };

                        $scope.projectFile.onAfterAddingFile = function (item) {
                            $scope.hasFile = true;
                        };
                        $scope.projectFile.onBeforeUploadItem = function () {
                            console.log('start');
                        };
                        /* on complete uploading */
                        $scope.projectFile.onCompleteItem = function (fileItem, response, status, headers) {
                            console.log(status);
                            if (status == '500') {
                                $location.path('/');
                            }
                        };
                        /* /upload profile picture */


                    } else {
                        $scope.showForm = false;
                    }
                } else {
                    $scope.showForm = false;
                }

            }).error(function (reason) {
            console.log(reason);
        });

        categoriesServices.getAll()
            .success(function (response) {
                $scope.categories = response.categories;

                //angular.forEach(angular.element('.categories-box-row-create-project'), function(val, key){
                //	console.log(key);
                //});

            })
            .error(function (promise) {
                console.log("Categories Error" + promise);
            });
        $scope.btnCreate = true;
        $scope.createProject = function () {
            if (!$scope.title) {
                toastinoService.makeDangerToast('Моля напишете заглавие!', 'long');
                return false;
            }
            if ($scope.prcategory.length < 1) {
                toastinoService.makeDangerToast('Моля изберете категория!', 'long');
                return false;

            }

            if (!$scope.description) {
                toastinoService.makeDangerToast('Моля напишете описание!', 'long');
                return false;
            }

            if (($scope.description.length) <= 50000) {
                $scope.btnCreate = false;
                projectServices.createProject({'category': $scope.prcategory}, $scope.title, $scope.description, $scope.projectID, $scope.la, $scope.lo, $scope.adressess, $scope.token)
                    .success(function (response) {
                        console.log(response);
                        if (response.status) {

                            angular.forEach($scope.projectFile.queue, function (item) {
                                item.upload();
                            });
                            if ($scope.hasFile) {
                                $scope.projectFile.onCompleteAll = function () {
                                    $rootScope.projectDone = true;
                                    toastinoService.makeSuccessToast('Успешно създадохте проект!', 'long');
                                    $scope.prcategory = [];
                                    $scope.title = '';
                                    $scope.description = '';
                                    angular.element(document).find('.categories-box-row-create-project').removeClass('active');
                                    $("html, body").animate({scrollTop: 0}, "fast");
                                    $timeout(function () {
                                        $location.path('projects/' + $scope.projectID);
                                    }, 1000);
                                };
                            } else {
                                $rootScope.projectDone = true;
                                toastinoService.makeSuccessToast('Успешно създадохте проект!', 'long');
                                $scope.prcategory = [];
                                $scope.title = '';
                                $scope.description = '';
                                angular.element(document).find('.categories-box-row-create-project').removeClass('active');
                                $("html, body").animate({scrollTop: 0}, "fast");
                                $timeout(function () {
                                    $location.path('projects/' + $scope.projectID);
                                }, 1000);
                            }

                        } else {
                            $scope.btnCreate = true;
                            toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                        }
                    }).error(function (reason) {
                    $route.reload();
                    $scope.btnCreate = true;
                    toastinoService.makeDangerToast('Нещо генерално се обърка. Изход!', 'long');
                    projectServices.deleteProject($scope.projectID)
                        .success(function (response) {
                            if (response.status) {
                                auth.logout().then(function (response) {
                                    if (response.logout) {

                                        $location.path('/login');
                                        $cookies.remove('email');
                                        $cookies.remove('ID');
                                        $cookies.remove('lastTab');
                                    } else {
                                        toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                                    }
                                });
                            }
                        }).error(function (reason) {
                        console.log(reason);
                    });
                });
            } else {
                toastinoService.makeDangerToast('Прекалено дълго описание на проекта!', 'long');
            }
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
            if (!$rootScope.projectDone) {
                var answer = confirm("Проектът ви е недовършен. Ще бъде изтрит ако излезете сега. Наистина ли искате да излезете?");
                if (!answer) {
                    event.preventDefault();
                } else {
                    projectServices.deleteProject($scope.projectID)
                        .success(function (response) {
                            console.log(response);
                        }).error(function (reason) {
                        console.log(reason);
                    });
                }
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