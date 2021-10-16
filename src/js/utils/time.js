import { Timestamp } from 'firebase/firestore';

export const createTimestamp = () => {
  return Timestamp.now().toMillis().toString();
}