'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('elevatorApp'));

  var MainCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });

  it('should have 10 floors', function (){
    expect(scope.floors.length).toEqual(10);
  });

  it('should have elevators not more than 20 people', function (){
      for(var i in scope.elevators){
      	expect(scope.elevators[i].people).toBeLessThan(21);
      }		  
  });


  it('should display an alert message if 0 or less people press the go button', function (){
    // Note { level:2 } mimics the output of the dropdown menu
    scope.callNearestElevator({level:3, toLevel:{ level:2 }, people:0});
    expect(scope.message.content).toEqual('Oops this is creepy..No one pressed the button?');
  });

  it('should display an alert message if people want to travel to the same floor', function (){
    scope.callNearestElevator({level:2, toLevel:{ level:2 }, people:1});
    expect(scope.message.content).toEqual('Sorry, you already are on level 2');
  });
});
