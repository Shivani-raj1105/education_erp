const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { logger } = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/auth.routes');
const facultyRoutes = require('./routes/faculty.routes');
const roleRoutes = require('./routes/role.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const technicalEventRoutes = require('./routes/technicalEvent.routes');
const sportsActivityRoutes = require('./routes/sportsActivity.routes');
const culturalActivityRoutes = require('./routes/culturalActivity.routes');
const industryProjectRoutes = require('./routes/industryProject.routes');
const hackathonRoutes = require('./routes/hackathon.routes');
const otherCurricularRoutes = require('./routes/otherCurricular.routes');

// ─── Student List Module ───────────────────────────────────────────────────────
const slAuthRoutes       = require('./routes/slAuth.routes');
const studentListRoutes  = require('./routes/studentList.routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  }));
}

// ─── Static Files (Faculty Photos) ───────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);
// ─── Student Activities (legacy) ──────────────────────────────────────────────
app.use('/api/activities/technical', technicalEventRoutes);
app.use('/api/activities/sports', sportsActivityRoutes);
app.use('/api/activities/cultural', culturalActivityRoutes);
// ─── Enhanced Activities ──────────────────────────────────────────────────────
app.use('/api/activities/industry-projects', industryProjectRoutes);
app.use('/api/activities/hackathons', hackathonRoutes);
app.use('/api/activities/other-curricular', otherCurricularRoutes);

// ─── Student List Module Routes ───────────────────────────────────────────────
app.use('/api/hod/auth',         slAuthRoutes);
app.use('/api/hod/student-list', studentListRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
