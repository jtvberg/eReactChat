import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import StoreProvider from './store/StoreProvider';
import HomeView from './views/Home';
import SettingsView from './views/Settings';
import WelcomeView from './views/Welcome';
import ChatView from './views/Chat';
import LoadingView from './components/shared/LoadingView';
import ChatCreate from './views/ChatCreate';
import { listenToAuthChanges } from './actions/auth';
import { checkUserConnection } from './actions/connection';
import { listenToConnectionChanges } from './actions/app';

function AuthRoute({ children, ...rest }) {
  const user = useSelector(({ auth }) => auth.user);
  const onlyChild = React.Children.only(children);
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          React.cloneElement(onlyChild, { ...rest, ...props })
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

const ContentWrapper = ({ children }) => (
  <div className="content-wrapper">{children}</div>
);

function ChatApp() {
  const dispatch = useDispatch();
  const isChecking = useSelector(({ auth }) => auth.isChecking);
  const isOnline = useSelector(({ app }) => app.isOnline);
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    const unsubFromAuth = dispatch(listenToAuthChanges());
    const unsubFromConnection = dispatch(listenToConnectionChanges());

    return () => {
      unsubFromAuth();
      unsubFromConnection();
    };
  }, [dispatch]);

  useEffect(() => {
    let unsubFromUserConnection;
    if (user?.uid) {
      unsubFromUserConnection = dispatch(checkUserConnection(user.uid));
    }
    return () => {
      unsubFromUserConnection && unsubFromUserConnection();
    };
  }, [dispatch, user]);

  if (!isOnline) {
    return <LoadingView message="Connection lost..." />;
  }

  if (isChecking) {
    return <LoadingView />;
  }

  return (
    <Router>
      <ContentWrapper>
        <Switch>
          <Route path="/" exact>
            <WelcomeView />
          </Route>
          <AuthRoute path="/home">
            <HomeView />
          </AuthRoute>
          <AuthRoute path="/chatCreate">
            <ChatCreate />
          </AuthRoute>
          <AuthRoute path="/chat/:id">
            <ChatView />
          </AuthRoute>
          <AuthRoute path="/settings">
            <SettingsView />
          </AuthRoute>
        </Switch>
      </ContentWrapper>
    </Router>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ChatApp />
    </StoreProvider>
  );
}
