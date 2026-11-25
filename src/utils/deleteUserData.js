import { collection, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Everything the app stores for one person, so "Delete my account" removes it all.
// If you add a new collection with user data, add it here too.

// Documents stored under the user's own ID.
const DOCS_BY_USER_ID = [
  ['users'],
  ['progress'],
  ['capstones'],
  ['leaderboards'],
  ['study_rooms', 'general_focus', 'presence'],
];

// Collections where each document records its author in an "authorId" field.
const AUTHORED_COLLECTIONS = [
  ['success_stories'],
  ['community_questions'],
  ['community_answers'],
  ['project-comments'],
  ['study_rooms', 'general_focus', 'messages'],
];

export async function deleteUserData(uid) {
  // Posts, answers, comments and chat messages written by this user.
  for (const path of AUTHORED_COLLECTIONS) {
    const snap = await getDocs(query(collection(db, ...path), where('authorId', '==', uid)));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  }
  // Profile, progress, leaderboard entry and study-room presence.
  await Promise.all(DOCS_BY_USER_ID.map(path => deleteDoc(doc(db, ...path, uid))));
}
