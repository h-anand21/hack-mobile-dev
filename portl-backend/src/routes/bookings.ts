import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [RESIDENT] Get my bookings
router.get('/', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const residentId = req.user?.id;

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        amenities ( name, icon, location )
      `)
      .eq('user_id', residentId)
      .order('booking_date', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
      return;
    }

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT] Create booking
router.post('/', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const residentId = req.user?.id;
    const { amenity_id, booking_date, start_time, end_time } = req.body;

    // Check for conflicts
    const { data: conflicts } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('amenity_id', amenity_id)
      .eq('booking_date', booking_date)
      .eq('status', 'confirmed')
      .or(`and(start_time.lte.${start_time},end_time.gt.${start_time}),and(start_time.lt.${end_time},end_time.gte.${end_time})`);

    if (conflicts && conflicts.length > 0) {
      res.status(409).json({ error: 'Time slot is already booked' });
      return;
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        amenity_id,
        user_id: residentId,
        booking_date,
        start_time,
        end_time,
        status: 'confirmed' // Auto confirm for now
      })
      .select()
      .single();

    if (error || !booking) {
      res.status(500).json({ error: 'Failed to create booking' });
      return;
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT] Cancel booking
router.delete('/:id', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const residentId = req.user?.id;

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', residentId) // ensure they own it
      .select()
      .single();

    if (error || !data) {
      res.status(400).json({ error: 'Failed to cancel booking' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
