const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedDemoUsers() {
  console.log('🚀 Seeding demo users to Supabase...');

  // 1. Create or get Demo Society
  const societyId = '11111111-1111-1111-1111-111111111111';
  const { data: society, error: socError } = await supabase
    .from('societies')
    .upsert({
      id: societyId,
      name: 'Portl Grand Residency',
      address: '123 Smart City, Sector 4, Bangalore',
      code: 'PORTL-001'
    })
    .select()
    .single();

  if (socError) {
    console.error('Failed to create demo society:', socError.message);
  } else {
    console.log('✅ Demo society ready:', society.name);
  }

  // 2. Demo Users list
  const usersToSeed = [
    {
      email: 'admin@portl.com',
      password: 'pass123',
      name: 'Demo Admin',
      role: 'admin',
      phone: '+919999900001'
    },
    {
      email: 'guard@portl.com',
      password: 'pass123',
      name: 'Demo Guard',
      role: 'guard',
      phone: '+919999900002'
    },
    {
      email: 'resident@portl.com',
      password: 'pass123',
      name: 'Demo Resident',
      role: 'resident',
      phone: '+919999900003'
    }
  ];

  for (const u of usersToSeed) {
    console.log(`\nProcessing user: ${u.email}...`);

    // Check if auth user exists or create
    let authUser = null;
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existing = listData?.users?.find(user => user.email === u.email);

    if (existing) {
      console.log(`User ${u.email} already exists in auth. Updating password...`);
      const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(
        existing.id,
        { password: u.password, email_confirm: true }
      );
      if (updateErr) console.error('Update error:', updateErr.message);
      authUser = updated.user;
    } else {
      console.log(`Creating user ${u.email} in auth...`);
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name, role: u.role }
      });
      if (createErr) {
        console.error('Create auth user error:', createErr.message);
        continue;
      }
      authUser = created.user;
    }

    if (authUser) {
      // Upsert into public.users table
      const { error: profileErr } = await supabase
        .from('users')
        .upsert({
          id: authUser.id,
          name: u.name,
          role: u.role,
          phone: u.phone,
          society_id: societyId
        });

      if (profileErr) {
        console.error(`Profile creation failed for ${u.email}:`, profileErr.message);
      } else {
        console.log(`🎉 Demo user ${u.email} (${u.role}) is 100% READY!`);
      }
    }
  }

  console.log('\n✨ ALL DEMO USERS CREATED SUCCESSFULLY!');
}

seedDemoUsers().catch(err => console.error('Seed script crashed:', err));
