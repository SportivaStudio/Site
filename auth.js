import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyASx6gAoFK6zCIKTOb-MHO1ZpxHoNtmeSA",
  authDomain: "sportiva-studio.firebaseapp.com",
  projectId: "sportiva-studio",
  storageBucket: "sportiva-studio.firebasestorage.app",
  messagingSenderId: "1079090358275",
  appId: "1:1079090358275:web:f47d3ffc56d447d6d98636",
  measurementId: "G-SS4V28K2L9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let mode = 'login';

function openModal(startMode) {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  setMode(startMode);
  modal.classList.add('active');
}

function closeModalFn() {
  const modal = document.getElementById('authModal');
  const authError = document.getElementById('authError');
  const authForm = document.getElementById('authForm');
  if (modal) modal.classList.remove('active');
  if (authError) authError.textContent = '';
  if (authForm) authForm.reset();
}

function setMode(newMode) {
  mode = newMode;
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const modalTitle = document.getElementById('modalTitle');
  const nameField = document.getElementById('nameField');
  const submitBtn = document.getElementById('submitBtn');
  const authError = document.getElementById('authError');

  if (authError) authError.textContent = '';
  if (mode === 'login') {
    tabLogin?.classList.add('active');
    tabSignup?.classList.remove('active');
    if (modalTitle) modalTitle.textContent = 'Welcome back';
    if (nameField) nameField.style.display = 'none';
    if (submitBtn) submitBtn.textContent = 'Log in';
  } else {
    tabSignup?.classList.add('active');
    tabLogin?.classList.remove('active');
    if (modalTitle) modalTitle.textContent = 'Create your account';
    if (nameField) nameField.style.display = 'block';
    if (submitBtn) submitBtn.textContent = 'Sign up';
  }
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'That email already has an account — try logging in instead.',
    'auth/invalid-email': 'That email address doesn\'t look right.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/popup-closed-by-user': 'Sign-in was closed before finishing.',
    'auth/unauthorized-domain': 'This domain is not authorized in Firebase Console.',
    'auth/invalid-credential': 'Incorrect email or password.'
  };
  return map[code] || `Error: ${code}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const openLogin = document.getElementById('openLogin');
  const openSignup = document.getElementById('openSignup');
  const closeModal = document.getElementById('closeModal');
  const modal = document.getElementById('authModal');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const authForm = document.getElementById('authForm');
  const googleBtn = document.getElementById('googleBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  openLogin?.addEventListener('click', () => openModal('login'));
  openSignup?.addEventListener('click', () => openModal('signup'));
  closeModal?.addEventListener('click', closeModalFn);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModalFn(); });
  tabLogin?.addEventListener('click', () => setMode('login'));
  tabSignup?.addEventListener('click', () => setMode('signup'));

  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const authError = document.getElementById('authError');
    const email = document.getElementById('emailField')?.value.trim();
    const password = document.getElementById('passwordField')?.value;

    if (authError) authError.textContent = '';

    try {
      if (mode === 'signup') {
        const name = document.getElementById('nameField')?.value.trim();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      closeModalFn();
    } catch (err) {
      console.error(err);
      if (authError) authError.textContent = friendlyError(err.code);
    }
  });

  googleBtn?.addEventListener('click', async () => {
    const authError = document.getElementById('authError');
    try {
      await signInWithPopup(auth, googleProvider);
      closeModalFn();
    } catch (err) {
      console.error(err);
      if (authError) authError.textContent = friendlyError(err.code);
    }
  });

  logoutBtn?.addEventListener('click', () => signOut(auth));
});

onAuthStateChanged(auth, (user) => {
  const openLogin = document.getElementById('openLogin');
  const openSignup = document.getElementById('openSignup');
  const userChip = document.getElementById('userChip');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');

  if (user) {
    if (openLogin) openLogin.style.display = 'none';
    if (openSignup) openSignup.style.display = 'none';
    if (userChip) userChip.style.display = 'flex';
    if (userName) userName.textContent = user.displayName || user.email || 'Account';
    if (userAvatar) userAvatar.src = user.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.displayName || user.email || 'U');
  } else {
    if (openLogin) openLogin.style.display = 'inline-block';
    if (openSignup) openSignup.style.display = 'inline-block';
    if (userChip) userChip.style.display = 'none';
  }
});