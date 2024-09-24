import React, {useEffect, useReducer, useState} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

import {
  AppButton,
  COLORS,
  Constants,
  DeviceScreen,
  SignupStepsNum,
} from '../../common/Constant';

import {Loader} from '../../common/Loader';
import {Screen} from '../../common/Screen';

function NoInternet() {
  return (
    <View>
      <ImageBackground
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: '100%'}}>
        <View style={styles.flexView}>
          <ActivityIndicator size="large" color="#0DB8DA" />
          <Text style={styles.textCentre}>
            No internet connection, make sure, make sure that WI-FI or local
            mobile data is turned on
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  textCentre: {
    textAlign: 'center',

    color: 'white',
    padding: 10,
  },
  flexView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default NoInternet;
