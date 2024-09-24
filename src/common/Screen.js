import React from 'react';
import {SafeAreaView, StatusBar, ImageBackground, View} from 'react-native';

export const Screen = React.memo(props => {
  return (
    <>
      <StatusBar
      
        backgroundColor={
          props.auth == 'true' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.6)'
        }
        barStyle="light-content"
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            props.auth == 'true' ? 'rgba(7,7,7,0.75)' : 'rgba(7,7,7,0.6)',
        }}>
        <ImageBackground
          source={require('../../assets/bgSignin.png')}
          style={{width: '100%', height: '100%'}}>
          {props.children}
        </ImageBackground>
      </SafeAreaView>
    </>
  );
});

export const MainScreen = React.memo(props => {
  const {statusBarColor, lightContent, translucent, color} = props;
  return (
    <>
      <StatusBar
        translucent={translucent}
        backgroundColor={statusBarColor || '#fff'}
        barStyle={lightContent ? 'light-content' : 'dark-content'}
      />
      {translucent ? (
        <View style={{flex: 1, backgroundColor: color || '#fff'}}>
          <View style={{width: '100%', height: '100%'}}>{props.children}</View>
        </View>
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: color || '#fff'}}>
          <View style={{width: '100%', height: '100%'}}>{props.children}</View>
        </SafeAreaView>
      )}
    </>
  );
});
