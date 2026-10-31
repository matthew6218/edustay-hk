import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserTestEnvironment } from '../browser-demo-environment.mjs';

const origin = 'https://demo.example';
async function call(client, path, body) {
  const response = await client(origin + '/api/' + path, body === undefined ? {} : {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const result = await response.json();
  assert.equal(response.ok, true, JSON.stringify(result));
  return result;
}

test('demo login and saved homes survive a new page runtime without any server', async () => {
  const environment = createBrowserTestEnvironment();
  const session = { value: '' };
  const firstPage = environment.makeClient(session);
  await call(firstPage, 'auth/demo', { id: 'demo-student-1' });
  await call(firstPage, 'interactions', { listingId: 'home-1', action: 'SAVE' });
  const nextPage = environment.makeClient(session);
  assert.equal((await call(nextPage, 'bootstrap')).user.id, 'demo-student-1');
  assert.equal((await call(nextPage, 'listings?saved=true')).homes[0].id, 'home-1');
  await call(nextPage, 'auth/logout', {});
  assert.equal((await call(environment.makeClient(session), 'bootstrap')).user, null);
});

test('each browser gets isolated data and tabs retain their own demo role', async () => {
  const environment = createBrowserTestEnvironment();
  const student = environment.makeClient(), reviewer = environment.makeClient();
  await call(student, 'auth/demo', { id: 'demo-student-1' });
  await call(reviewer, 'auth/demo', { id: 'demo-admin' });
  assert.equal((await call(student, 'bootstrap')).user.role, 'STUDENT');
  assert.equal((await call(reviewer, 'bootstrap')).user.role, 'ADMIN');
  await call(reviewer, 'admin/review', { kind: 'listing', id: 'home-1', status: 'PAUSED', reason: 'Local browser review test' });
  assert.equal((await call(student, 'listings')).homes.some(home => home.id === 'home-1'), false);
  const otherBrowser = createBrowserTestEnvironment().makeClient();
  assert.equal((await call(otherBrowser, 'bootstrap')).user, null);
  assert.equal((await call(otherBrowser, 'listings')).homes.some(home => home.id === 'home-1'), true);
});

test('concurrent page requests preserve every saved home', async () => {
  const environment = createBrowserTestEnvironment(), session = { value: '' };
  const client = environment.makeClient(session);
  await call(client, 'auth/demo', { id: 'demo-student-1' });
  await Promise.all(['home-1', 'home-2', 'home-3'].map(listingId =>
    call(environment.makeClient(session), 'interactions', { listingId, action: 'SAVE' })));
  assert.equal((await call(client, 'listings?saved=true')).homes.length, 3);
});

test('local login works without browser-controlled Origin or Cookie headers', async () => {
  const client = createBrowserTestEnvironment().makeClient();
  const response = await client(origin + '/api/auth/demo', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'demo-student-1' }),
  });
  assert.equal(response.status, 200);
  assert.equal((await call(client, 'bootstrap')).user.id, 'demo-student-1');
});
