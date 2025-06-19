const Player = require('../models/Player');
const Room = require('../models/Room');

/**
 * @desc    Create a new player in the starting room
 * @route   POST /api/player
 * @body    { name: String, startingRoomId: String }
 */
exports.createPlayer = async (req, res, next) => {
  const { name, startingRoomId } = req.body;
  try {
    // Ensure starting room exists
    const startRoom = await Room.findById(startingRoomId);
    if (!startRoom) {
      return res.status(404).json({ message: 'Starting room not found' });
    }
    // Create and save player
    const player = new Player({ name, currentRoom: startingRoomId });
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get player state (location, inventory)
 * @route   GET /api/player/:playerId
 */
exports.getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.playerId)
      .populate('currentRoom', 'name description timeFlowRate')
    //   .populate('inventory', 'name description');
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    next(err);
  }
};
