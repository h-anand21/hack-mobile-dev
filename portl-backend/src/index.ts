import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { verifyJWT, requireRole } from './middleware/auth';
import visitorRoutes from './routes/visitors';
import qrRoutes from './routes/qr';
import complaintRoutes from './routes/complaints';
import amenityRoutes from './routes/amenities';
import bookingRoutes from './routes/bookings';
import maintenanceRoutes from './routes/maintenance';
import pollRoutes from './routes/polls';
import noticeRoutes from './routes/notices';
import adminRoutes from './routes/admin';
import { initAutoRejectJob } from './jobs/autoReject';
import { initRemindersJob } from './jobs/reminders';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Initialize Background Jobs
initAutoRejectJob();
initRemindersJob();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Portl API is running' });
});

// Test protected route
app.get('/api/me', verifyJWT, (req: Request, res: Response) => {
  res.json({ 
    message: 'Authentication successful', 
    user: req.user 
  });
});

// App Routes
app.use('/api/visitors', verifyJWT, visitorRoutes);
app.use('/api/qr', verifyJWT, qrRoutes);
app.use('/api/complaints', verifyJWT, complaintRoutes);
app.use('/api/amenities', verifyJWT, amenityRoutes);
app.use('/api/bookings', verifyJWT, bookingRoutes);
app.use('/api/maintenance', verifyJWT, maintenanceRoutes);
app.use('/api/polls', verifyJWT, pollRoutes);
app.use('/api/notices', verifyJWT, noticeRoutes);
app.use('/api/admin', verifyJWT, adminRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
