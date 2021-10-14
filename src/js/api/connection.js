import { getDatabase, onValue, ref } from 'firebase/database';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import db from '../db/firestore';

const getOnlineStatus = (isOnline) => ({
  state: isOnline ? 'online' : 'offline',
  lastChanged: Timestamp.now()
});

export const setUserOnlineStatus = (uid, isOnline) => {
  const userRef = doc(db, `/profiles/${uid}`);
  const updateData = getOnlineStatus(isOnline);
  return updateDoc(userRef, updateData);
};

export const onConnectionChanged = (onConnection) => {
  const dbRef = getDatabase();
  const conRef = ref(dbRef, '.info/connected');
  return onValue(conRef, (snapshot) => {
    const isConnected = snapshot?.val() ? snapshot.val() : false;
    onConnection(isConnected);
  });
};
