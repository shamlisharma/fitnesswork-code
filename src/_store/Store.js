import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'remote-redux-devtools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../_reducer';
import logger from 'redux-logger';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whiteList: ['commonReducer']
  }
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
  const persistor = persistStore(store);
  
  export default () => ({store, persistor});
  