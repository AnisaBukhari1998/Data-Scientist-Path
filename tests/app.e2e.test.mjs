// Browser tests for the app, run against the local Firebase emulators (never the real project).
// Run with: npm run test:e2e   (starts the emulators, then this file starts the app)
import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 5179;
const APP = `http://localhost:${PORT}`;
const PROJECT = 'data-sci-path-v2-543'; // the emulator uses this name; no real data is touched
const FS = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const AUTH = 'http://127.0.0.1:9099';
const ADMIN = { Authorization: 'Bearer owner' }; // emulator-only admin access

let server, browser;

before(async () => {
  server = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
    env: { ...process.env, VITE_USE_EMULATORS: 'true' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(APP)).ok) break; } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 500));
  }
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.kill();
});

// ---------- helpers ----------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function newPage() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // Skip the first-visit guided tour so it doesn't cover the page.
  await page.addInitScript(() => { try { localStorage.setItem('onboarding-completed', 'true'); } catch { /* ignore */ } });
  return { context, page, errors };
}

// Complete the emulator's stand-in Google sign-in window.
async function googlePopup(context, page, clickSelector, email) {
  const [popup] = await Promise.all([context.waitForEvent('page'), page.click(clickSelector)]);
  await popup.waitForLoadState('load');
  const existing = popup.locator(`text=${email}`);
  if (await existing.count()) {
    await existing.first().click();
  } else {
    await popup.click('button:has-text("Add new account")');
    await popup.fill('#email-input', email);
    await popup.fill('#display-name-input', email.split('@')[0]);
    await popup.click('button:has-text("Sign in with Google.com")');
  }
  await popup.waitForEvent('close', { timeout: 15000 }).catch(() => {});
}

async function signIn(context, page) {
  const email = `test${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
  await page.goto(APP, { waitUntil: 'load' });
  await page.click('button:has-text("Sign in with Google")');
  await googlePopup(context, page, 'button:has-text("Continue with Google")', email);
  await page.waitForSelector('button:has-text("Sign in with Google")', { state: 'detached', timeout: 15000 });
  const uid = await page.evaluate(() => new Promise(resolve => {
    const req = indexedDB.open('firebaseLocalStorageDb');
    req.onsuccess = () => {
      const all = req.result.transaction('firebaseLocalStorage').objectStore('firebaseLocalStorage').getAll();
      all.onsuccess = () => resolve(all.result.find(x => x.value?.uid)?.value.uid);
    };
  }));
  return { email, uid };
}

// Documents in a collection that belong to uid (by document ID or authorId field).
async function countOwned(path, uid) {
  const data = await (await fetch(`${FS}/${path}?pageSize=500`, { headers: ADMIN })).json();
  return (data.documents || []).filter(d => d.name.endsWith(`/${uid}`) || d.fields?.authorId?.stringValue === uid).length;
}

async function waitForOwned(path, uid) {
  for (let i = 0; i < 40; i++) {
    if (await countOwned(path, uid) > 0) return true;
    await sleep(500);
  }
  return false;
}

// ---------- tests ----------
describe('pages', () => {
  const routes = ['/', '/plan', '/dashboard', '/phase/phase1', '/phase/phase5', '/focus', '/flashcards', '/skills',
    '/interview', '/settings', '/success', '/jobs', '/sandbox', '/capstone', '/community', '/portfolio',
    '/architecture', '/leaderboard', '/profile'];

  test('every page opens without errors', async () => {
    const { context, page, errors } = await newPage();
    for (const route of routes) {
      await page.goto(APP + route, { waitUntil: 'load' });
      await sleep(800);
      assert.ok((await page.textContent('#root')).trim().length > 100, `${route} looks empty`);
    }
    assert.deepEqual(errors, [], 'page errors');
    await context.close();
  });

  test('no pop-ups for a returning visitor', async () => {
    const { context, page } = await newPage();
    await page.addInitScript(() => localStorage.setItem('last-visit-date', new Date(Date.now() - 20 * 86400000).toISOString()));
    await page.goto(APP, { waitUntil: 'load' });
    await sleep(1500);
    assert.equal(await page.locator('div.fixed.inset-0.z-50').count(), 0);
    await context.close();
  });

  test('resource cards use the full width on phones', async () => {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('onboarding-completed', 'true'));
    await page.goto(`${APP}/phase/phase2`, { waitUntil: 'load' });
    await page.click('button:has-text("Projects (")');
    const content = await page.locator('div.group').first().locator('> div.min-w-0').boundingBox();
    assert.ok(content.width > 200, `content column only ${Math.round(content.width)}px wide`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, 'sideways scroll');
    await context.close();
  });
});

describe('signed in', () => {
  test('Google sign-in works and ticking an item saves progress', async () => {
    const { context, page, errors } = await newPage();
    const { uid } = await signIn(context, page);
    assert.ok(uid, 'signed in');
    await page.click('a[href="/phase/phase1"]');
    await page.click('button:has-text("Courses (")');
    await page.locator('div.group', { hasText: 'SQL for Data Science' }).first().locator('button').first().click();
    let saved = false;
    for (let i = 0; i < 30 && !saved; i++) {
      const d = await (await fetch(`${FS}/users/${uid}`, { headers: ADMIN })).json();
      saved = !!d.fields?.progress?.mapValue?.fields?.phase1;
      if (!saved) await sleep(500);
    }
    assert.ok(saved, 'progress reached the database');
    assert.deepEqual(errors, []);
    await context.close();
  });

  test('study room: two people see each other and their messages', async () => {
    const a = await newPage();
    const b = await newPage();
    await signIn(a.context, a.page);
    await signIn(b.context, b.page);
    for (const { page } of [a, b]) {
      await page.click('a[href="/focus"]');
      await page.click('button:has-text("Join General Study Room")');
    }
    await a.page.fill('input[placeholder="Type message..."]', 'hello from A');
    await a.page.press('input[placeholder="Type message..."]', 'Enter');
    await b.page.waitForSelector('text=hello from A', { timeout: 15000 });
    const peers = await b.page.$$eval('span', ss => ss.filter(s => s.textContent.startsWith('👤')).length);
    assert.ok(peers >= 2, 'both people listed');
    assert.ok(!(await b.page.textContent('body')).includes('@example.com'), 'no email addresses shown');
    await a.context.close();
    await b.context.close();
  });

  test('delete my account removes the account and all its data', async () => {
    const { context, page } = await newPage();
    const { email, uid } = await signIn(context, page);
    await page.click('a[href="/leaderboard"]');
    await page.click('button:has-text("Join the leaderboard")');
    assert.ok(await waitForOwned('leaderboards', uid), 'leaderboard entry saved');
    await page.click('a[href="/success"]');
    await page.click('button:has-text("Share Your Success")');
    await page.fill('input[placeholder="e.g. Alex Rivera"]', 'Tester');
    await page.fill('input[placeholder="e.g. Data Analyst @ a startup"]', 'Analyst');
    await page.fill('textarea', 'A story');
    await page.click('button:has-text("Publish Story")');
    assert.ok(await waitForOwned('success_stories', uid), 'story saved');

    await page.click('a[href="/settings"]');
    const button = page.locator('button:has-text("Delete my account")');
    assert.ok(await button.isDisabled(), 'needs DELETE typed first');
    await page.fill('input[placeholder="Type DELETE to confirm"]', 'DELETE');
    await googlePopup(context, page, 'button:has-text("Delete my account")', email);
    await page.waitForSelector('button:has-text("Sign in with Google")', { timeout: 20000 });

    for (const path of ['users', 'leaderboards', 'success_stories']) {
      assert.equal(await countOwned(path, uid), 0, `${path} still has data`);
    }
    const lookup = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`, {
      method: 'POST', headers: { ...ADMIN, 'Content-Type': 'application/json' }, body: JSON.stringify({ localId: [uid] }),
    })).json();
    assert.equal((lookup.users || []).length, 0, 'auth account deleted');
    await context.close();
  });
});
