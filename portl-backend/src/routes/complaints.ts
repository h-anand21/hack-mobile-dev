import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [RESIDENT] Create a new complaint
router.post('/', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category } = req.body;
    const residentId = req.user?.id;
    const societyId = req.user?.society_id;

    // Fetch resident's flat (if exists)
    const { data: flatData } = await supabaseAdmin
      .from('flat_members')
      .select('flat_id')
      .eq('user_id', residentId)
      .single();

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .insert({
        society_id: societyId,
        flat_id: flatData?.flat_id || null,
        user_id: residentId,
        title,
        description,
        category: category || 'General',
        status: 'open'
      })
      .select()
      .single();

    if (error || !complaint) {
      console.error('Create Complaint Error:', error);
      res.status(500).json({ error: 'Failed to create complaint', details: error?.message });
      return;
    }

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT/ADMIN] Get complaints
router.get('/', requireRole(['resident', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const residentId = req.user?.id;
    const role = req.user?.role;
    const societyId = req.user?.society_id;

    let query = supabaseAdmin
      .from('complaints')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    // If resident, only show their own complaints
    if (role === 'resident') {
      query = query.eq('user_id', residentId);
    }

    const { data: complaints, error } = await query;

    if (error) {
      console.error('Fetch Complaints Error:', error);
      res.status(500).json({ error: 'Failed to fetch complaints', details: error.message });
      return;
    }

    res.json({ success: true, complaints: complaints || [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [ADMIN] Update complaint status
router.patch('/:id', requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .update({
        status
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !complaint) {
      res.status(400).json({ error: 'Failed to update complaint' });
      return;
    }

    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
