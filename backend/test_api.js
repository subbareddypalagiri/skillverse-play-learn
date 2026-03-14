import http from 'http';

http.get('http://localhost:5002/api/v1/courses', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('HTTP STATUS:', res.statusCode);
    const parsed = JSON.parse(data);
    console.log('API RESPONSE STRUCTURE:');
    console.log(JSON.stringify(parsed, null, 2).substring(0, 1000));
    process.exit(0);
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
  process.exit(1);
});
