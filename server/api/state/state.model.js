'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ElevatorSchema = new Schema({
  name: String,
  currentLevel: String,
  origin: Number,
  destination: Number,
  people: Number,
  state: String
});

// The StateSchema stores the current timestamp, as well as the elevator instances at that point of time
var StateSchema = new Schema({
  date: { type: Date, default: Date.now()},
  elevators: [ ElevatorSchema ]
});

module.exports = mongoose.model('State', StateSchema);
