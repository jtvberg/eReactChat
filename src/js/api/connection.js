import { getDatabase, ref, onValue } from 'firebase/database';

export const onConnectionChanged = (onConnection) => {
  const dbRef = getDatabase();
  const conRef = ref(dbRef, '.info/connected');
  onValue(conRef, (snapshot) => onConnection(snapshot.val()));
};
