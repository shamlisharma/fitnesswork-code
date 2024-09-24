// /**
//  * @format
//  */
// import React from 'react';
import * as React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry, SafeAreaView} from 'react-native';

import Routes from './src/Routes';
import {name as appName} from './app.json';
import Toast from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './src/_store/Store';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import {View} from 'react-native-animatable';

// const store = store()
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Message handled in the background!', remoteMessage);
});

const RNRedux = () => {
  const {store, persistor} = configureStore();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Routes />
        </PersistGate>
      </Provider>
      <Toast />
    </SafeAreaView>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);



