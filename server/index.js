require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[SOCKET.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[SOCKET.IO] Client disconnected: ${socket.id}`);
  });
});

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/registrations', registrationRoutes);

app.get('/', (req, res) => {
  res.send('Hackspora 2.0 API server is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO listening for real-time connections`);
  console.log(`=================================`);
});

