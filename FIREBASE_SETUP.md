# Firebase Setup Guide

Complete step-by-step guide to configure Firebase for this project.

---

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Name it (e.g. `saar-portfolio`)
4. Disable Google Analytics (optional) → **Create project**

---

## 2. Register a Web App

1. In your project, click the **</>** (Web) icon
2. Register app name (e.g. `saar-web`)
3. Copy the `firebaseConfig` object — you'll need these values for your `.env` file

---

## 3. Enable Authentication

1. Sidebar → **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password**
4. Click **Save**

### Create the First Admin Account

The first admin must be created manually:

1. Go to **Authentication** → **Users** → **Add user**
2. Enter your admin email and a strong password
3. Copy the **User UID** that appears after creation

---

## 4. Create Firestore Database

1. Sidebar → **Firestore Database** → **Create database**
2. Choose **Start in production mode** (we'll set rules next)
3. Select a region close to your users (e.g. `asia-south1` for India)
4. Click **Enable**

### Add the First Admin Document

1. In Firestore, click **Start collection**
2. Collection ID: `admins`
3. Document ID: paste the **User UID** you copied above
4. Add these fields:
   - `email` (string): your admin email
   - `displayName` (string): your name
   - `createdAt` (timestamp): click the timestamp option → current time
   - `createdBy` (string): `system`
5. Click **Save**

---

## 5. Set Firestore Security Rules

1. Firestore → **Rules** tab
2. Replace everything with the rules below
3. Click **Publish**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Books — public read, admin write
    match /books/{bookId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Projects — public read, admin write
    match /projects/{projectId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Ratings — public create (one per fingerprint), admin manage
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['bookId','uid','rating','createdAt'])
        && request.resource.data.rating is int
        && request.resource.data.rating >= 1
        && request.resource.data.rating <= 5;
      allow update, delete: if isAdmin();
    }

    // Likes — public create/delete, admin manage
    match /likes/{likeId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['projectId','uid','createdAt']);
      allow delete: if true;
      allow update: if isAdmin();
    }

    // View logs — public write (for tracking), admin read
    match /view_logs/{logId} {
      allow read: if isAdmin();
      allow create: if request.resource.data.keys().hasAll(
            ['itemId','itemType','uid','country','city','countryCode','createdAt','expiresAt'])
        && request.resource.data.itemType in ['book', 'project'];
      allow update, delete: if isAdmin();
    }

    // Contact messages — public create, admin read/manage
    match /contacts/{contactId} {
      allow read: if isAdmin();
      allow create: if request.resource.data.keys().hasAll(
            ['name','email','subject','message','uid','read','createdAt'])
        && request.resource.data.name.size() <= 100
        && request.resource.data.message.size() <= 2000;
      allow update, delete: if isAdmin();
    }

    // Admins — admin only
    match /admins/{uid} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

---

## 6. Set Up Firestore Indexes

Go to **Firestore → Indexes** and create these **Composite Indexes**:

| Collection | Fields | Query scope |
|------------|--------|-------------|
| `books` | `published` ASC, `order` ASC | Collection |
| `projects` | `published` ASC, `order` ASC | Collection |
| `view_logs` | `createdAt` DESC | Collection |
| `view_logs` | `itemId` ASC, `itemType` ASC, `createdAt` ASC | Collection |
| `contacts` | `createdAt` DESC | Collection |
| `contacts` | `read` ASC, `createdAt` DESC | Collection |

> Alternatively, run the app in development and click the auto-generated index links that appear in the browser console when queries fail.

---

## 7. Enable Firestore TTL (Auto-delete Analytics After 30 Days)

This automatically deletes `view_logs` documents after 30 days without any Cloud Functions.

1. Firestore → **TTL Policies** tab (or search "TTL" in the console)
2. Click **Create TTL policy**
3. Collection group: `view_logs`
4. Timestamp field: `expiresAt`
5. Click **Create**

After creation, Firebase will automatically delete any document in `view_logs` where `expiresAt` is in the past. Cleanup happens within 24-72 hours of expiry (not instant).

---

## 8. Get Environment Variables

Copy your Firebase config values into a `.env` file (copy `.env.example` first):

```bash
cp .env.example .env
```

Fill in the values from your Firebase project settings:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

---

## 9. Firestore Collections Reference

| Collection | Purpose | TTL |
|------------|---------|-----|
| `books` | Book data (title, author, cover URL, PDF URL, ratings) | Never |
| `projects` | Code project data (title, tags, thumbnail, likes) | Never |
| `ratings` | Individual user ratings per book | Never |
| `likes` | Individual user likes per project | Never |
| `view_logs` | Raw view events with location | **30 days** |
| `contacts` | Contact form messages | Never (admin deletes) |
| `admins` | Authorised admin accounts (max 3) | Never |

---

## Troubleshooting

**"Missing or insufficient permissions"** — Check that your Firestore rules are published and the `admins` document exists with the correct UID.

**Admin login succeeds but shows "Access Denied"** — The user exists in Firebase Auth but not in the `admins` Firestore collection. Create the document manually as described in Step 4.

**Real-time updates not working** — Ensure Firestore is in **Native mode** (not Datastore mode). Also check that the `published == true` and `order` index is created.
