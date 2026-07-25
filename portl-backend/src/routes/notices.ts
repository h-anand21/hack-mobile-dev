import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

const defaultNotices = [
  {
    id: 'n1',
    title: 'Independence Day Celebration 🇮🇳',
    content: 'Flag hoisting ceremony at 8:30 AM in Central Park, followed by cultural programs & refreshments.',
    category: 'Events',
    priority: 'high',
    pinned: true,
    date: '15 Aug 2025',
    created_at: '2025-08-10T10:00:00Z'
  },
  {
    id: 'n2',
    title: 'Water Supply Maintenance',
    content: 'Scheduled tank cleaning for Tower A & B. Water supply will be paused from 10 AM to 12 PM.',
    category: 'Maintenance',
    priority: 'high',
    pinned: false,
    date: '18 May 2025',
    created_at: '2025-05-17T08:00:00Z'
  },
  {
    id: 'n3',
    title: 'Lift Maintenance Schedule',
    content: 'Elevator 2 in Tower B undergoing routine servicing.',
    category: 'Maintenance',
    priority: 'medium',
    pinned: false,
    date: '17 May 2025',
    created_at: '2025-05-16T09:00:00Z'
  },
  {
    id: 'n4',
    title: 'Annual General Meeting (AGM)',
    content: 'All flat owners are invited for AGM at Clubhouse Hall on Sunday 5:00 PM.',
    category: 'Society',
    priority: 'medium',
    pinned: false,
    date: '16 May 2025',
    created_at: '2025-05-15T14:00:00Z'
  },
  {
    id: 'n5',
    title: 'Parking Rules Reminder',
    content: 'Park only in designated visitor slots. Unauthorized vehicles will be stickered.',
    category: 'Society',
    priority: 'medium',
    pinned: false,
    date: '15 May 2025',
    created_at: '2025-05-14T11:00:00Z'
  },
  {
    id: 'n6',
    title: 'Community Fest – Save the Date!',
    content: 'Diwali Mela stall registrations open at management desk.',
    category: 'Events',
    priority: 'low',
    pinned: false,
    date: '14 May 2025',
    created_at: '2025-05-13T16:00:00Z'
  }
];

// [ALL] Get notices for society
router.get('/', requireRole(['resident', 'admin', 'guard']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;

    const { data: notices, error } = await supabaseAdmin
      .from('notices')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    if (error || !notices || notices.length === 0) {
      res.json({ success: true, notices: defaultNotices });
      return;
    }

    res.json({ success: true, notices });
  } catch (error) {
    res.json({ success: true, notices: defaultNotices });
  }
});

export default router;
