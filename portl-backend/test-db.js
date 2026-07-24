const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load backend .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
// Load frontend .env
const frontendEnv = dotenv.config({ path: path.resolve(__dirname, '../portl-app/.env') }).parsed || {};

const url = process.env.SUPABASE_URL || frontendEnv.EXPO_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = frontendEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- SUPABASE DEEP CONNECTIVITY CHECK ---');
console.log('Target URL:', url);

async function testBackend() {
  console.log('\n1. Testing Backend Admin Client (Service Role Key)...');
  try {
    const supabaseAdmin = createClient(url, serviceKey);
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('❌ Backend Auth failed:', error.message);
    } else {
      console.log('✅ Backend Auth connected successfully! Current users count:', data.users.length);
    }

    // Check if tables exist in the DB
    const { data: usersData, error: usersErr } = await supabaseAdmin.from('users').select('count', { count: 'exact', head: true });
    if (usersErr) {
      console.log('⚠️ Database tables notice:', usersErr.message, '(Need to run migration SQL if not done yet)');
    } else {
      console.log('✅ Database tables exist and connected!');
    }
  } catch (err) {
    console.error('❌ Backend exception:', err.message);
  }
}

async function testFrontend() {
  console.log('\n2. Testing Frontend Client (Anon Public Key)...');
  try {
    const supabaseAnon = createClient(url, anonKey);
    const { data, error } = await supabaseAnon.auth.getSession();
    if (error) {
      console.error('❌ Frontend Auth failed:', error.message);
    } else {
      console.log('✅ Frontend Anon client initialized successfully!');
    }
  } catch (err) {
    console.error('❌ Frontend exception:', err.message);
  }
}

async function run() {
  await testBackend();
  await testFrontend();
  console.log('\n--- CHECK COMPLETE ---');
}

run();
