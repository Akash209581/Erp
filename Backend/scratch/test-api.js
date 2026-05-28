import http from 'http';
import fs from 'fs';

http.get('http://localhost:3000/transport/buses', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('API RESPONSE:', data);
    fs.writeFileSync('scratch/api-test.txt', data);
  });
}).on('error', (err) => {
  console.log('API ERROR:', err.message);
  fs.writeFileSync('scratch/api-test.txt', 'ERROR: ' + err.message);
});
