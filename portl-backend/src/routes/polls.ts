import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../services/supabase';

const router = Router();

// [RESIDENT] Get polls
router.get('/', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const societyId = req.user?.society_id;
    const residentId = req.user?.id;

    // Fetch active polls
    const { data: polls, error: pollsError } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });

    if (pollsError) {
      res.status(500).json({ error: 'Failed to fetch polls' });
      return;
    }

    // Fetch resident's votes
    const { data: votes } = await supabaseAdmin
      .from('votes')
      .select('poll_id, option_index')
      .eq('user_id', residentId);

    // Attach votes to polls
    const pollsWithVotes = polls?.map((poll: any) => {
      const myVote = votes?.find((v: any) => v.poll_id === poll.id);
      return {
        ...poll,
        my_vote: myVote ? myVote.option_index : null
      };
    });

    res.json({ success: true, polls: pollsWithVotes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [RESIDENT] Vote on a poll
router.post('/:id/vote', requireRole(['resident']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { option_index } = req.body;
    const residentId = req.user?.id;

    // Check if already voted
    const { data: existingVote } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('poll_id', id)
      .eq('user_id', residentId)
      .single();

    if (existingVote) {
      res.status(400).json({ error: 'You have already voted on this poll' });
      return;
    }

    // Insert vote
    const { error: voteError } = await supabaseAdmin
      .from('votes')
      .insert({
        poll_id: id,
        user_id: residentId,
        option_index
      });

    if (voteError) {
      res.status(500).json({ error: 'Failed to submit vote' });
      return;
    }

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
