const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// CORS with allowlist
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Basic rate limiter for all requests (tunable)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(limiter);

// Import Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stats', statsRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('MediBook API is running...');
});

// Error Handling Middleware (optional for now)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is missing. Set it in backend/.env before starting the server.');
    process.exit(1);
}

// Start server regardless of DB connection (so APIs can still be tested/run)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
let dbConnected = false;

mongoose.connect(MONGO_URI)
    .then(() => {
        dbConnected = true;
        console.log('Connected to MongoDB Successfully!');
    })
    .catch((error) => {
        dbConnected = false;
        console.error('MongoDB connection error (Network/DNS Block):', error.message);
        console.log('Please note: The API server is still running, but database features will wait for network resolution.');
    });

mongoose.connection.on('connected', () => {
    dbConnected = true;
    console.log('Mongoose: connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
    dbConnected = false;
    console.warn('Mongoose: disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
    dbConnected = false;
    console.error('Mongoose connection error:', err && err.message);
});