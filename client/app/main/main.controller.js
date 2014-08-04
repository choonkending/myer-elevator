'use strict';

angular.module('elevatorApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    
    // Initialize the scope with floor and its values
    // level: level of the floor
    // toLevel: level people want to go to
    // people: number of people on the floor
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
    // origin : floor where the button was pressed to call for an elevator
    // destination: floor where the people want to go to
    // state: - means stationary, ^ means going up, \/ means going down
    // name : name of the elevator, i.e. A, B, C, D
    // currentLevel: current level the elevator is at
    // people: number of people waiting for the elevator
    $scope.elevators = [
    { name: 'A', currentLevel : 1, origin: 0, destination: 0, people: 0, state: '-'},
    { name: 'B', currentLevel : 8, origin: 0, destination: 0, people: 0, state: '-'},
    { name: 'C', currentLevel : 3, origin: 0, destination: 0, people: 0, state: '-'},
    { name: 'D', currentLevel : 6, origin: 0, destination: 0, people: 0, state: '-'}
    
    ];
 
    // promise returned from $timeout 
    $scope.promise = null;

    // alert messages to notify user
    $scope.message ={ type:'alert-success', content:'', show:false };

    
    // Use our rest api to POST the array of elevators to mongoDB
    $scope.addElevatorStates = function(){
      $http.post('api/states', { elevators : $scope.elevators });
    };

    // moveElevator checks for each elevator and moves them either up/down/static
    // $timeout here is used as a 'tick' to indicate when the elevators should move up and down
    // if all elevators have arrived at their destinations, the timer will stop
    $scope.moveElevator= function(){
      // Track elevators in database, this will make a POST request to MongoHQ
      $scope.addElevatorStates();


      for(var i in $scope.elevators){
	var elevator = $scope.elevators[i];
	
	if(elevator.state === '^'){
	  elevator.currentLevel = elevator.currentLevel + 1;

	}else if(elevator.state === '\\/'){
	  elevator.currentLevel = elevator.currentLevel - 1;
	}
	// Calls loadUnloadPassengers function to determine whether or not passengers need to be unloaded
	$scope.loadUnloadPassengers(elevator);
	
      } 
     
      // filter the array elevators and returns an array of only available elevators
      var available = $scope.filter($scope.elevators, $scope.testAvailable);
      
      if(available.length === $scope.elevators.length){
         // If all are available, this means that there are no more lifts in operation
	
	 if($scope.promise !== null){
           console.log('Im cancelling bro');
	   // if all lifts are available, stop timer. Lifts are all not moving. 
	   $timeout.cancel($scope.promise);
	 }
      }else{
        // use timeout for 1 second intervals in calling $scope.moveElevator again  
        $scope.promise = $timeout($scope.moveElevator, 1000);
      }

    };

    // This function decides whether or not to load and unload passengers at currentLevel
    $scope.loadUnloadPassengers = function(elevator){
      // Test if elevator's current level is at the origin 
      if(elevator.currentLevel === elevator.origin){
	  var currentFloor = $scope.findFloor($scope.floors, elevator.origin);
          // if current floor has more than 20 people, only load 20 people onto the lift
	  // the rest still remains on the floor
	  if(currentFloor.people > 20){
	    elevator.people = 20;
	    currentFloor.people = currentFloor.people - 20;
	  }else{
          // if the current floor has less than 20 people, everyone will go onto the lift
	    elevator.people = currentFloor.people;
	    currentFloor.people = 0;
	  }
          
	  // Assign the direction of the lift (that means changing the state to '-', '^' or '\/'
          $scope.assignDirection(elevator, elevator.destination);
          // reset origin to 0 to indicate that it has reached the origin
	  elevator.origin = 0;
      }else if(elevator.currentLevel === elevator.destination){
	// if the current level of the elevator is at the destination 

	// test to see if elevator REALLy reached destination.
	// When the elevator has reached the origin, we set the origin to 0
	// This is to prevent the case where the elevator passes to the destination BEFORE reaching the 
	// origin to pick up the passengers
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
    // a and b are floor levels, and we want to find the difference between them
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


    // testAvailable is a function that returns true if 
    // 1. elevator is static (-) and 
    // 2. elevator is empty
    $scope.testAvailable = function(elevator){
    	return elevator.state === '-' && elevator.people === 0;
    };


    // This function assigns the direction of the elevator according to the level it is headed to
    // Eg. if elevator is at level 2, and is headed to level 5, then it is assigned the state '^'
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

        $scope.moveElevator();
      }
    };


    
    // When the controller is destroyed , cancel the polling (movement of elevators)
    $scope.$on('destroy', function(){
       $timeout.cancel($scope.promise);		    
     });
  });
