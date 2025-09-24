require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/content', require('./routes/content'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/library', require('./routes/library'));
app.use('/api/financials', require('./routes/financials'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/payment-requests', require('./routes/paymentRequests'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/client-attendance', require('./routes/clientAttendance'));
app.use('/api/daily-progress-reports', require('./routes/dailyProgressReports'));
app.use('/api/group-progress-reports', require('./routes/groupProgressReports'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/client-assessments', require('./routes/clientAssessments'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
// New form routes
app.use('/api/weekly-check-ins', require('./routes/weeklyCheckIns'));
app.use('/api/self-assessments', require('./routes/selfAssessments'));
app.use('/api/progress-trackers', require('./routes/progressTrackers'));
app.use('/api/final-evaluations', require('./routes/finalEvaluations'));

app.get('/', (req, res) => res.send('API Running'));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
