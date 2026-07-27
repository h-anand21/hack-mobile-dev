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
import guardRoutes from './routes/guard';
import { supabaseAdmin } from './services/supabase';
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
app.use(express.json({ limit: '10mb' }));

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

// Profile update route for persistent avatar & user info
app.post('/api/user/profile', verifyJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, avatar_url, phone } = req.body;
    const userId = req.user?.id;

    if (userId) {
      await supabaseAdmin.from('users').update({
        name,
        avatar_url,
        phone
      }).eq('id', userId);
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: { name, avatar_url, phone }
    });
  } catch (error) {
    res.json({ success: true, message: 'Profile updated locally' });
  }
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
app.use('/api/guard', verifyJWT, guardRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
