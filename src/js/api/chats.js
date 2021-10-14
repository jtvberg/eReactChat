import db from '../db/firestore';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore';

export const fetchChats = async () => {
  const chatSnap = await getDocs(collection(db, 'chats'));
  const chatList = chatSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return chatList;
};

export const createChat = async (chat) => {
  const docRef = await addDoc(collection(db, 'chats'), {
    ...chat,
  });
  return docRef.id;
};

export const joinChat = async (userId, chatId) => {
  const userRef = doc(db, 'profiles', userId);
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(userRef, { joinedChats: arrayUnion(chatRef) });
  await updateDoc(chatRef, { joinedUsers: arrayUnion(userRef) });
};

export const subscribeToChat = (chatId, onSubscribe) =>
  onSnapshot(doc(db, 'chats', chatId), (doc) => {
    const chat = { onSnapshot, ...doc.data() };
    onSubscribe(chat);
  });

export const subscribeToProfile = (uid, onSubscribe) => onSnapshot(doc(db, 'profiles', uid), (doc) => onSubscribe(doc.data()));
