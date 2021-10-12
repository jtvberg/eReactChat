import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import db from '../db/firestore'

export async function getUserProfile (uid) {
  try {
    const docSnap = await getDoc(doc(db, 'profiles', uid))
    return { uid, ...docSnap.data() }
  } catch(err) {
    return Promise.reject(err.message)
  }
}

export async function register({email, password, username, avatar}) {
  try {
    const auth = getAuth()
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    const regProfile = { username, email, avatar, joinedChats: [] }
    await setDoc(doc(db, 'profiles', user.uid), regProfile)
    return { uid: user.uid, ...regProfile }
  } catch(err) {
    return Promise.reject(err.message)
  }
}

export async function login({email, password}) {
  try {
    const auth = getAuth()
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const getProfile = await getUserProfile(user.uid)
    return { uid: user.uid, ...getProfile }
  } catch(err) {
    return Promise.reject(err.message)
  }
}

export const logout = () => signOut(getAuth())

export const onAuthStateChanges = onAuth => onAuthStateChanged(getAuth(), onAuth)

// const createUserProfile = userProfile =>
//   db
//     .collection('profiles')
//     .doc(userProfile.uid)
//     .set(userProfile)

// export async function register({email, password, username, avatar}) {
//   try {
//     const auth = getAuth()
//     const { user } = await createUserWithEmailAndPassword(auth, email, password)
//     await createUserProfile({ uid: user.uid, username, email, avatar, joinedChats: [] })
//   } catch(err) {
//     return Promise.reject(err.message)
//   }
// }