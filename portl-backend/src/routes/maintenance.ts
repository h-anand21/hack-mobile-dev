import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [RESIDENT] Get my maintenance dues
router.get('/dues', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const residentId = req.user?.id;

    // First find the flat
    const { data: flatData } = await supabaseAdmin
      .from('flat_members')
      .select('flat_id')
      .eq('user_id', residentId)
      .single();

    if (!flatData) {
      res.status(400).json({ error: 'Resident flat not found' });
      return;
    }

    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('flat_id', flatData.flat_id)
      .order('due_date', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch dues' });
      return;
    }

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT] Pay maintenance due (Mock)
router.post('/pay', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { payment_id } = req.body;
    
    // In reality, this would initiate a Razorpay/Stripe order.
    // For this demo, we'll just mock it and mark as paid immediately.
    
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        transaction_id: `MOCK_TXN_${Math.floor(Math.random() * 1000000)}`
      })
      .eq('id', payment_id)
      .select()
      .single();

    if (error || !payment) {
      res.status(400).json({ error: 'Payment failed' });
      return;
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
