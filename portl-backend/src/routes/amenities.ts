import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [ALL] Get society amenities
router.get('/', requireRole(['resident', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;

    const { data: amenities, error } = await supabaseAdmin
      .from('amenities')
      .select('*')
      .eq('society_id', societyId)
      .eq('is_active', true);

    if (error) {
      res.status(500).json({ error: 'Failed to fetch amenities' });
      return;
    }

    res.json({ success: true, amenities });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
