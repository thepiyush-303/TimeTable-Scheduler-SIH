import express from 'express';
import cors from 'cors';
import timetableRoutes from './routes/timetable';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/timetable', timetableRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Timetable Scheduler API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      timetable: '/api/timetable/*'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Timetable Scheduler Backend running on port ${PORT}`);
  console.log(`📊 API Documentation available at http://localhost:${PORT}`);
});

export default app;