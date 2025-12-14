
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knqvrvbplqwknlcbrbub.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucXZydmJwbHF3a25sY2JyYnViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE0NzA5MywiZXhwIjoyMDc3NzIzMDkzfQ.EDH3b-ghVmckAXfmFhxQW8mCieo1TSIM3xW8xGlnGnY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkNullPlan() {
  console.log('Testing fetch plan with null ID...');

  const { data: plan, error } = await supabase
    .from('plans')
    .select('interval, name')
    .eq('id', null)
    .single();

  if (error) {
    console.log('❌ Error fetching plan with null ID:', error.message);
    console.log('   Error details:', error);
  } else {
    console.log('✅ Fetched plan:', plan);
  }
}

checkNullPlan();
