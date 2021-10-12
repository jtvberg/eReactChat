import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ChatUsers from "../components/ChatUsers";
import ChatMessages from "../components/ChatMessages";
import ViewTitle from "../components/shared/ViewTitle";
import { withBaseLayout } from "../layouts/Base";
import { subscribeToChat, subscribeToProfile } from "../actions/chats";

function Chat() {
  const { id } = useParams();
  const userWatcher = useRef({});
  const dispatch = useDispatch();
  const activeChat = useSelector(({ chats }) => chats.activeChats[id]);
  const joinedUsers = activeChat?.joinedUsers;

  useEffect(() => {
    const unsubFromChat = dispatch(subscribeToChat(id));
    return () => {
      // unsubFromChat();
      unsubFromJoinedUsers();
    };
  }, []);

  useEffect(() => {
    joinedUsers && subscribeToJoinedUsers(joinedUsers);
  }, [joinedUsers]);

  const subscribeToJoinedUsers = (jUsers) => {
    jUsers.forEach((user) => {
      if (!userWatcher.current[user.uid])
        userWatcher.current[user.uid] = dispatch(subscribeToProfile(user.uid));
    });
  };

  const unsubFromJoinedUsers = () => {
    Object.keys(userWatcher.current).forEach((id) => userWatcher.current[id]());
  };

  return (
    <div className="row no-gutters fh">
      <div className="col-3 fh">
        <ChatUsers users={activeChat?.joinedUsers} />
      </div>
      <div className="col-9 fh">
        <ViewTitle text={`Channel: ${activeChat?.name}`} />
        <ChatMessages />
      </div>
    </div>
  );
}

export default withBaseLayout(Chat, { canGoBack: true });
