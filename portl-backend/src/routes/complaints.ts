import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [RESIDENT] Create a new complaint
router.post('/', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, priority } = req.body;
    const residentId = req.user?.id;
    const societyId = req.user?.society_id;

    // Fetch resident's flat
    const { data: flatData } = await supabaseAdmin
      .from('flat_members')
      .select('flat_id')
      .eq('user_id', residentId)
      .single();

    if (!flatData) {
      res.status(400).json({ error: 'Resident flat not found' });
      return;
    }

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .insert({
        society_id: societyId,
        flat_id: flatData.flat_id,
        created_by: residentId,
        title,
        description,
        category: category || 'general',
        priority: priority || 'low',
        status: 'open'
      })
      .select()
      .single();

    if (error || !complaint) {
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
      .select(`
        *,
        flats ( number, block )
      `)
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    // If resident, only show their own complaints
    if (role === 'resident') {
      query = query.eq('created_by', residentId);
    }

    const { data: complaints, error } = await query;

    if (error) {
      res.status(500).json({ error: 'Failed to fetch complaints' });
      return;
    }

    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [ADMIN] Update complaint status
router.patch('/:id', requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, resolution_notes } = req.body;

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .update({
        status,
        resolution_notes,
        updated_at: new Date().toISOString(),
        resolved_at: status === 'resolved' ? new Date().toISOString() : null
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
