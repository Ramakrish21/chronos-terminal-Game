const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  currentRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  
//   inventory: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'GameObject'
//   }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
