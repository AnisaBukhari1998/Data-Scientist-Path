// Firestore security rules tests.
// Each test tries something a user is (or is not) allowed to do, against the local
// Firestore emulator with the real firestore.rules. Run with: npm run test:rules
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import {
  doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, collection, query, orderBy, limit,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';

let env, alice, bob, anon;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-rules-test',
    firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8080 },
  });
  alice = env.authenticatedContext('alice').firestore();
  bob = env.authenticatedContext('bob').firestore();
  anon = env.unauthenticatedContext().firestore();
});
beforeEach(async () => { await env.clearFirestore(); });
after(async () => { await env.cleanup(); });

const allowed = (p) => assertSucceeds(p);
const denied = (p) => assertFails(p);

describe('users (private profile and progress)', () => {
  test('owner can write and read their own profile', async () => {
    await allowed(setDoc(doc(alice, 'users/alice'), { progress: { phase1: { courses: [0] } } }));
    await allowed(getDoc(doc(alice, 'users/alice')));
  });
  test('nobody else can read or write it', async () => {
    await denied(getDoc(doc(bob, 'users/alice')));
    await denied(setDoc(doc(bob, 'users/alice'), { progress: {} }));
    await denied(getDoc(doc(anon, 'users/alice')));
  });
});

describe('success_stories', () => {
  const story = { authorId: 'alice', name: 'Alice', role: 'Data Analyst', path: 'Data Analyst Track', quote: 'Got the job!', img: '🚀', timestamp: 1 };
  test('signed-in user posts own story; anyone can read', async () => {
    await allowed(addDoc(collection(alice, 'success_stories'), story));
    await allowed(getDocs(collection(anon, 'success_stories')));
  });
  test('rejects posting as someone else, signed out, too long or extra fields', async () => {
    await denied(addDoc(collection(bob, 'success_stories'), story));
    await denied(addDoc(collection(anon, 'success_stories'), story));
    await denied(addDoc(collection(alice, 'success_stories'), { ...story, quote: 'x'.repeat(1001) }));
    await denied(addDoc(collection(alice, 'success_stories'), { ...story, verified: true }));
  });
  test('author can delete; others cannot; nobody can edit', async () => {
    await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'success_stories/s1'), story));
    await denied(setDoc(doc(alice, 'success_stories/s1'), { ...story, quote: 'edited' }));
    await denied(deleteDoc(doc(bob, 'success_stories/s1')));
    await allowed(deleteDoc(doc(alice, 'success_stories/s1')));
  });
});

describe('leaderboards', () => {
  const entry = { name: 'Alice', level: 3, xp: 350, completed: 20, updatedAt: serverTimestamp() }; // level 3 = 300..599 XP
  test('user creates own entry; signed-in users can read', async () => {
    await allowed(setDoc(doc(alice, 'leaderboards/alice'), entry));
    await allowed(getDocs(collection(bob, 'leaderboards')));
    await denied(getDocs(collection(anon, 'leaderboards')));
  });
  test('rejects other users, impossible levels, huge scores, fake times and extra fields', async () => {
    await denied(setDoc(doc(bob, 'leaderboards/alice'), entry));
    await denied(setDoc(doc(bob, 'leaderboards/bob'), { ...entry, name: 'Bob', level: 10 }));
    await denied(setDoc(doc(bob, 'leaderboards/bob'), { name: 'Bob', level: 20, xp: 999999, completed: 1, updatedAt: serverTimestamp() }));
    await denied(setDoc(doc(bob, 'leaderboards/bob'), { ...entry, name: 'Bob', updatedAt: Timestamp.fromMillis(0) }));
    await denied(setDoc(doc(bob, 'leaderboards/bob'), { ...entry, name: 'Bob', admin: true }));
  });
  test('XP can only grow slowly (10 per minute)', async () => {
    await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'leaderboards/alice'),
      { ...entry, updatedAt: Timestamp.fromMillis(Date.now() - 2 * 3600 * 1000) }));
    await denied(setDoc(doc(alice, 'leaderboards/alice'), { name: 'Alice', level: 10, xp: 5350, completed: 20, updatedAt: serverTimestamp() }));
    await allowed(setDoc(doc(alice, 'leaderboards/alice'), { name: 'Alice', level: 4, xp: 850, completed: 40, updatedAt: serverTimestamp() }));
    await allowed(deleteDoc(doc(alice, 'leaderboards/alice')));
  });
});

describe('community questions and answers', () => {
  const q = { title: 'How do joins work?', content: 'Help', tag: 'SQL', author: 'alice', authorId: 'alice', date: 'Just now', timestamp: 1, answersCount: 0 };
  const a = { questionId: 'abc', author: 'alice', authorId: 'alice', content: 'Use JOIN', date: 'Just now', timestamp: 2 };
  test('signed-in users post; anyone reads', async () => {
    await allowed(addDoc(collection(alice, 'community_questions'), q));
    await allowed(getDocs(collection(anon, 'community_questions')));
    await allowed(addDoc(collection(alice, 'community_answers'), a));
  });
  test('rejects signed out, impersonation, huge posts and fake answer counts', async () => {
    await denied(addDoc(collection(anon, 'community_questions'), q));
    await denied(addDoc(collection(bob, 'community_questions'), q));
    await denied(addDoc(collection(alice, 'community_questions'), { ...q, content: 'x'.repeat(3001) }));
    await denied(addDoc(collection(alice, 'community_questions'), { ...q, answersCount: 99 }));
    await denied(addDoc(collection(bob, 'community_answers'), a));
    await denied(addDoc(collection(alice, 'community_answers'), { ...a, content: 'x'.repeat(2001) }));
  });
});

describe('project-comments', () => {
  const c = { projectId: 'phase1-0', authorId: 'alice', authorName: 'alice', content: 'Nice', timestamp: serverTimestamp() };
  test('signed-in user comments as themselves', async () => {
    await allowed(addDoc(collection(alice, 'project-comments'), c));
  });
  test('rejects impersonation, huge comments and fake times', async () => {
    await denied(addDoc(collection(bob, 'project-comments'), c));
    await denied(addDoc(collection(alice, 'project-comments'), { ...c, content: 'x'.repeat(2001) }));
    await denied(addDoc(collection(alice, 'project-comments'), { ...c, timestamp: Timestamp.fromMillis(0) }));
  });
});

describe('study room', () => {
  const me = { name: 'alice', lastSeen: serverTimestamp() };
  const msg = { authorId: 'alice', name: 'alice', text: 'hello', createdAt: serverTimestamp() };
  test('presence: own check-in only, real times, no extra fields, only general_focus', async () => {
    await allowed(setDoc(doc(alice, 'study_rooms/general_focus/presence/alice'), me));
    await allowed(getDocs(collection(bob, 'study_rooms/general_focus/presence')));
    await denied(getDocs(collection(anon, 'study_rooms/general_focus/presence')));
    await denied(setDoc(doc(bob, 'study_rooms/general_focus/presence/alice'), me));
    await denied(deleteDoc(doc(bob, 'study_rooms/general_focus/presence/alice')));
    await denied(setDoc(doc(alice, 'study_rooms/general_focus/presence/alice'), { name: 'alice', lastSeen: Timestamp.fromMillis(9e12) }));
    await denied(setDoc(doc(alice, 'study_rooms/general_focus/presence/alice'), { ...me, email: 'a@b.c' }));
    await denied(setDoc(doc(alice, 'study_rooms/secret/presence/alice'), me));
    await allowed(deleteDoc(doc(alice, 'study_rooms/general_focus/presence/alice')));
  });
  test('messages: post as yourself, no edits, only author deletes', async () => {
    await allowed(addDoc(collection(alice, 'study_rooms/general_focus/messages'), msg));
    await allowed(getDocs(query(collection(bob, 'study_rooms/general_focus/messages'), orderBy('createdAt', 'desc'), limit(50))));
    await denied(getDocs(collection(anon, 'study_rooms/general_focus/messages')));
    await denied(addDoc(collection(bob, 'study_rooms/general_focus/messages'), msg));
    await denied(addDoc(collection(alice, 'study_rooms/general_focus/messages'), { ...msg, text: 'x'.repeat(501) }));
    await denied(addDoc(collection(alice, 'study_rooms/general_focus/messages'), { ...msg, createdAt: Timestamp.fromMillis(0) }));
    const ref = doc(alice, 'study_rooms/general_focus/messages/m1');
    await allowed(setDoc(ref, msg));
    await denied(setDoc(ref, { ...msg, text: 'edited' }));
    await denied(deleteDoc(doc(bob, 'study_rooms/general_focus/messages/m1')));
    await allowed(deleteDoc(ref));
  });
});

describe('closed collections', () => {
  test('unused or retired collections are denied', async () => {
    await denied(addDoc(collection(alice, 'community_posts'), { authorId: 'alice', text: 'hi' }));
    await denied(setDoc(doc(alice, 'study_rooms/general_focus'), { messages: [] }));
    await denied(setDoc(doc(alice, 'certificates/CERT-ABC123'), { userId: 'alice' }));
  });
});
