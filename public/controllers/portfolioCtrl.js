(function () {
    var app = angular.module('crewjob');

    var portfolioCtrl = function ($scope, $location, $timeout, $cookies, portfolioServices, toastinoService, FileUploader,
                                  categoriesServices, sha1, auth, projectServices, $uibModal, $log) {

        $scope.userEmail = $cookies.get('email');
        if ($cookies.get('lastTab')) {
            if ($cookies.get('lastTab') == '#tab3') {
                portfolioServices.getLinks()
                    .success(function (response) {
                        if (response.links.length > 0) {
                            $scope.links = response.links;
                        }

                        if (!response.auth) {
                            toastinoService.makeDangerToast('Не сте влязъл в профилът си!', 'long');
                        }
                    }).error(function (promise) {
                    console.log(promise);
                });
            } else if ($cookies.get('lastTab') == '#tab4') {
                portfolioServices.getAllFiles()
                    .success(function (response) {
                        $scope.allFiles = response.files;
                    })
                    .error(function (promise) {
                        console.log(promise);
                    });
            } else if ($cookies.get('lastTab') == '#tab6') {
                projectServices.getAllMyProjects()
                    .success(function (response) {
                        if (response.status) {
                            $scope.myProjects = response.myProjects;

                            $scope.items = $scope.myProjects;

                            $scope.open = function (size) {
                                $('.loading').show();
                                //console.log(size);
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'templates/modal-apply-view.html',
                                    controller: 'ModalApplyCtrl',
                                    size: size,
                                    resolve: {
                                        item: function () {
                                            return size;
                                        }
                                    }
                                });
                                modalInstance.result.then(function (selectedItem) {
                                    $scope.selected = selectedItem;
                                }, function () {
                                    //$log.info('Modal dismissed at: ' + new Date());
                                });
                            };

                        } else {
                            toastinoService.makeWarningToast('Не бяха намерени проекти!', 'long');
                        }
                    }).error(function () {
                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                });
            }

            angular.element(document).find('.tabs-nav li').removeClass('active');
            angular.element(document).find('.tab').removeClass('active');


            angular.forEach(angular.element(document).find('.tabs-nav li'), function (v, k) {
                if (angular.element(document).find(v).find('a').attr('href') == $cookies.get('lastTab')) {
                    angular.element(document).find(v).addClass('active');
                }
            });
            angular.element(document).find($cookies.get('lastTab')).addClass('active');

            // angular.element(document).find(angular.element(document).find(this)[0].firstChild.hash).addClass('active');
        }

        $scope.category = [];

        categoriesServices.getAll()
            .success(function (response) {
                // console.log(response);
                $scope.categories = response.categories;

                $scope.uCategories;

                portfolioServices.userDetail()
                    .success(function (response) {
                        $scope.uCategories = response.userCategories;

                        angular.forEach($scope.uCategories, function (v, k) {


                            if (!$scope.category.contains(v.id)) {
                                $scope.category.push(v.id);
                                console.log(v.id);
                            }


                        });

                        console.log($scope.category);

                        angular.forEach($scope.categories, function (value, ckey) {
                            angular.forEach($scope.uCategories, function (val, ukey) {
                                // console.log(value.id + 'cat' + ' -- ' + val.category_id + 'ucat');
                                if (value.id == val.category_id) {
                                    $scope.categories[ckey]['has'] = true;
                                }
                            });

                        });
                    });

            })
            .error(function (promise) {
                console.log("Categories Error" + promise);
            });

        $scope.profileImage = "";
        $scope.date = new Date();
        portfolioServices.userDetail()
            .success(function (response) {
                $scope.gender = response.userdetails.gender;
                $scope.name = response.userdetails.name;
                $scope.date = response.userdetails.date_of_birth;
                $scope.description = response.userdetails.description;
                $scope.profileImage = response.userdetails.avatar;
            });

        //console.log(updated_at);
        $scope.update = function () {
            var d = new Date();
            var updated_at = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ':' + d.getSeconds();
            portfolioServices.updateProfile($scope.gender, $scope.name, $scope.date, $scope.description)
                .success(function (resp) {
                    //if(resp.status){
                    //
                    //}
                    toastinoService.makeSuccessToast('Успешно обновихте профила си!', 'long');
                    $("html, body").animate({scrollTop: 0}, "fast");
                })
                .error(function (promise) {
                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                    $("html, body").animate({scrollTop: 0}, "fast");
                    //console.log(promise);
                    //auth.forseLogin($cookies.get('email'), $cookies.get('ID')).success(function(res){
                    //    console.log(res);
                    //});
                });
        };

        /* upload profile picture */
        $scope.uploader = new FileUploader({
            url: '/upload-profile',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            autoUpload: true,
            alias: "file",
            removeAfterUpload: true,
            filters: [{
                fn: function (item) {
                    var allowedTypes = ['image/jpeg', 'image/png'];
                    if (allowedTypes.contains(item.type)) {
                        return true;
                    } else {
                        toastinoService.makeDangerToast('Грешка. Позволени формати: jpg и png!', 'long');
                        return false;
                    }
                    // console.log(item);
                }
            }]
        });

        $scope.uploader.onProgressItem = function (item, progress) {
            $scope.progres = progress;
            $('.progress-bar').css({'width': progress + '%'});
            $('.sr-only').text(progress + ' %');
        };


        // $scope.uploader.onBeforeUploadItem = function(item){


        // };
        $scope.fileItem = "Choose file";

        /* on complete uploading */
        $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {
            toastinoService.makeSuccessToast('Успешно обновихте профилната си снимка!', 'long');
            $scope.fileItem = fileItem.file.name;
            // console.log(response);
            $scope.profileImage = response.avatar;
        };
        /* /upload profile picture */


        /*tabs*/
        angular.element(document).find('.tabs-nav li').bind('click', function (event) {
            event.preventDefault();
            if (angular.element(document).find(this).find('a').attr('href') == '#tab3') {
                portfolioServices.getLinks()
                    .success(function (response) {
                        if (response.links.length > 0) {
                            $scope.links = response.links;
                        }

                        if (!response.auth) {
                            toastinoService.makeDangerToast('Не сте влязъл в профилът си!', 'long');
                        }
                    }).error(function (promise) {
                    console.log(promise);
                });
            } else if (angular.element(document).find(this).find('a').attr('href') == '#tab4') {
                portfolioServices.getAllFiles()
                    .success(function (response) {
                        $scope.allFiles = response.files;
                    })
                    .error(function (promise) {
                        console.log(promise);
                    });
            } else if (angular.element(document).find(this).find('a').attr('href') == '#tab6') {
                projectServices.getAllMyProjects()
                    .success(function (response) {
                        if (response.status) {
                            $scope.myProjects = response.myProjects;

                            $scope.open = function (size) {
                                $('.loading').show();
                                //console.log(size);
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'templates/modal-apply-view.html',
                                    controller: 'ModalApplyCtrl',
                                    size: size,
                                    resolve: {
                                        item: function () {
                                            return size;
                                        }
                                    }
                                });
                                modalInstance.result.then(function (selectedItem) {
                                    $scope.selected = selectedItem;
                                }, function () {
                                    //$log.info('Modal dismissed at: ' + new Date());
                                });
                            };

                        } else {
                            toastinoService.makeWarningToast('Не бяха намерени проекти!', 'long');
                        }
                    }).error(function () {
                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                });
            }


            if ($cookies.get('lastTab')) {
                $cookies.remove('lastTab');
            }
            $cookies.put('lastTab', angular.element(document).find(this).find('a').attr('href'));

            angular.element(document).find('.tabs-nav li').removeClass('active');
            angular.element(document).find('.tab').removeClass('active');


            angular.element(document).find(this).addClass('active');
            angular.element(document).find(angular.element(document).find(this)[0].firstChild.hash).addClass('active');
        });
        /*/tabs*/

        /*category*/


        angular.forEach(angular.element('.categories-row .categories-box'), function (val, key) {
            if ($(val).hasClass('active')) {
                $scope.category.push($(val).data('id'));
            }
        });
        // console.log($scope.category);
        $('body').on('click', '.categories-box', function () {
            console.log($(this).data('id'));

            if ($scope.category.contains($(this).data('id'))) {
                var index = $scope.category.indexOf($(this).data('id'));
                if (index > -1) {
                    $scope.category.splice(index, 1);
                }
                $(this).removeClass('active');
            } else {
                $scope.category.push($(this).data('id'));
                $(this).addClass('active');
            }
            console.log($scope.category);

        });
        /*/category*/


        /*update category*/
        $scope.updateCategory = function () {
            portfolioServices.updateCategory({'category': $scope.category})
                .then(function (response) {
                    // console.log(response);
                    if (response.status) {
                        toastinoService.makeSuccessToast('Категориите бяха запазени!', 'long');
                    } else {
                        toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                    }
                    $("html, body").animate({scrollTop: 0}, "fast");
                });
            /*array has element/elements*/
            // if($scope.category.length > 0){
            // 	// send data to remote
            // 	// console.log($scope.category);

            // }
        };
        /*/update category*/
        $scope.linkPath = '';
        $scope.linkDesciption = '';
        /*link section*/
        $scope.uploadLink = function () {
            if ($scope.linkPath.length > 0) {

                portfolioServices.putLink($scope.linkPath, $scope.linkDesciption)
                    .success(function (response) {
                        if (response.status) {
                            toastinoService.makeSuccessToast('Успешно добавихте линка!', 'long');
                            $scope.linkPath = '';
                            $scope.linkDesciption = '';
                            portfolioServices.getLinks()
                                .success(function (response) {
                                    if (response.links.length > 0) {
                                        $scope.links = response.links;
                                    }

                                    if (!response.auth) {
                                        toastinoService.makeDangerToast('Не сте влязъл в профилът си!', 'long');
                                    }
                                }).error(function (promise) {
                                console.log(promise);
                            });
                        } else {
                            toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                        }

                    })
                    .error(function (promise) {
                        toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                    });
            } else {
                toastinoService.makeDangerToast('Въведете линк!', 'long');
            }


        }

        /*delete link*/
        $scope.deleteLink = function (link_id) {
            portfolioServices.deleteLink(link_id)
                .success(function (response) {
                    if (response.auth) {
                        if (response.status) {
                            toastinoService.makeSuccessToast('Успешно изтрихте линка!', 'long');
                            portfolioServices.getLinks()
                                .success(function (response) {
                                    if (response.links) {
                                        $scope.links = response.links;
                                    }

                                    if (!response.auth) {
                                        toastinoService.makeDangerToast('Не сте влязъл в профилът си!', 'long');
                                    }
                                }).error(function (promise) {
                                console.log(promise);
                            });
                        } else {
                            toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                        }
                    } else {
                        toastinoService.makeDangerToast('Нямате право да триете линкове!', 'long');
                    }
                }).error(function (promise) {
                toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
            });
        }
        /*/delete link*/

        /*/link section*/

        /*upload files section*/
        $scope.uploader_files = new FileUploader({
            url: '/upload-files',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            autoUpload: true,
            alias: "files",
            removeAfterUpload: true
        });

        $scope.uploader_files.onProgressItem = function (item, progress) {
            $scope.filesProgres = progress;
            $('.progress-bar').css({'width': progress + '%'});
            $('.sr-only').text(progress + ' %');
        };
        /* on complete uploading */
        $scope.uploader_files.onCompleteItem = function (fileItem, response, status, headers) {
            toastinoService.makeSuccessToast('Успешно качихте файла!', 'long');
            $scope.newFile = response.file;
            $scope.orgFile = response.org;
            portfolioServices.getAllFiles()
                .success(function (response) {
                    $scope.allFiles = response.files;
                })
                .error(function (promise) {
                    console.log(promise);
                });
        };
        /* /upload profile picture */
        $scope.deleteFile = function (file_id) {
            portfolioServices.deleteFile(file_id)
                .success(function (response) {
                    toastinoService.makeSuccessToast('Успешно изтихте файла!', 'long');
                    portfolioServices.getAllFiles()
                        .success(function (response) {
                            $scope.allFiles = response.files;
                        })
                        .error(function (promise) {
                            console.log(promise);
                        });
                })
                .error(function (promise) {
                    console.log(promise);
                });
        };
        /*/upload files section*/

        /*change pass*/
        $scope.changePass = function () {
            if ($scope.old_pass) {
                portfolioServices.userDetail()
                    .success(function (response) {
                        if (response.userdetails.password === sha1.encode($scope.old_pass)) {
                            if ($scope.new_pass === $scope.re_new_pass) {
                                portfolioServices.changePass(sha1.encode($scope.new_pass))
                                    .success(function (response) {
                                        if (response.status) {
                                            toastinoService.makeSuccessToast('Успешно променихте паролата си!', 'long');
                                            $scope.old_pass = null;
                                            $scope.new_pass = null;
                                            $scope.re_new_pass = null;
                                        } else {
                                            toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                                        }
                                    }).error(function () {
                                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                                });
                            } else {
                                toastinoService.makeDangerToast('Паролите не съвпадат!', 'long');
                            }

                        } else {
                            toastinoService.makeDangerToast('Невалидна парола!', 'long');
                        }
                    }).error(function () {
                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                });

            } else {
                toastinoService.makeDangerToast('Моля, въведете парола!', 'long');
            }

        };
        /*/change pass*/

        $scope.sorting = 'id';
        $scope.reverse = false;

        $scope.sortData = function (column) {
            $scope.reverse = ($scope.sorting == column) ? !$scope.reverse : false;
            $scope.sorting = column;
        }
        $scope.getClass = function (column) {
            if ($scope.sorting == column) {
                return $scope.reverse ? 'arrow-down' : 'arrow-up';
            }
            return '';
        }

        $scope.deleteProject = function (id, $event) {
            $('.loading').show();
            var answer = confirm("Сигурни ли сте, че искате да изтриете проекта? Това ще изтрие всичко свързано с проекта!!!");
            if (!answer) {
                $('.loading').hide();
                event.preventDefault();

            } else {
                projectServices.deleteProject(id)
                    .success(function (response) {
                        if (response.status) {
                            $('.loading').hide();

                            $($event.target.offsetParent).parent().animate({
                                opacity: 0
                            }, 400, function () {
                                $(this).remove();
                            });

                            toastinoService.makeSuccessToast('Успешно изтрихте проекта!', 'long');
                            //projectServices.getAllMyProjects()
                            //    .success(function(response){
                            //        if(response.status){
                            //            $('.loading').hide();
                            //            toastinoService.makeSuccessToast('Успешно изтрихте проекта!', 'long');
                            //            $scope.myProjects = response.myProjects;
                            //        }else{
                            //            $('.loading').hide();
                            //            toastinoService.makeWarningToast('Не бяха намерени проекти!', 'long');
                            //            $scope.myProjects = response.myProjects;
                            //        }
                            //    }).error(function(){
                            //    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');
                            //});
                        }


                    }).error(function (reason) {
                    $('.loading').hide();
                });
            }
        };

    };

    app.controller('portfolioCtrl', portfolioCtrl);
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