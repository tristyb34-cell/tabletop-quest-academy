# Firebase Setup (5 minutes, one time)

Cross-device sync uses Firebase Firestore (free tier, no credit card needed).

## Steps

### 1. Create a Firebase project
- Go to https://console.firebase.google.com
- Click "Create a project"
- Name it anything (e.g. "tq-academy")
- Disable Google Analytics (not needed)
- Click "Create project"

### 2. Create a Firestore database
- In the Firebase console, click "Build" > "Firestore Database" in the left sidebar
- Click "Create database"
- Choose "Start in test mode" (allows read/write for 30 days, we'll add rules after)
- Pick any region (closest to you is best)
- Click "Enable"

### 3. Register a web app
- In the Firebase console, click the gear icon > "Project settings"
- Scroll down to "Your apps" and click the web icon (`</>`)
- Give it a nickname (e.g. "tq-academy-web")
- Don't check "Firebase Hosting"
- Click "Register app"
- You'll see a config object. Copy it.

### 4. Paste the config into app.js
Open `app.js` and find this block near the top:

```js
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
```

Replace it with the values from step 3. It will look something like:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB1234567890abcdef",
  authDomain: "tq-academy-abc12.firebaseapp.com",
  projectId: "tq-academy-abc12",
  storageBucket: "tq-academy-abc12.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. Set Firestore security rules
In the Firebase console, go to Firestore > Rules tab. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{code} {
      allow read, write: if true;
    }
  }
}
```

Click "Publish".

(This is fine for personal use. The only data stored is which modules you've completed, keyed by your sync code.)

### 6. Commit and push
```bash
cd ~/tabletop-quest-academy
git add -A && git commit -m "Add Firebase config" && git push
```

GitHub Pages will redeploy in about a minute.

### 7. Set your sync code
- Open the site on your PC
- Click "Set Sync Code" in the bottom bar
- Enter any code (e.g. "tristan")
- Open the site on your phone
- Enter the same code
- Done. Progress syncs in real-time between both devices.

## How sync works

- Each device reads/writes to a single Firestore document at `/progress/{your-sync-code}`
- When you mark something complete on one device, it appears on the other within seconds
- Merging is additive: if either device marks something done, it stays done
- The sync code is NOT a password. Anyone who guesses it could see your progress. Pick something unique if you care, but there's nothing sensitive here.

## Cost

Firebase free tier includes:
- 1 GiB storage
- 50,000 reads/day
- 20,000 writes/day

You'll use approximately 0.001% of this. It will never cost money.
