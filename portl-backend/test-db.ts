import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log('Testing connection to:', supabaseUrl);
  try {
    // We query auth.users which should be accessible by service_role
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connected successfully! Found', data.users.length, 'users.');
    }
  } catch (err: any) {
    console.error('Failed to connect:', err.message);
  }
}

checkConnection();
