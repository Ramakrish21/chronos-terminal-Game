const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  // Exits: map of directions to other room IDs, e.g. { north: roomId, east: roomId }
  exits: {
    type: Map,
    of: mongoose.Schema.Types.ObjectId,
    default: {}
  },
  // Time flow rate multiplier: 1 = normal, >1 = faster, <1 = slower
  timeFlowRate: {
    type: Number,
    default: 1
  },
  // Any static objects in the room, referenced by their IDs
  objects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameObject'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
