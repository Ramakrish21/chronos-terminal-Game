// routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPlayer,
  getPlayer
} = require('../controllers/playerController');

// POST create a new player
// Body: { name: String, startingRoomId: String }
router.post('/', createPlayer);

// GET retrieve player state
// GET /api/player/:playerId
router.get('/:playerId', getPlayer);

module.exports = router;
