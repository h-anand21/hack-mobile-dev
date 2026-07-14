import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [RESIDENT] Get notices
router.get('/', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;

    const { data: notices, error } = await supabaseAdmin
      .from('notices')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch notices' });
      return;
    }

    res.json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
