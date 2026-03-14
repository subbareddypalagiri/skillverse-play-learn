// Run: node test_signup.js
const testSignup = async () => {
  console.log('=== Testing Backend Connection ===\n');

  // 1. Health check
  try {
    const healthRes = await fetch('http://localhost:5002/health');
    const health = await healthRes.json();
    console.log('✅ Backend is running:', health.message);
  } catch (e) {
    console.error('❌ Backend NOT reachable at http://localhost:5002');
    console.error('   Error:', e.message);
    console.error('\n   👉 Start the backend: cd backend && node server.js');
    return;
  }

  // 2. Test signup
  console.log('\n=== Testing Signup ===\n');
  try {
    const res = await fetch('http://localhost:5002/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser_' + Date.now() + '@gmail.com',
        password: 'TestPass123'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Signup works! Got tokens:', !!data.data?.tokens);
    } else {
      console.log('\n❌ Signup failed:', data.message);
    }
  } catch (e) {
    console.error('❌ Signup request failed:', e.message);
  }

  // 3. Test login
  console.log('\n=== Testing Login ===\n');
  try {
    const res = await fetch('http://localhost:5002/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'subbareddypalagiri510@gmail.com',
        password: 'TestPass123'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('❌ Login request failed:', e.message);
  }
};

testSignup();
