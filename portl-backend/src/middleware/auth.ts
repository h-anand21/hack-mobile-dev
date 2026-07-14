import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../services/supabase';

// Extend Express Request interface to include our custom user object
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        society_id?: string;
        email?: string;
      };
    }
  }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
      return;
    }

    // Fetch custom user details from our users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role, society_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      res.status(401).json({ error: 'User profile not found in database' });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email || undefined,
      role: userData.role,
      society_id: userData.society_id || undefined
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// Middleware to enforce specific roles
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(401).json({ error: 'Unauthorized: No role found' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
