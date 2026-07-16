import cron from 'node-cron';
import { supabaseAdmin } from '../services/supabase';
import { sendPushNotification } from '../services/push';

export const initRemindersJob = () => {
  // Run every day at 9:00 AM for maintenance dues
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('⏳ Running daily maintenance reminder job...');
      const { data: dues } = await supabaseAdmin
        .from('payments')
        .select(`
          id, amount, month, year, flat_id,
          flats (
            flat_members (
              users ( fcm_token )
            )
          )
        `)
        .eq('status', 'pending');

      if (dues) {
        let sentCount = 0;
        for (const due of dues) {
          // Handle Supabase join array or object mapping
          const flatObj = Array.isArray(due.flats) ? due.flats[0] : due.flats;
          const members = flatObj && (flatObj as any).flat_members ? (flatObj as any).flat_members : [];
          
          for (const member of members) {
            const token = member.users?.fcm_token;
            if (token) {
              await sendPushNotification({
                to: token,
                title: 'Maintenance Due',
                body: `Your maintenance of ₹${due.amount} for ${due.month} ${due.year} is pending.`,
                data: { route: '/(resident)/payments' }
              });
              sentCount++;
            }
          }
        }
        console.log(`✅ Sent ${sentCount} maintenance reminders.`);
      }
    } catch (error) {
      console.error('Failed to run maintenance reminders:', error);
    }
  });

  // Run every hour to check for upcoming bookings (within 1-2 hours)
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('⏳ Running hourly booking reminder job...');
      // Logic would be similar: fetch bookings where start_time is between now+1h and now+2h
      // For demo, we just print a log.
    } catch (error) {
      console.error(error);
    }
  });
};
