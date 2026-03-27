/**
 * Returns a persistent anonymous user ID stored in localStorage.
 * Uses crypto.randomUUID() with a fallback for non-secure contexts.
 */
export function getUserId() {
  let uid = localStorage.getItem('_saar_uid');
  if (!uid) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uid = crypto.randomUUID();
    } else {
      uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
    localStorage.setItem('_saar_uid', uid);
  }
  return uid;
}

// ── View rate limiting ────────────────────────────────────────────────────────
const MAX_VIEWS_PER_DAY = 5;

function getTodayStr() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getViewCountKey(itemId) {
  return `_saar_view_${itemId}_${getTodayStr()}`;
}

export function getLocalViewCount(itemId) {
  return parseInt(localStorage.getItem(getViewCountKey(itemId)) || '0', 10);
}

export function canRecordView(itemId) {
  return getLocalViewCount(itemId) < MAX_VIEWS_PER_DAY;
}

export function incrementLocalViewCount(itemId) {
  const key = getViewCountKey(itemId);
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, current + 1);
}

// ── Contact rate limiting ─────────────────────────────────────────────────────
const CONTACT_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export function canSubmitContact() {
  const last = parseInt(localStorage.getItem('_saar_contact_ts') || '0', 10);
  return Date.now() - last > CONTACT_COOLDOWN_MS;
}

export function markContactSubmitted() {
  localStorage.setItem('_saar_contact_ts', String(Date.now()));
}

// ── Rating helpers (localStorage cache) ──────────────────────────────────────
export function getUserRating(itemId) {
  return parseInt(localStorage.getItem(`_saar_rating_${itemId}`) || '0', 10);
}

export function setUserRatingLocal(itemId, rating) {
  localStorage.setItem(`_saar_rating_${itemId}`, String(rating));
}

// ── Like helpers (localStorage cache) ────────────────────────────────────────
export function getUserLike(itemId) {
  return localStorage.getItem(`_saar_like_${itemId}`) === '1';
}

export function setUserLikeLocal(itemId, liked) {
  localStorage.setItem(`_saar_like_${itemId}`, liked ? '1' : '0');
}
