// controllers/roomController.js
const Room = require('../models/Room');
const Player = require('../models/Player');

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @body    { name, description, timeFlowRate, exits? }
 */
exports.createRoom = async (req, res, next) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a room (e.g. set exits once you know other room IDs)
 * @route   PUT /api/rooms/:roomId
 * @body    Partial room fields, e.g. { exits: { north: "<otherRoomId>" } }
 */
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get details of a room by its ID
 * @route   GET /api/rooms/:roomId
 */
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId)
    //   .populate('objects', 'name description');


    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Move a player from current room to an adjacent room
 * @route   POST /api/rooms/:roomId/move
 * @body    { playerId: String, direction: String }
 */
exports.movePlayer = async (req, res, next) => {
  const { playerId, direction } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const currentRoom = await Room.findById(player.currentRoom);
    const targetRoomId = currentRoom.exits.get(direction);
    if (!targetRoomId) {
      return res.status(400).json({ message: `Cannot move ${direction} from here.` });
    }

    const targetRoom = await Room.findById(targetRoomId);
    if (!targetRoom) {
      return res.status(404).json({ message: 'Target room does not exist.' });
    }

    // Update player location
    player.currentRoom = targetRoomId;
    await player.save();

    // Return new room details
    const roomData = await Room.findById(targetRoomId)
    //   .populate('objects', 'name description');
    res.json({
      message: `Moved ${direction} to ${targetRoom.name}`,
      room: roomData
    });
  } catch (err) {
    next(err);
  }
};
