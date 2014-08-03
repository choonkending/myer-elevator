'use strict';

angular.module('elevatorApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    
    // Initialize the scope with floor and its values
    $scope.floors = [
    { level: 10, toLevel :0, people: 0 },
    { level: 9, toLevel: 0, people: 0  },
    { level: 8, toLevel: 0, people: 0  },
    { level: 7, toLevel: 0, people: 0  },
    { level: 6, toLevel: 0, people: 0  },
    { level: 5, toLevel: 0, people: 0  },
    { level: 4, toLevel: 0, people: 0  },   
    { level: 3, toLevel: 0, people: 0  },   
    { level: 2, toLevel: 0, people: 0  },   
    { level: 1, toLevel: 0, people: 0  }   
    ];

    // Initialize the scope with elevators and its values
    $scope.elevators = [
    { name: 'A', currentLevel : 1, origin: 0, destination: 0, people: 0, state: '-'},
    { name: 'B', currentLevel : 8, origin: 0, destination: 0, people: 0, state: '-'},
    { name: 'C', currentLevel : 3, origin: 0, destination: 0, people: 0, state: '-'},
    { name: 'D', currentLevel : 6, origin: 0, destination: 0, people: 0, state: '-'}
    
    ];
 
    // promise return from $timeout 
    $scope.promise = null;

    // alert messages to notify user
    $scope.message ={ type:'alert-success', content:'', show:false };

    
    // Use our rest api to post a new comment
    $scope.addElevatorStates = function(){
      $http.post('api/states', { elevators : $scope.elevators });
    };

    // moveElevator checks for each elevator and moves them either up/down/static
    // $timeout here is used as a 'tick' to indicate when the elevators should move up and down
    // if all elevators have arrived at their destinations, the timer will stop
    $scope.moveElevator= function(){
      // Track elevators in database
      $scope.addElevatorStates();

      for(var i in $scope.elevators){
	var elevator = $scope.elevators[i];
	
	if(elevator.state === '^'){
	  elevator.currentLevel = elevator.currentLevel + 1;

	}else if(elevator.state === '\\/'){
	  elevator.currentLevel = elevator.currentLevel - 1;
	}
	$scope.loadUnloadPassengers(elevator);
	// Check if elevator arrived at the origin
	
      } 
      
      var available = $scope.filter($scope.elevators, $scope.testAvailable);
      console.log(available);
      if(available.length === $scope.elevators.length){
         // If all are available, this means that there are no more lifts in operation
	 console.log('all available');
	 if($scope.promise !== null){
           console.log('Im cancelling bro');
	   $timeout.cancel($scope.promise);
	 }
      }else{
          
        $scope.promise = $timeout($scope.moveElevator, 1000);
      }


      //console.log($scope.promise);
    };

    // This function decides whether or not to load and unload passengers at currentLevel
    $scope.loadUnloadPassengers = function(elevator){
      if(elevator.currentLevel === elevator.origin){
	  var currentFloor = $scope.findFloor($scope.floors, elevator.origin);
          if(currentFloor.people > 20){
	    elevator.people = 20;
	    currentFloor.people = currentFloor.people - 20;
	  }else{
	    elevator.people = currentFloor.people;
	    currentFloor.people = 0;
	  }

          $scope.assignDirection(elevator, elevator.destination);
          // reset origin to 0 to indicate that it has reached the origin
	  elevator.origin = 0;
      }else if(elevator.currentLevel === elevator.destination){
        if(elevator.origin === 0){
	  // unload passengers 
	  var currentFloorA = $scope.findFloor($scope.floors, elevator.destination);
	  currentFloorA.people = parseInt(currentFloorA.people,10) + parseInt(elevator.people,10);
	  elevator.people = 0;

	  $scope.assignDirection(elevator, elevator.destination);
	  // elevator has arrived at destination, reset to 0
          elevator.destination = 0;

	}
      }
    };

    // findAbsoluteDifference is a function that finds the absolute value of the difference between a and b
    $scope.findAbsoluteDifference = function(a, b){
      return Math.abs(a - b);
    };
    

    // findFloor is a function that iterates through an array (floors) and 
    // returns the correct floor object that matches
    // the correct level
    $scope.findFloor = function(floors, level){
      for(var i = 0; i < floors.length; i++){
        if(floors[i].level === level){
	  return floors[i];
	}
      }
      return null;
    };
    // $scope.filter is a higher order function
    // Pass in an array and a test function to filter
    // Just a little functional programming magic!
    $scope.filter = function(array, test){
      var passed = [];
      for(var i = 0; i < array.length; i++){
        if(test(array[i])){
	  passed.push(array[i]);
	}  	 
      }
      return passed;
    };


    // testAvailable is a function that returns true if elevator is static (-) and is empty
    $scope.testAvailable = function(elevator){
    	return elevator.state === '-' && elevator.people === 0;
    };


    // This function assigns the direction of the elevator according to the level 
    $scope.assignDirection = function(elevator, level){
      
	if(elevator.currentLevel < level){
	  elevator.state = '^';
	}else if(elevator.currentLevel > level){
	  elevator.state = '\\/';
	}else{
	  elevator.state = '-';
	}
    };

    // callNearestElevator requires 3 arguments, 
    // @floor : floor object with information
    // This function searches for the nearest available 'empty'(i.e. people = 0 ) elevator
    $scope.callNearestElevator = function(floor){
      if($scope.promise !== null){
      	$timeout.cancel($scope.promise);
      }

      var availableElevators = $scope.filter($scope.elevators, $scope.testAvailable);
      // First check whether people > 0 , if not, notify user that there is nobody pressing the button
      if( floor.people <= 0 ){
      
	$scope.message.type = 'alert-danger';
	$scope.message.show = true;
	$scope.message.content = 'Oops this is creepy..No one pressed the button?';

      }else if(floor.level === floor.toLevel.level) {

	$scope.message.type = 'alert-danger';
	$scope.message.show = true;
	$scope.message.content = 'Sorry, you already are on level ' + floor.level;
      
      }else if(availableElevators.length <= 0){
	
	$scope.message.type = 'alert-danger';
	$scope.message.show = true;
	$scope.message.content = 'Sorry, all the elevators are currently occupied. Please try again in a few seconds.';

      }else{
        $scope.message.type = 'alert-success';
	$scope.message.show = true;
	$scope.message.content = 'Please wait a moment, the nearest elevator will be with you shortly';
       
	// find elevators with shortest distance to current level
        var mapped = [];
	for( var i in availableElevators){
	   mapped.push($scope.findAbsoluteDifference(availableElevators[i].currentLevel, floor.level));
	}


	// Find the index of the elevator closest to this floor
	// Note: I opted to write it this way for readability and simplicity
	//       It can be written in a 'messier' but faster way if needed
	var closestIndex = mapped.indexOf(Math.min.apply(Math, mapped));
	console.log('The closest elevator is here');
	$scope.closestElevator = availableElevators[closestIndex];
	// Assign level to closest Elevator
	$scope.closestElevator.origin = floor.level;
	$scope.closestElevator.destination = floor.toLevel.level;
        console.log('The destination is');
	console.log(floor.toLevel.level);

	
	// Change the state of the closest elevator
        // This heads to the origin
	$scope.assignDirection($scope.closestElevator, floor.level);
	/*
	if($scope.closestElevator.currentLevel < floor.level){
	  $scope.closestElevator.state = '^';
	}else{
	  $scope.closestElevator.state = '\\/';
	}
	*/
	console.log($scope.closestElevator.name);
       
	console.log(floor.level);
        console.log(floor.toLevel.level );
        console.log(floor.people);

        $scope.moveElevator();
      }
    };


    
    // When the controller is destroyed , cancel the polling (movement of elevators)
    $scope.$on('destroy', function(){
       $timeout.cancel($scope.promise);		    
     });
  });
