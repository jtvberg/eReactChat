import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import chatReducer from '../reducers/chats';
import authReducer from '../reducers/auth';
import appReducer from '../reducers/app';
import appMiddleware from './middleware/app';

export default function configureStore() {
  const middleware = [thunkMiddleware, appMiddleware];

  const store = createStore(
    combineReducers({
      chats: chatReducer,
      auth: authReducer,
      app: appReducer,
    }),
    applyMiddleware(...middleware)
  );

  return store;
}
