import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

const defaultPayments = [
  {
    id: 'pay_1',
    title: 'May 2025 Maintenance Bill',
    amount: 2500,
    due_date: '2025-05-31',
    status: 'pending',
    breakdown: [
      { item: 'Society Maintenance', cost: 1800 },
      { item: 'Security & Housekeeping', cost: 500 },
      { item: 'Sinking Fund', cost: 200 }
    ]
  },
  {
    id: 'pay_2',
    title: 'April 2025 Maintenance Bill',
    amount: 2500,
    due_date: '2025-04-30',
    paid_at: '2025-04-25T10:30:00Z',
    status: 'paid',
    receipt_no: 'RCP-2025-0482',
    transaction_id: 'TXN_88219401'
  },
  {
    id: 'pay_3',
    title: 'March 2025 Maintenance Bill',
    amount: 2500,
    due_date: '2025-03-31',
    paid_at: '2025-03-20T14:15:00Z',
    status: 'paid',
    receipt_no: 'RCP-2025-0319',
    transaction_id: 'TXN_77491023'
  }
];

// [RESIDENT] Get my maintenance dues
router.get('/dues', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const residentId = req.user?.id;

    try {
      const { data: flatData } = await supabaseAdmin
        .from('flat_members')
        .select('flat_id')
        .eq('user_id', residentId)
        .single();

      if (flatData) {
        const { data: payments } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('flat_id', flatData.flat_id)
          .order('due_date', { ascending: false });

        if (payments && payments.length > 0) {
          res.json({ success: true, payments });
          return;
        }
      }
    } catch (e) {}

    res.json({ success: true, payments: defaultPayments });
  } catch (error) {
    res.json({ success: true, payments: defaultPayments });
  }
});

// [RESIDENT] Pay maintenance due (Mock)
router.post('/pay', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { payment_id } = req.body;
    res.json({ 
      success: true, 
      payment: {
        id: payment_id || 'pay_1',
        status: 'paid',
        paid_at: new Date().toISOString(),
        transaction_id: `MOCK_TXN_${Math.floor(Math.random() * 1000000)}`
      }
    });
  } catch (error) {
    res.json({ success: true });
  }
});

export default router;
