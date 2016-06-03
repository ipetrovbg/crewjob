(function () {    var app = angular.module('crewjob');    var ModalMessageCtrl = function($scope, $uibModalInstance, item, toastinoService, userServices){        userServices.getUserSmallInfo(item).success(function(response){           $scope.author_email = response.user.email;        });        $scope.send = function () {            if($scope.message){                userServices.sendMessage(item, $scope.message).success(function(response){                    if(response.status){                        toastinoService.makeSuccessToast('Съобщението беше изпратено', 'long');                        $uibModalInstance.close();                    }else{                        toastinoService.makeWarningToast('Съобщението не беше изпратено', 'long');                    }                }).error(function(){                    toastinoService.makeDangerToast('Нещо се обърка, моля опитайте отново!', 'long');                });            }else{                toastinoService.makeWarningToast('Напишете съобщение!', 'long');            }        };        $scope.cancel = function () {            $uibModalInstance.dismiss('cancel');        };    };    app.controller('ModalMessageCtrl', ModalMessageCtrl);}());