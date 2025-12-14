
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knqvrvbplqwknlcbrbub.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucXZydmJwbHF3a25sY2JyYnViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE0NzA5MywiZXhwIjoyMDc3NzIzMDkzfQ.EDH3b-ghVmckAXfmFhxQW8mCieo1TSIM3xW8xGlnGnY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkDatabase() {
  console.log('Checking database structure and permissions...');

  // 1. Check if plan_id column exists in orders
  console.log('\n1. Checking orders table for plan_id column...');
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('plan_id')
    .limit(1);

  if (orderError) {
    console.log('❌ Error accessing plan_id in orders:', orderError.message);
    if (orderError.message.includes('does not exist')) {
      console.log('   -> CONFIRMED: plan_id column is missing.');
    }
  } else {
    console.log('✅ plan_id column exists in orders.');
  }

  // 2. Check permissions for plans table (Try to insert a dummy plan)
  console.log('\n2. Checking insert permissions on plans table...');
  const dummyPlan = {
    name: 'Test Permission Plan',
    price: 1.00,
    interval: 'monthly',
    is_active: false
  };

  const { data: plan, error: planError } = await supabase
    .from('plans')
    .insert([dummyPlan])
    .select();

  if (planError) {
    console.log('❌ Error inserting into plans:', planError.message);
    if (planError.message.includes('policy')) {
      console.log('   -> CONFIRMED: RLS Policy is blocking insertion.');
    }
  } else {
    console.log('✅ Successfully inserted test plan (Permissions are OK).');
    // Cleanup
    if (plan && plan[0]) {
      await supabase.from('plans').delete().eq('id', plan[0].id);
    }
  }
}

checkDatabase();
