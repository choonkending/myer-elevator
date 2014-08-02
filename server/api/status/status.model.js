'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Creating a Floor Schema */
/* Each Level should have the level name, eg. if it is level 10, name = 10 */
/* Each level should have the number of people, eg. if it is 10 people, then people = 10 */
/* Each level should have a destination level, eg. if people want to go to level 3, then toLevel = 3 */
var FloorSchema = new Schema({
  name: String,
  people: Number,
  toLevel: Number
});

/* Creating an Elevator Schema */
/* Each elevator should have a name, eg. Elevator A has name = A */
/* Each elevator should have a state, eg. '^','\/','-' */
/* Each elevator should have the number of people, eg. if there are 19 people, people = 19 */
/* Each elevator should know which floor it is at, eg. if the elevator is currently at level 2, currentFloor=2 */
/* Each elevator should know where it is headed to, e.g. if people are headed to level 5, toLevel = 5 */ 
var ElevatorSchema = new Schema({
  name: String,
  state: String,
  people: Number,
  currentFloor: Number,
  toLevel: Number
});

var StatusSchema = new Schema({
  date: { type: Date, default: Date.now },
  floors: [ FloorSchema ],
  elevators: [ ElevatorSchema ]
});

module.exports = mongoose.model('Status', StatusSchema);
