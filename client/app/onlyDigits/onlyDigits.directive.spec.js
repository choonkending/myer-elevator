'use strict';

describe('onlyDigits', function() {
		  var $scope, form;
		   beforeEach(module('elevatorApp'));
		    beforeEach(inject(function($compile, $rootScope) {
			$scope = $rootScope;
			var element = angular.element(
				'<form name="form">' +
			          '<input ng-model="model.somenum" name="somenum" only-digits />' +
			      '</form>'
		         );
		        $scope.model = { somenum: null };
			$compile(element)($scope);
			form = $scope.form;
		    }));

		    describe('integer', function() {
			it('should pass with integer', function() {
			     form.somenum.$setViewValue('3a4');
			     $scope.$digest();
			     expect($scope.model.somenum).toEqual('34');
		    });
		});
});
