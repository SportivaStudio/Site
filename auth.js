// ===========================================================
// Sportiva Studio — Authentication (Firebase)
// ===========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// ---- MY FIREBASE CONFIG ----
const firebaseConfig = {
  apiKey: "AIzaSyASx6gAoFK6zCIKTOb-MHO1ZpxHoNtmeSA",
  authDomain: "sportiva-studio.firebaseapp.com",
  projectId: "sportiva-studio",
  storageBucket: "sportiva-studio.firebasestorage.app",
  messagingSenderId: "1079090358275",
  appId: "1:1079090358275:web:f47d3ffc56d447d6d98636",
  measurementId: "G-SS4V28K2L9"
};

// 3. INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ---- Elements ----
const modal = document.getElementById('authModal');
const openLogin = document.getElementById('openLogin');
const openSignup = document.getElementById('openSignup');
const closeModal = document.getElementById('closeModal');
const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const modalTitle = document.getElementById('modalTitle');
const nameField = document.getElementById('nameField');
const emailField = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');
const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
const submitBtn = document.getElementById('submitBtn');
const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');

const userChip = document.getElementById('userChip');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

let mode = 'login'; // or 'signup'

// ---- Modal open/close ----
function openModal(startMode) {
  setMode(startMode);
  modal.classList.add('open');
}
function closeModalFn() {
  modal.classList.remove('open');
  authError.textContent = '';
  authForm.reset();
}

openLogin.addEventListener('click', () => openModal('login'));
openSignup.addEventListener('click', () => openModal('signup'));
closeModal.addEventListener('click', closeModalFn);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFn(); });

function setMode(newMode) {
  mode = newMode;
  authError.textContent = '';
  if (mode === 'login') {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    modalTitle.textContent = 'Welcome back';
    nameField.style.display = 'none';
    submitBtn.textContent = 'Log in';
  } else {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    modalTitle.textContent = 'Create your account';
    nameField.style.display = 'block';
    submitBtn.textContent = 'Sign up';
  }
}
tabLogin.addEventListener('click', () => setMode('login'));
tabSignup.addEventListener('click', () => setMode('signup'));

// ---- Email / Password ----
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';
  const email = emailField.value.trim();
  const password = passwordField.value;

  try {
    if (mode === 'signup') {
      const name = nameField.value.trim();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    closeModalFn();
  } catch (err) {
    authError.textContent = friendlyError(err.code);
  }
});

// ---- Google ----
googleBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    closeModalFn();
  } catch (err) {
    authError.textContent = friendlyError(err.code);
  }
});

// ---- Facebook ----
facebookBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
    closeModalFn();
  } catch (err) {
    authError.textContent = friendlyError(err.code);
  }
});

// ---- Logout ----
logoutBtn.addEventListener('click', () => signOut(auth));

// ---- Auth state → update header UI ----
onAuthStateChanged(auth, (user) => {
  if (user) {
    openLogin.style.display = 'none';
    openSignup.style.display = 'none';
    userChip.style.display = 'flex';
    userName.textContent = user.displayName || user.email || 'Account';
    userAvatar.src = user.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.displayName || user.email || 'U');
  } else {
    openLogin.style.display = 'inline-block';
    openSignup.style.display = 'inline-block';
    userChip.style.display = 'none';
  }
});

// ---- Friendlier error messages ----
function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'That email already has an account — try logging in instead.',
    'auth/invalid-email': 'That email address doesn\'t look right.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/popup-closed-by-user': 'Sign-in was closed before finishing.',
    'auth/invalid-credential': 'Incorrect email or password.',
  };
  return map[code] || 'Something went wrong — please try again.';
}