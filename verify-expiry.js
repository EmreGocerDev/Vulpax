
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knqvrvbplqwknlcbrbub.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucXZydmJwbHF3a25sY2JyYnViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE0NzA5MywiZXhwIjoyMDc3NzIzMDkzfQ.EDH3b-ghVmckAXfmFhxQW8mCieo1TSIM3xW8xGlnGnY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkExpiryColumn() {
  console.log('Checking for expiry_date column in orders...');

  const { data, error } = await supabase
    .from('orders')
    .select('expiry_date')
    .limit(1);

  if (error) {
    console.log('❌ Error accessing expiry_date:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('   -> CONFIRMED: expiry_date column is missing.');
    }
  } else {
    console.log('✅ expiry_date column exists.');
  }
}

checkExpiryColumn();
