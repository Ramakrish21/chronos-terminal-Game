// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRoom,
  updateRoom,
  getRoom,
  movePlayer
} = require('../controllers/roomController');

// Create a new room
// POST /api/rooms
router.post('/', createRoom);

// Update an existing room (e.g., set exits)
// PUT /api/rooms/:roomId
router.put('/:roomId', updateRoom);

// Get room details
// GET /api/rooms/:roomId
router.get('/:roomId', getRoom);

// Move player in a direction
// POST /api/rooms/:roomId/move
// Body: { playerId, direction }
router.post('/:roomId/move', movePlayer);

module.exports = router;
