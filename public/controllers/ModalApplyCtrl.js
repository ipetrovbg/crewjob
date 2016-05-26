(function(){  var app = angular.module('crewjob');    var ModalApplyCtrl = function($scope, $uibModalInstance, item, projectServices, toastinoService, $uibModal){        $scope.item = item;        projectServices.getProjectApply(item)            .success(function(response){                $('.loading').hide();                if(response.status){                    $scope.projectApply = response.apply;                }else{                    toastinoService.makeWarningToast("Нещо се обърка, моля опитайте отново!", 'long');                }            }).error(function(){            $('.loading').hide();            toastinoService.makeDangerToast("Нещо се обърка, моля опитайте отново!", 'long');        });        $scope.ok = function () {            $uibModalInstance.close($scope.item);        };        $scope.cancel = function () {            $uibModalInstance.dismiss('cancel');        };        $scope.close_project = function (size) {            var answer = confirm("Наистина ли сте готови с проекта?");            if (!answer) {                event.preventDefault();            } else {                $('.loading').show();                projectServices.stageClose(size)                    .success(function(response){                        toastinoService.makeSuccessToast("done", 'long');                    }).error(function(reason){                    toastinoService.makeDangerToast("Нещо се обърка, моля опитайте отново!", 'long');                });                //console.log(size);                var modalInstance = $uibModal.open({                    animation: true,                    templateUrl: 'templates/modal-project-close.html',                    controller: 'ModalProjectCloseCtrl',                    size: 'lg',                    resolve: {                        item: function () {                            return size;                        }                    }                });                modalInstance.result.then(function (selectedItem) {                    $scope.selected = selectedItem;                });            }        };    };    app.controller('ModalApplyCtrl', ModalApplyCtrl);}());