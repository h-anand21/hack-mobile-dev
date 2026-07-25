import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [ALL] Get notices for society
router.get('/', requireRole(['resident', 'admin', 'guard']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;

    const { data: notices, error } = await supabaseAdmin
      .from('notices')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch Notices Error:', error);
      res.status(500).json({ error: 'Failed to fetch notices', details: error.message });
      return;
    }

    res.json({ success: true, notices: notices || [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
