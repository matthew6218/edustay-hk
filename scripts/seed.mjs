const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5173';
if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base))throw new Error('Seed helper only targets a local demo server.');
const response=await fetch(base+'/api/health');
if(!response.ok)throw new Error('Start the server and apply database migrations first.');
console.log('Idempotent fictional seed is ready:',await response.json());
