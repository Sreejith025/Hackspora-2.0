require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const { clerkMiddleware } = require('@clerk/express');

const app = express();

const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(clerkMiddleware());

// Serve uploaded presentation files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const registrationRoutes = require('./routes/registrationRoutes');
const virtualRoundRoutes = require('./routes/virtualRoundRoutes');
const problemStatementRoutes = require('./routes/problemStatementRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

app.use('/api/registrations', registrationRoutes);
app.use('/api/virtual-round', virtualRoundRoutes);
app.use('/api/problem-statements', problemStatementRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/', (req, res) => {
  res.send('Hackspora 2.0 API server is running...');
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} (http://0.0.0.0:${PORT})`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
  }
};

startServer();
