/*!
* angular-toastino v0.0.8
* https://github.com/Mexassi/angular-toastino
* Copyright (c) 2015 Massimo Presta
* License: MIT
*/

'use strict';

var toastino = angular.module('mexassi.toastino',[]);

toastino.factory('Toastino', function ($timeout) {
  var Toastino = function (classValue) {
    this.message = '';
    this.classValue = classValue;
    this.position = 'ts-top-right';
    this.className = 'ts-toastino';
    this.autoDismiss = false;
    this.delay = 3700;
    this.observer = null;
    this.array = undefined;
  };

  Toastino.prototype.registerListener = function (listener) {
    this.observer = listener;
  };

  Toastino.prototype.broadcastChanges = function () {
    if (this.observer.update instanceof Function) {
      this.observer.update(this);
    }
  };

  Toastino.prototype.manualDismiss = function () {
    this.autoDismiss = false;
  };

  Toastino.prototype.setClass = function () {
    this.className += (this.position !== undefined && this.position !== null) ? ' ' + this.classValue + ' ' + this.position : this.classValue;
  };

  Toastino.prototype.setMessage = function (message) {
    this.setClass();
    this.message = message;
    this.close();
  };

  Toastino.prototype.close = function () {
    if (this.autoDismiss) {
      var self = this;
      $timeout(function () {
        self.dismiss();
      }, this.delay);
    }
  };

  Toastino.prototype.clearMessage = function () {
    this.message = '';
  };

  Toastino.prototype.dismiss = function () {
    this.className += ' ' + Toastino.DISMISS;
    var self = this;
    //remove item from array after dismiss css animation ends -> 350ms
    $timeout(function () {
      self.broadcastChanges(this);
    }, 350);
  };

  Toastino.DISMISS = 'ts-dismiss';

  return Toastino;
});

toastino.factory('toastinoService', function(Toastino) {

  var ToastinoService = function () {
    this.toastinoMessages = [];
    this.observer = undefined;
    this.config = {
      containerClass: 'ts-container'
    }
  };

  ToastinoService.prototype.TOAST_CLASS_DANGER = 'alert alert-danger';
  ToastinoService.prototype.TOAST_CLASS_WARNING = 'alert alert-warning';
  ToastinoService.prototype.TOAST_CLASS_SUCCESS = 'alert alert-success';
  ToastinoService.prototype.TOAST_CLASS_INFO = 'alert alert-info';

  ToastinoService.prototype.registerListener = function(observer){
    this.observer = observer;
  };

  ToastinoService.prototype.broadcastChanges = function(){
    if(this.observer !== undefined && this.observer.toastChanged instanceof Function){
      //this.observer.toastChanged();
    } else {
      console.error('Cannot toast.');
    }
  };

  ToastinoService.prototype.update = function (toastino) {
    if (toastino instanceof Toastino) {
      this.remove(toastino, toastino.array);
    }
  };

  ToastinoService.prototype.remove = function(toastino, array) {
    var toastinos = (array !== undefined) ? array : this.toastinoMessages;
    for (var i = 0; i < toastinos.length; i++) {
      if (toastino === toastinos[i]) {
        toastinos.splice(i, 1);
        break;
      }
    }
  };

  ToastinoService.prototype.buildToastino = function (object) {
    var toastino = new Toastino(object.classValue);

    if (object.autoDismiss !== undefined) {
      toastino.autoDismiss = object.autoDismiss;
    }

    if (object.delay !== undefined) {
      toastino.delay = object.delay;
    }

    if (object.array !== undefined) {
      toastino.array = object.array;
    }

    toastino.registerListener(this);
    toastino.setMessage(object.message);
    return toastino;
  };

  ToastinoService.prototype.popToast = function(toastino){
    this.toastinoMessages.unshift(toastino);
  };

  ToastinoService.prototype.makeDangerToast = function (message, length) {
    this.makeToast({
      classValue: 'alert alert-danger',
      message: message,
      autoDismiss: true
    }, length);
  };

  ToastinoService.prototype.makeWarningToast = function (message, length) {
    this.makeToast({
      classValue: 'alert alert-warning',
      message: message,
      autoDismiss: true
    }, length);
  };

  ToastinoService.prototype.makeSuccessToast = function (message, length) {
    this.makeToast({
      classValue: 'alert alert-success',
      message: message,
      autoDismiss: true
    }, length);
  };

  ToastinoService.prototype.makeInfoToast = function (message, length) {
    this.makeToast({
      classValue: 'alert alert-info',
      message: message,
      autoDismiss: true
    }, length);
  };

  ToastinoService.prototype.makeToast = function (object, length) {
    if (object.classValue !== undefined && object.message !== undefined) {

      object.delay = length ? (length === 'long' ? 7400 : 3700) : 3700;

      var toastino = this.buildToastino(object);
      this.popToast(toastino);
      this.broadcastChanges();
    } else {
      throw new TypeError('The object must have properties: classValue, message');
    }
  };

  return new ToastinoService();
});

toastino.directive('toastino', function () {
  return {
    restrict: 'E',
    scope: {
      containerclass: '@',
      toastinos: '='
    },
    template:
    '<div ng-class="(containerclass) ? \' ts-container-bottom-center \' : \'ts-container\'">' +
      '<div class="row" ng-repeat="toast in toastinoController.toastinos">' +
        '<div class="alert-dismissible {{toast.className}}">' +
          '<button type="button" class="close" aria-label="Close" ng-click="toast.dismiss()"><span aria-hidden="true">&times;</span></button>' +
          '{{toast.message}}' +
        '</div>' +
      '</div>' +
    '</div>',
    controller: function toastinoController(toastinoService, $scope) {
      var vm = this;
      vm.init = function(){
        if ($scope.toastinos) {
          vm.toastinos = $scope.toastinos;
        } else {
          vm.toastinos = [];
        }
        toastinoService.registerListener(vm);
        vm.toastChanged();
      };

      vm.toastChanged = function(){
        if (!$scope.toastinos) {
          vm.toastinos = toastinoService.toastinoMessages;

        } else {
        }
      };

      vm.init();
    },
    controllerAs:  'toastinoController'
  };
});

toastino.controller('toastinoCtrl', function (toastinoService) {
  var callbacks = ['makeInfoToast',
                   'makeSuccessToast',
                   'makeWarningToast',
                   'makeDangerToast'];
  var messages = [
    'Hello I am Angular-toastino',
    'You can use me to display toast messages',
    'Just inject toastinoService in your controller',
    'You can install me via bower install angular-toastino',
  ];
  var _this = this;
  _this.containerClass = 'ts-container';
  _this.test = [];
  _this.SHOW = 1;
  _this.HIDE = 0;
  _this.documentation = _this.HIDE;

  _this.randomNumber = function () {
    var number = Math.floor(Math.random() * 4) + 1;
    return number;
  };

  _this.toggleDocumentation = function() {
    _this.documentation = (_this.documentation === _this.SHOW) ? _this.HIDE : _this.SHOW;
    console.log('toggling to ' , _this.documentation);
  };

  _this.createCustomToastino = function() {
    var toastino = toastinoService.buildToastino({
      classValue: 'alert alert-danger',
      message: 'This is an error message! It won\'t disappear until you dismiss it!',
      autoDismiss: false,
      array: _this.test
    });
    _this.test.unshift(toastino);
  };


  _this.createToastino = function () {
    var callbackNumber = _this.randomNumber() - 1;

    if (callbacks[callbackNumber] === 'makeInfoToast') {
      toastinoService.makeInfoToast(messages[_this.randomNumber() - 1]);
    } else if (callbacks[callbackNumber] === 'makeSuccessToast') {
      toastinoService.makeSuccessToast(messages[_this.randomNumber() - 1], 'long');
    } else if (callbacks[callbackNumber] === 'makeWarningToast') {
      toastinoService.makeWarningToast(messages[_this.randomNumber() - 1]);
    } else if (callbacks[callbackNumber] === 'makeDangerToast') {
      toastinoService.makeDangerToast(messages[_this.randomNumber() - 1], 'long');
    }
  };
});
