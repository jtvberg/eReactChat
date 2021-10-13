import * as api from '../api/chats';
import db from '../db/firestore';
import { doc, getDoc } from 'firebase/firestore';

export const fetchChats = () => async (dispatch, getState) => {
  const { user } = getState().auth;
  dispatch({
    type: 'CHATS_FETCH_INIT',
  });
  const chats = await api.fetchChats();
  chats.forEach(
    (chat) => (chat.joinedUsers = chat.joinedUsers.map((user) => user.id))
  );

  const sortedChats = chats.reduce(
    (allChats, chat) => {
      allChats[
        chat.joinedUsers.includes(user.uid) ? 'joined' : 'available'
      ].push(chat);
      return allChats;
    },
    {
      joined: [],
      available: [],
    }
  );

  dispatch({
    type: 'CHATS_FETCH_SUCCESS',
    ...sortedChats,
  });
};

export const joinChat = (chat, uid) => async (dispatch) => {
  await api.joinChat(uid, chat.id).then((_) => {
    dispatch({
      type: 'CHATS_JOIN_SUCCESS',
      chat,
    });
  });
};

export const createChat = (formData, userId) => async (dispatch) => {
  const newChat = {
    ...formData,
  };
  newChat.admin = doc(db, 'profiles', userId);
  const chatId = await api.createChat(newChat);
  dispatch({
    type: 'CHATS_CREATE_SUCCESS',
  });
  await api.joinChat(userId, chatId);
  dispatch({
    type: 'CHATS_JOIN_SUCCESS',
    chat: {
      ...newChat,
      id: chatId,
    },
  });
};

export const subscribeToChat = (chatId) => (dispatch) => {
  api.subscribeToChat(chatId, async (chat) => {
    const joinedUsers = await Promise.all(
      chat.joinedUsers.map(async (userRef) => {
        const userSnapshot = await getDoc(userRef);
        return {
          ...userSnapshot.data(),
          uid: userSnapshot.id,
        };
      })
    );
    chat.id = chatId;
    chat.joinedUsers = joinedUsers;
    dispatch({
      type: 'CHATS_SET_ACTIVE_CHAT',
      chat,
    });
  });
};

export const subscribeToProfile = (uid) => (dispatch) => {
  api.subscribeToProfile(uid, (user) => {
    dispatch({
      type: 'CHATS_UPDATE_USER_STATE',
      user,
    });
  });
};
