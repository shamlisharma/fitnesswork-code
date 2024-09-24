import React from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../RootNavigation';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getToken();
  }
}

const getToken = async () => {
  let token = await AsyncStorage.getItem('nToken');
  console.log('token==', token);
  // if (!token || token == null) {
  try {
    const fcmToken = await messaging().getToken();
    messaging().onTokenRefresh(token => {});
    if (fcmToken) {
      console.log(('the new token', fcmToken));
      await AsyncStorage.setItem('nToken', fcmToken);
    }
   
  } catch (error) {
    console.log(error, 'error in token');
  }
  // }
};

const moveToScreen = (remoteMessage, type) => {
  setTimeout(() => {
    if (remoteMessage?.notification?.title == 'Steps Leaderboard') {
      RootNavigation.navigate('Home', {
        navigateTo: type == 'steps' ? 'steps' : '',
      });
    } 
    else if (remoteMessage?.notification?.title == 'Steps Message') {
      RootNavigation.navigate('Home', {
        navigateTo: type == 'steps' ? 'steps' : '',
      });
    }else if(remoteMessage?.notification?.title == 'Measurements'){
      RootNavigation.navigate('Milestones Tracker');
    }else {
      console.log("remoteMessage data",remoteMessage)
      let navigationPath = remoteMessage?.data?.type === undefined ? 'steps' : remoteMessage?.data?.type
      RootNavigation.navigate(navigationPath);
    }
  }, 1000);
};

export const notificationListener = () => {
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        moveToScreen(remoteMessage, 'steps');
      }
    });
  messaging().onNotificationOpenedApp(remoteMessage => {
    moveToScreen(remoteMessage, 'steps');
    // RootNavigation.navigate(remoteMessage.data.type);

    // console.log(
    //   'Notification caused app to open from background state:',
    //   remoteMessage,
    // );
  });

  messaging().onMessage(async remoteMessage => {
    // console.log('recived in foreground', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        RootNavigation.navigate(remoteMessage.data.type);
        // console.log('Notification caused app to open from quit state:');
      }
    });
};
