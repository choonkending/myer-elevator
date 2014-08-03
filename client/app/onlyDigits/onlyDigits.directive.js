'use strict';

// Referenced (and modified) this directive from
// http://stackoverflow.com/a/19675023
angular.module('elevatorApp')
  .directive('onlyDigits', function () {
   return {
       restrict: 'A',
       require: '?ngModel',
       link: function (scope, element, attrs, ngModel) {
	       if (!ngModel) {
	         return;
	       }
               ngModel.$parsers.unshift(function (inputValue) {
		    var digits = inputValue.split('').filter(function (s) { return (!isNaN(s) && s !== ' '); }).join('');
		    ngModel.$viewValue = digits;
		    ngModel.$render();
													                            return digits;
		});
	  }
      };
		  
  });
