import cron from 'node-cron';
import { supabaseAdmin } from '../services/supabase';

// Run every 60 seconds
export const initAutoRejectJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      // Find visitors pending for more than 2 minutes
      const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      const { data: expiredVisitors, error } = await supabaseAdmin
        .from('visitors')
        .select('id')
        .eq('status', 'pending')
        .lt('created_at', twoMinsAgo);

      if (error) {
        // Silently skip if visitors table is not seeded/configured in Supabase
        if (error.code !== 'PGRST205' && !error.message?.includes('schema cache')) {
          console.error('Error checking expired visitors:', error.message);
        }
        return;
      }

      if (expiredVisitors && expiredVisitors.length > 0) {
        const ids = expiredVisitors.map(v => v.id);
        
        // Auto-reject them
        await supabaseAdmin
          .from('visitors')
          .update({ status: 'rejected' })
          .in('id', ids);
          
        console.log(`✅ Auto-rejected ${ids.length} expired visitor requests.`);
      }
    } catch (error: any) {
      // Ignore background job errors when DB is disconnected
    }
  });
};
