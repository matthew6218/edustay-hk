import test from 'node:test';
import assert from 'node:assert/strict';
import { requestOrigin } from '../../lib/request-origin.ts';

test('origin uses the original host when Next normalizes loopback URLs', () => {
  const request = new Request('http://localhost:5180/api/profile', { headers: { host: '127.0.0.1:5180' } });
  assert.equal(requestOrigin(request), 'http://127.0.0.1:5180');
});

test('forwarded host cannot change the allowed origin', () => {
  const request = new Request('https://example.com/api/profile', { headers: { host: 'example.com', 'x-forwarded-host': 'attacker.example' } });
  assert.equal(requestOrigin(request), 'https://example.com');
});

test('malformed hosts cannot introduce credentials or URL paths', () => {
  for (const host of ['example.com@attacker.example', 'example.com/path', 'example.com,attacker.example']) {
    assert.throws(() => requestOrigin(new Request('https://example.com/api/profile', { headers: { host } })));
  }
});
