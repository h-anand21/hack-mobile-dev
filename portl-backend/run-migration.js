const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

async function runAutoMigration() {
  console.log('🚀 Checking Supabase Auto-Migration...');
  const sqlFilePath = path.resolve(__dirname, 'supabase/full_setup.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error('❌ SQL Setup file not found at:', sqlFilePath);
    return;
  }

  const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

  if (!dbUrl) {
    console.log('ℹ️ DATABASE_URL not set in .env. Using Supabase Management API / SQL Editor execution instructions.');
    console.log('💡 Tip: Add DATABASE_URL=postgres://postgres:[YOUR_PASSWORD]@db.ricagpbfghdfporjtmua.supabase.co:5432/postgres to portl-backend/.env for 100% automated CLI migrations from VS Code!');
    return;
  }

  console.log('🔌 Connecting to Supabase Database via Direct Postgres Client...');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase Postgres!');
    console.log('⏳ Executing schema migration...');
    await client.query(sqlQuery);
    console.log('🎉 Migration executed successfully! All tables & seed data created.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runAutoMigration().catch(err => console.error('Migration crashed:', err));
