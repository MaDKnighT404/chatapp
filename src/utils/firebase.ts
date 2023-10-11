import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBH9EYbmt13JdLe6Stujf08CXd6-uZy3H8',
	authDomain: 'epic-chat-5bc24.firebaseapp.com',
	projectId: 'epic-chat-5bc24',
	storageBucket: 'epic-chat-5bc24.appspot.com',
	messagingSenderId: '492824193005',
	appId: '1:492824193005:web:cd1aa3958a476a8999e9e4',
};

// Initialize Firebase one one time!
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { db, auth, storage, provider };
