"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const timetable_1 = __importDefault(require("./routes/timetable"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/timetable', timetable_1.default);
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
app.use((err, req, res, next) => {
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
exports.default = app;
//# sourceMappingURL=index.js.map