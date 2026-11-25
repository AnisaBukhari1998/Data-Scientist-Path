// While an account is being deleted, nothing may write progress back to Firestore;
// otherwise the app would recreate the profile it is trying to delete.
let deleting = false;

export function setAccountDeletionInProgress(value) {
  deleting = value;
}

export function isAccountDeletionInProgress() {
  return deleting;
}
