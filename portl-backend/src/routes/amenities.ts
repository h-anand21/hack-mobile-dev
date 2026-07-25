import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

const defaultAmenities = [
  {
    id: 'a1',
    name: 'Fitness Gym & Yoga Studio',
    category: 'Sports & Fitness',
    timing: '06:00 AM - 10:00 PM',
    pricing: 'Free for Residents',
    pricePerHour: 0,
    status: 'Open',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'a2',
    name: 'Olympic Swimming Pool',
    category: 'Sports & Fitness',
    timing: '07:00 AM - 08:00 PM',
    pricing: 'Free for Residents',
    pricePerHour: 0,
    status: 'Open',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'a3',
    name: 'Indoor Badminton Court',
    category: 'Sports & Games',
    timing: '06:00 AM - 11:00 PM',
    pricing: '₹150 / hour',
    pricePerHour: 150,
    status: 'Open',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'a4',
    name: 'Grand Clubhouse & Event Hall',
    category: 'Community & Events',
    timing: '09:00 AM - 11:00 PM',
    pricing: '₹2,000 / event',
    pricePerHour: 500,
    status: 'Booking Open',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'a5',
    name: 'Table Tennis Arena',
    category: 'Indoor Games',
    timing: '08:00 AM - 10:00 PM',
    pricing: 'Free for Residents',
    pricePerHour: 0,
    status: 'Open',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'a6',
    name: 'Children Outdoor Play Area',
    category: 'Kids & Family',
    timing: '06:00 AM - 08:30 PM',
    pricing: 'Free',
    pricePerHour: 0,
    status: 'Open',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80'
  }
];

// [ALL] Get society amenities
router.get('/', requireRole(['resident', 'admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;

    const { data: amenities, error } = await supabaseAdmin
      .from('amenities')
      .select('*')
      .eq('society_id', societyId);

    if (error || !amenities || amenities.length === 0) {
      res.json({ success: true, amenities: defaultAmenities });
      return;
    }

    res.json({ success: true, amenities });
  } catch (error) {
    res.json({ success: true, amenities: defaultAmenities });
  }
});

export default router;
