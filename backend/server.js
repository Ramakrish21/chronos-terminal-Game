// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const playerRoutes = require('./routes/playerRoutes');


dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chronos Terminal API is running...');
});
app.use('/api/rooms', roomRoutes);
app.use('/api/player', playerRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
