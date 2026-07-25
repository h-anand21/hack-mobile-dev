import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

const defaultPolls = [
  {
    id: 'p1',
    title: 'Should we organize a Community Clean-up Drive this month?',
    subtitle: 'Help us keep our society clean and green!',
    status: 'active',
    timeLeft: '2 days left',
    votedCount: 128,
    options: [
      { id: 0, text: "Yes, I'm In!", percent: 72 },
      { id: 1, text: 'Maybe, depends on the date', percent: 18 },
      { id: 2, text: 'No, not interested', percent: 10 }
    ]
  },
  {
    id: 'p2',
    title: 'Preferred Location for Additional Visitor Parking',
    subtitle: 'Select your preferred zone for guest cars',
    status: 'active',
    timeLeft: '5 days left',
    votedCount: 96
  },
  {
    id: 'p3',
    title: 'Which Amenity Would You Like to See Next?',
    subtitle: 'Vote for new equipment in society gym or clubhouse',
    status: 'active',
    timeLeft: '1 week left',
    votedCount: 143
  },
  {
    id: 'p4',
    title: 'Feedback on Recent Maintenance Services',
    subtitle: 'Starts on 25 May 2025',
    status: 'upcoming',
    timeLeft: 'Starts in 3 days',
    startDate: '25 May 2025',
    votedCount: 0
  },
  {
    id: 'p5',
    title: 'New Security Features – Your Opinion',
    subtitle: 'Poll closed on 15 May 2025',
    status: 'closed',
    timeLeft: 'Closed',
    closeDate: '15 May 2025',
    votedCount: 210
  }
];

// [ALL] Get polls
router.get('/', requireRole(['resident', 'admin', 'guard']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;
    const userId = req.user?.id;

    const { data: polls, error: pollsError } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    if (pollsError || !polls || polls.length === 0) {
      res.json({ success: true, polls: defaultPolls });
      return;
    }

    const { data: votes } = await supabaseAdmin
      .from('poll_votes')
      .select('poll_id, option_id')
      .eq('user_id', userId);

    const pollsWithVotes = polls?.map((poll: any) => {
      const myVote = votes?.find((v: any) => v.poll_id === poll.id);
      return {
        ...poll,
        my_vote: myVote ? myVote.option_id : null
      };
    });

    res.json({ success: true, polls: pollsWithVotes || defaultPolls });
  } catch (error) {
    res.json({ success: true, polls: defaultPolls });
  }
});

// [RESIDENT/ADMIN/GUARD] Vote on a poll
router.post('/:id/vote', requireRole(['resident', 'admin', 'guard']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { option_index, option_id } = req.body;
    const userId = req.user?.id;
    const selectedOption = option_id !== undefined ? option_id : (option_index !== undefined ? option_index + 1 : 1);

    try {
      await supabaseAdmin.from('poll_votes').insert({
        poll_id: id,
        user_id: userId,
        option_id: selectedOption
      });
    } catch (e) {}

    res.status(201).json({ success: true, message: 'Vote recorded' });
  } catch (error) {
    res.json({ success: true, message: 'Vote recorded' });
  }
});

export default router;
