import React, { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ChatUsers from '../components/ChatUsers';
import ChatMessages from '../components/ChatMessages';
import ViewTitle from '../components/shared/ViewTitle';
import LoadingView from '../components/shared/LoadingView';
import Messenger from '../components/Messenger';
import { withBaseLayout } from '../layouts/Base';
import {
  subscribeToChat,
  subscribeToProfile,
  sendChatMessage
} from '../actions/chats';

function Chat() {
  const { id } = useParams();
  const peopleWatchers = useRef({});
  const dispatch = useDispatch();
  const activeChat = useSelector(({ chats }) => chats.activeChats[id]);
  const joinedUsers = activeChat?.joinedUsers;

  useEffect(() => {
    const unsubFromChat = dispatch(subscribeToChat(id));
    return () => {
      unsubFromChat();
      unsubFromJoinedUsers();
    };
  }, []);

  useEffect(() => {
    joinedUsers && subscribeToJoinedUsers(joinedUsers);
  }, [joinedUsers]);

  const subscribeToJoinedUsers = useCallback(
    (jUsers) => {
      jUsers.forEach((user) => {
        if (!peopleWatchers.current[user.uid]) {
          peopleWatchers.current[user.uid] = dispatch(
            subscribeToProfile(user.uid, id)
          );
        }
      });
    },
    [dispatch, id]
  );

  const unsubFromJoinedUsers = useCallback(() => {
    Object.keys(peopleWatchers.current).forEach((id) =>
      peopleWatchers.current[id]()
    );
  }, [peopleWatchers.current]);

  if (!activeChat?.id) {
    return <LoadingView message="Loading Chat" />
  }

  const sendMessage = message => {
    dispatch(sendChatMessage(message, id))
  }

  // const sendMessage = useCallback(message => {
  //   dispatch(sendChatMessage(message, id))
  // }, [id])

  return (
    <div className="row no-gutters fh">
      <div className="col-3 fh">
        <ChatUsers users={activeChat?.joinedUsers} />
      </div>
      <div className="col-9 fh">
        <ViewTitle text={`Channel ${activeChat?.name}`} />
        <ChatMessages />
        <Messenger onSubmit={sendMessage} />
      </div>
    </div>
  );
}

export default withBaseLayout(Chat, { canGoBack: true });
