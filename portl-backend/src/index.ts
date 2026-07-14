import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { verifyJWT, requireRole } from './middleware/auth';
import visitorRoutes from './routes/visitors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
