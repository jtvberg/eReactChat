import React, { useEffect } from 'react';
import JoinedChats from '../components/JoinedChats';
import AvailableChats from '../components/AvailableChats';
import ViewTitle from '../components/shared/ViewTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../actions/chats';
import { withBaseLayout } from '../layouts/Base';
import { Link } from 'react-router-dom';
import Notification from '../utils/notifications';

function Home() {
  const dispatch = useDispatch();
  const joinedChats = useSelector(({ chats }) => chats.joined);
  const availableChats = useSelector(({ chats }) => chats.available);

  useEffect(() => {
    Notification.setup();
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <div className="row no-gutters fh">
      <div className="col-3 fh">
        <JoinedChats chats={joinedChats} />
      </div>
      <div className="col-9 fh">
        <ViewTitle text="Choose Channel">
          <Link className="btn btn-outline-primary" to="/chatCreate">
            New
          </Link>
        </ViewTitle>
        <AvailableChats chats={availableChats} />
      </div>
    </div>
  );
}

export default withBaseLayout(Home);
