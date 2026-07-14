import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';
import { sendPushNotification } from '../services/push';

const router = Router();

// [GUARD] Create a new visitor request
router.post('/create', requireRole(['guard']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, purpose, vehicle_number, photo_url, flat_id } = req.body;
    const societyId = req.user?.society_id;
    const guardId = req.user?.id;

    if (!name || !phone || !purpose || !flat_id) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // 1. Insert visitor record
    const { data: visitor, error: visitorError } = await supabaseAdmin
      .from('visitors')
      .insert({
        society_id: societyId,
        flat_id,
        name,
        phone,
        purpose,
        vehicle_number,
        photo_url,
        status: 'pending',
        created_by: guardId
      })
      .select()
      .single();

    if (visitorError) {
      res.status(500).json({ error: 'Failed to create visitor', details: visitorError });
      return;
    }

    // 2. Insert into visitor_logs
    await supabaseAdmin.from('visitor_logs').insert({
      visitor_id: visitor.id,
      action: 'created',
      actor_id: guardId
    });

    // 3. Find residents of the flat to send Push Notification
    const { data: residents } = await supabaseAdmin
      .from('flat_members')
      .select('users(fcm_token)')
      .eq('flat_id', flat_id);

    if (residents && residents.length > 0) {
      const tokens: string[] = residents
        .map((r: any) => r.users?.fcm_token)
        .filter(Boolean);

      if (tokens.length > 0) {
        await sendPushNotification({
          to: tokens,
          title: 'New Visitor Request',
          body: `${name} is at the gate for ${purpose}.`,
          data: { visitorId: visitor.id, type: 'VISITOR_APPROVAL' }
        });
      }
    }

    res.status(201).json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT] Approve a visitor
router.post('/:id/approve', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const residentId = req.user?.id;

    // 1. Update visitor status
    const { data: visitor, error } = await supabaseAdmin
      .from('visitors')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();

    if (error || !visitor) {
      res.status(400).json({ error: 'Failed to approve visitor' });
      return;
    }

    // 2. Log action
    await supabaseAdmin.from('visitor_logs').insert({
      visitor_id: id,
      action: 'approved',
      actor_id: residentId
    });

    // 3. Notify the guard who created it
    const { data: guardUser } = await supabaseAdmin
      .from('users')
      .select('fcm_token')
      .eq('id', visitor.created_by)
      .single();

    if (guardUser?.fcm_token) {
      await sendPushNotification({
        to: guardUser.fcm_token,
        title: 'Visitor Approved',
        body: `Entry approved for ${visitor.name}`,
        data: { visitorId: visitor.id, status: 'approved' }
      });
    }

    res.json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT] Reject a visitor
router.post('/:id/reject', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const residentId = req.user?.id;

    const { data: visitor, error } = await supabaseAdmin
      .from('visitors')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', id)
      .select()
      .single();

    if (error || !visitor) {
      res.status(400).json({ error: 'Failed to reject visitor' });
      return;
    }

    await supabaseAdmin.from('visitor_logs').insert({
      visitor_id: id,
      action: 'rejected',
      actor_id: residentId
    });

    const { data: guardUser } = await supabaseAdmin
      .from('users')
      .select('fcm_token')
      .eq('id', visitor.created_by)
      .single();

    if (guardUser?.fcm_token) {
      await sendPushNotification({
        to: guardUser.fcm_token,
        title: 'Visitor Rejected',
        body: `Entry denied for ${visitor.name}. Reason: ${reason || 'None given'}`,
        data: { visitorId: visitor.id, status: 'rejected' }
      });
    }

    res.json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [GUARD/ADMIN] Get visitor history
router.get('/history', requireRole(['guard', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;
    
    // Fetch logs with joined visitor details
    const { data: logs, error } = await supabaseAdmin
      .from('visitor_logs')
      .select(`
        id,
        action,
        created_at,
        visitors!inner(
          id, name, phone, purpose, flat_id, status, society_id
        )
      `)
      .eq('visitors.society_id', societyId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      res.status(500).json({ error: 'Failed to fetch history', details: error.message });
      return;
    }

    res.json({ success: true, history: logs });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
