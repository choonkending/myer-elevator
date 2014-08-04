# The Challenge - Front End Web Developer Test

## Assumptions made

1. Elevator can only store one destination at a time. That is, an elevator that is moving will not stop at other floors to pick up people other than the floor where the button was pressed.

2. If there are more than 20 people waiting for an elevator, only 20 people will enter. The remainder of the people will will have to press the button again (Similar to what happens in real life).

3. If all elevators are occupied, users are notified to try again in a few minutes.

4. If 0 people press the button for a lift, the system will notify us with a message.

5. If there 2 or more elevators at the same floor (both are closest to the floor where the call for the elevator was made), any one of them will be acceptable to ferry the passengers.

6. An available elevator is defined as an elevator that has Nobody inside AND is not currently in motion. 

7. Everyone from the same floor wants to head to the same destination at one point of time. Eg, if floor 10 has 10 people, and the desired floor is 5, ALL of them want to go there once the button is pressed.  

## Design

This project uses the MEAN (MongoDB, Express, Angular, NodeJS) stack. The generator used was [angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack) by DaftMonk. It is currently deployed to Heroku [here](http://myer-elevator.herokuapp.com/) and uses MongoHQ as a service for storage purposes.

## Testing 

Tests are run using the command `grunt test`


