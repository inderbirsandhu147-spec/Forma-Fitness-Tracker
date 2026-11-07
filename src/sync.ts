import { useCallback, useEffect, useRef, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  setDoc,
} from 'firebase/firestore';
import type { Data } from './data';

// These values identify the Firebase project. They are not secrets; access is
// controlled by Firebase Authentication and the Firestore security rules.
const firebaseConfig = {
  apiKey: 'AIzaSyC67UUY2S2ZMFNQkkUEsz3H1ZOEPz2XL7g',
  authDomain: 'forma-fitness-31787.firebaseapp.com',
  projectId: 'forma-fitness-31787',
  storageBucket: 'forma-fitness-31787.firebasestorage.app',
  messagingSenderId: '518291094714',
  appId: '1:518291094714:web:7bba7a9983b775225fd683',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Persistent cache lets edits made offline (for example in a gym with no signal)
// queue up and upload when the connection returns.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export type SyncStatus = 'signed-out' | 'syncing' | 'synced' | 'error';

const DEVICE_KEY = 'forma.sync.device';
const lastKey = (uid: string) => `forma.sync.last.${uid}`;

const deviceId = (() => {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
})();

// Small fingerprint of the last version known to match the cloud, so we can tell
// whether this device has changes the cloud has not seen yet.
const hash = (s: string) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return String(h);
};
const readLast = (uid: string) => {
  try {
    return localStorage.getItem(lastKey(uid));
  } catch {
    return null;
  }
};
const writeLast = (uid: string, json: string) => {
  try {
    localStorage.setItem(lastKey(uid), hash(json));
  } catch {
    /* storage unavailable; sync still works, merge is just more cautious */
  }
};

// Union by id, same rules as "Import backup". Used the first time a device links
// to the cloud, and whenever this device holds changes the cloud has not seen.
function mergeData(current: Data, d: Data): Data {
  return {
    ...current,
    workouts: [
      ...current.workouts,
      ...d.workouts.filter((w) => !current.workouts.some((x) => x.id === w.id)),
    ],
    routines: [
      ...current.routines,
      ...d.routines.filter((w) => !current.routines.some((x) => x.id === w.id)),
    ],
    custom: [
      ...current.custom,
      ...d.custom.filter((w) => !current.custom.some((x) => x.id === w.id)),
    ],
    plan: [
      ...current.plan,
      ...d.plan.filter((p) => !current.plan.some((x) => x.week === p.week && x.day === p.day)),
    ],
    restDays: Array.from(new Set([...current.restDays, ...d.restDays])),
    active: current.active || d.active,
  };
}

export function useCloudSync(
  data: Data | null,
  apply: (d: Data) => void,
  validate: (d: unknown) => boolean,
) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [status, setStatus] = useState<SyncStatus>('signed-out');
  const [message, setMessage] = useState('');

  const dataRef = useRef<Data | null>(data);
  dataRef.current = data;
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const validateRef = useRef(validate);
  validateRef.current = validate;
  // JSON of the last version we know matches the cloud (pushed or received).
  const syncedJson = useRef<string | null>(null);
  const attached = useRef(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setAuthReady(true);
        if (!u) {
          setStatus('signed-out');
          attached.current = false;
          syncedJson.current = null;
        }
      }),
    [],
  );

  const dataLoaded = data !== null;
  const uid = user?.uid;

  const push = useCallback(
    async (json: string) => {
      if (!uid) return;
      setStatus('syncing');
      try {
        await setDoc(doc(db, 'users', uid, 'forma', 'data'), {
          json,
          updatedAt: Date.now(),
          by: deviceId,
        });
        syncedJson.current = json;
        writeLast(uid, json);
        setStatus('synced');
        setMessage('');
      } catch {
        setStatus('error');
        setMessage('Could not reach the cloud. Changes are kept on this device and will retry.');
      }
    },
    [uid],
  );

  // Listen for changes made on other devices.
  useEffect(() => {
    if (!uid || !dataLoaded) return;
    attached.current = false;
    setStatus('syncing');
    const ref = doc(db, 'users', uid, 'forma', 'data');
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.metadata.fromCache) return; // wait for the server's answer
        const local = dataRef.current;
        if (!local) return;
        const localJson = JSON.stringify(local);
        const first = !attached.current;
        attached.current = true;

        if (!snap.exists()) {
          void push(localJson); // first device to ever sync: upload what we have
          return;
        }
        const remote = snap.data() as { json?: string; by?: string };
        if (remote.by === deviceId && !first) return; // echo of our own write
        let parsed: unknown;
        try {
          parsed = JSON.parse(remote.json ?? '');
        } catch {
          parsed = null;
        }
        if (!validateRef.current(parsed)) {
          setStatus('error');
          setMessage('Cloud data was not in the expected format, so it was not applied.');
          return;
        }
        const remoteData = parsed as Data;
        const remoteJson = JSON.stringify(remoteData);
        if (remoteJson === localJson) {
          syncedJson.current = localJson;
          writeLast(uid, localJson);
          setStatus('synced');
          return;
        }
        if (first) {
          // This device has unsynced changes, or has never linked before: merge so
          // nothing is lost. Otherwise the cloud copy is simply newer, so take it.
          const last = readLast(uid);
          const localHasNew = last === null || last !== hash(localJson);
          if (localHasNew) {
            const merged = mergeData(local, remoteData);
            applyRef.current(merged);
            void push(JSON.stringify(merged));
            return;
          }
        }
        syncedJson.current = remoteJson;
        writeLast(uid, remoteJson);
        applyRef.current(remoteData);
        setStatus('synced');
      },
      () => {
        setStatus('error');
        setMessage('Cloud sync was blocked. Check your Firestore rules and signed-in account.');
      },
    );
  }, [uid, dataLoaded, push]);

  // Upload local changes shortly after they happen.
  useEffect(() => {
    if (!uid || !data || !attached.current) return;
    const json = JSON.stringify(data);
    if (json === syncedJson.current) return;
    const t = setTimeout(() => void push(json), 1200);
    return () => clearTimeout(t);
  }, [data, uid, push]);

  const signIn = useCallback(async () => {
    setMessage('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setStatus('error');
        setMessage(
          code === 'auth/unauthorized-domain'
            ? 'This site is not an authorized domain in Firebase yet.'
            : 'Sign-in failed. Allow pop-ups for this site and try again.',
        );
      }
    }
  }, []);

  const signOut = useCallback(() => fbSignOut(auth), []);

  return { user, authReady, status, message, signIn, signOut };
}
