
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://knqvrvbplqwknlcbrbub.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucXZydmJwbHF3a25sY2JyYnViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE0NzA5MywiZXhwIjoyMDc3NzIzMDkzfQ.EDH3b-ghVmckAXfmFhxQW8mCieo1TSIM3xW8xGlnGnY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkOrders() {
  console.log('Fetching last 5 orders...');

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, merchant_oid, status, plan_id, product_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    console.log('Last 5 orders:');
    console.table(orders);
  }
}

checkOrders();
