import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// Ensure all routes in this file are admin-only
router.use(requireRole(['admin']));

// [ADMIN] Get Analytics Dashboard Data
router.get('/analytics', async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;
    
    // 1. Visitor Counts (Pending, Approved, Entered)
    const { data: visitors } = await supabaseAdmin
      .from('visitors')
      .select('status')
      .eq('society_id', societyId);
      
    const visitorStats = {
      pending: visitors?.filter(v => v.status === 'pending').length || 0,
      approved: visitors?.filter(v => v.status === 'approved').length || 0,
      rejected: visitors?.filter(v => v.status === 'rejected').length || 0,
      total: visitors?.length || 0
    };

    // 2. Complaint Stats
    const { data: complaints } = await supabaseAdmin
      .from('complaints')
      .select('status')
      .eq('society_id', societyId);
      
    const complaintStats = {
      open: complaints?.filter(c => c.status === 'open').length || 0,
      in_progress: complaints?.filter(c => c.status === 'in_progress').length || 0,
      resolved: complaints?.filter(c => c.status === 'resolved').length || 0,
    };

    // 3. Maintenance Revenue
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount, status'); // in reality, join society_id via flats
      
    const revenue = {
      collected: payments?.filter(p => p.status === 'paid').reduce((acc, p) => acc + (p.amount || 0), 0) || 0,
      pending: payments?.filter(p => p.status === 'pending').reduce((acc, p) => acc + (p.amount || 0), 0) || 0,
    };

    res.json({
      success: true,
      data: {
        visitors: visitorStats,
        complaints: complaintStats,
        revenue
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [ADMIN] Create Notice
router.post('/notices', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    const societyId = req.user?.society_id;
    const adminId = req.user?.id;

    const { data: notice, error } = await supabaseAdmin
      .from('notices')
      .insert({
        society_id: societyId,
        created_by: adminId,
        title,
        content,
        category: category || 'general'
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to create notice' });
      return;
    }

    res.status(201).json({ success: true, notice });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [ADMIN] Create Poll
router.post('/polls', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, options, end_date } = req.body;
    const societyId = req.user?.society_id;
    const adminId = req.user?.id;

    const formattedOptions = options.map((opt: string) => ({ text: opt, votes: 0 }));

    const { data: poll, error } = await supabaseAdmin
      .from('polls')
      .insert({
        society_id: societyId,
        created_by: adminId,
        question,
        options: formattedOptions,
        end_date,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to create poll' });
      return;
    }

    res.status(201).json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [ADMIN] Get Residents
router.get('/residents', async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, phone, created_at')
      .eq('society_id', societyId)
      .eq('role', 'resident');

    if (error) {
      res.status(500).json({ error: 'Failed to fetch residents' });
      return;
    }

    res.json({ success: true, residents: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
