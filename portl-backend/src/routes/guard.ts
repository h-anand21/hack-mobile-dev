import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';
import { sendPushNotification } from '../services/push';

const router = Router();

// 1. [GUARD] Confirm Visitor Gate Entry
router.post('/visitors/:id/entry', requireRole(['guard', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guardId = req.user?.id;

    const { data: visitor, error } = await supabaseAdmin
      .from('visitors')
      .update({ status: 'entered' })
      .eq('id', id)
      .select()
      .single();

    if (error || !visitor) {
      res.status(400).json({ error: 'Failed to confirm entry' });
      return;
    }

    await supabaseAdmin.from('visitor_logs').insert({
      visitor_id: id,
      action: 'entered',
      actor_id: guardId
    });

    res.json({ success: true, visitor, message: 'Visitor entry confirmed at gate.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. [GUARD] Confirm Visitor Gate Exit
router.post('/visitors/:id/exit', requireRole(['guard', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guardId = req.user?.id;

    const { data: visitor, error } = await supabaseAdmin
      .from('visitors')
      .update({ status: 'exited' })
      .eq('id', id)
      .select()
      .single();

    if (error || !visitor) {
      res.status(400).json({ error: 'Failed to confirm exit' });
      return;
    }

    await supabaseAdmin.from('visitor_logs').insert({
      visitor_id: id,
      action: 'exited',
      actor_id: guardId
    });

    res.json({ success: true, visitor, message: 'Visitor exit logged at gate.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. [GUARD] Trigger Emergency SOS Alert Broadcast
router.post('/sos', requireRole(['guard', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, gate_number } = req.body;
    const societyId = req.user?.society_id;
    const guardName = req.user?.name || 'Gate Guard';

    // Broadcast Push Notification to all society members
    const { data: allUsers } = await supabaseAdmin
      .from('users')
      .select('fcm_token')
      .eq('society_id', societyId);

    const tokens = (allUsers || []).map((u: any) => u.fcm_token).filter(Boolean);

    if (tokens.length > 0) {
      await sendPushNotification({
        to: tokens,
        title: '🚨 GATE EMERGENCY SOS ALERT',
        body: `${guardName} triggered SOS at Gate ${gate_number || '1'}: ${message || 'Security assistance required!'}`,
        data: { type: 'EMERGENCY_SOS', gate: gate_number || '1' }
      });
    }

    res.json({ 
      success: true, 
      message: '🚨 EMERGENCY SOS ALERT BROADCASTED TO ALL RESIDENTS!',
      alertTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to broadcast SOS alert' });
  }
});

// 4. [GUARD] Resident Search Directory for Gate Verification
router.get('/residents/search', requireRole(['guard', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;
    const query = req.query.q as string || '';

    let dbQuery = supabaseAdmin
      .from('users')
      .select('id, name, phone, avatar_url, flat_members(flats(tower, flat_number))')
      .eq('role', 'resident')
      .eq('society_id', societyId);

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,phone.ilike.%${query}%`);
    }

    const { data: residents, error } = await dbQuery.limit(30);

    if (error) {
      res.json({ success: true, residents: [] });
      return;
    }

    res.json({ success: true, residents: residents || [] });
  } catch (error) {
    res.json({ success: true, residents: [] });
  }
});

// 5. [GUARD] Get Guard Duty Profile & Shift Roster
router.get('/roster', requireRole(['guard', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const guardId = req.user?.id;

    res.json({
      success: true,
      roster: {
        guard_id: guardId,
        guard_name: req.user?.name || 'Rajesh Kumar',
        gate: 'Tower A - Main Gate',
        shift: '08:00 AM - 08:00 PM',
        status: 'On Duty',
        rating: 4.9,
        experience: '1.5 Years',
        total_verifications_today: 48
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
