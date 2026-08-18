const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');

test('health endpoint responds without Twilio env vars', async () => {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: '5100',
      TWILIO_ACCOUNT_SID: '',
      TWILIO_AUTH_TOKEN: '',
      TWILIO_PHONE_NUMBER: ''
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const health = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('Timed out waiting for server to start'));
    }, 5000);

    const tryRequest = () => {
      http.get('http://127.0.0.1:5100/health', (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          clearTimeout(timer);
          child.kill('SIGTERM');
          resolve({ statusCode: res.statusCode, body });
        });
      }).on('error', () => {
        setTimeout(tryRequest, 150);
      });
    };

    tryRequest();
  });

  assert.equal(health.statusCode, 200);
  assert.match(health.body, /Server is running/);
});
