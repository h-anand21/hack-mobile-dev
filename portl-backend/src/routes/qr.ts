import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_QR_SECRET = process.env.JWT_QR_SECRET || 'default_qr_secret_change_me';

// [RESIDENT] Generate a QR pass for a guest
router.post('/generate', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, purpose, valid_until } = req.body;
    const flatId = req.user?.society_id; // Using society_id field from auth middleware, which we might need to map to flat_id correctly
    const residentId = req.user?.id;

    // Actually, resident's flat_id should be fetched
    const { data: flatData } = await supabaseAdmin
      .from('flat_members')
      .select('flat_id')
      .eq('user_id', residentId)
      .single();

    if (!flatData) {
      res.status(400).json({ error: 'Resident flat not found' });
      return;
    }

    // 1. Create a pre-approved visitor record
    const { data: visitor, error: visitorError } = await supabaseAdmin
      .from('visitors')
      .insert({
        society_id: req.user?.society_id,
        flat_id: flatData.flat_id,
        name,
        phone,
        purpose: purpose || 'Guest (QR Pass)',
        status: 'approved',
        created_by: residentId
      })
      .select()
      .single();

    if (visitorError || !visitor) {
      res.status(500).json({ error: 'Failed to create guest record' });
      return;
    }

    // 2. Generate JWT QR token
    const token = jwt.sign(
      { 
        visitorId: visitor.id, 
        flatId: flatData.flat_id,
        name: visitor.name
      }, 
      JWT_QR_SECRET, 
      { expiresIn: valid_until || '24h' }
    );

    res.status(201).json({ success: true, token, visitor });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [GUARD] Validate a scanned QR pass
router.post('/validate', requireRole(['guard']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    const guardId = req.user?.id;

    if (!token) {
      res.status(400).json({ error: 'Missing QR token' });
      return;
    }

    // 1. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_QR_SECRET);
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired QR pass' });
      return;
    }

    // 2. Fetch visitor record
    const { data: visitor, error } = await supabaseAdmin
      .from('visitors')
      .select('*')
      .eq('id', decoded.visitorId)
      .single();

    if (error || !visitor) {
      res.status(404).json({ error: 'Guest record not found' });
      return;
    }

    if (visitor.status !== 'approved') {
      res.status(400).json({ error: `Guest pass is currently ${visitor.status}` });
      return;
    }

    // 3. Mark as entered
    await supabaseAdmin
      .from('visitor_logs')
      .insert({
        visitor_id: visitor.id,
        action: 'entered',
        actor_id: guardId
      });

    res.json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
