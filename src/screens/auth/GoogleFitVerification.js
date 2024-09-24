import React, { useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {MainScreen} from '../../common/Screen';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {googleVarification, signupTypes} from '../../_action/AuthAction';

const GoogleFitVerification = () => {
  const dispatch = useDispatch();

  function onClickGoogleAuth() {
    GoogleFit.checkIsAuthorized().then(() => {
      console.log('unauthorized===', GoogleFit.isAuthorized);
      if (GoogleFit.isAuthorized) {
        // login
      } else {
        // not login
        const options = {
          scopes: [
            Scopes.FITNESS_ACTIVITY_READ,
            Scopes.FITNESS_BODY_READ,
            Scopes.FITNESS_LOCATION_READ,
            Scopes.FITNESS_SLEEP_READ,
          ],
        };
        GoogleFit.authorize(options)
          .then(authResult => {
            console.log('google fit respinse', authResult);
            if (authResult.success) {
            // if (true) {
              console.log('new arrrrrrr');
              setItems();
              dispatch({type: signupTypes.GOOGLE_SIGNIN});
            } else {
              console.error(authResult.message);
            }
          })
          .catch(() => {
            dispatch('AUTH_ERROR');
          });
      }
    });
  }

  async function setItems() {
    await AsyncStorage.setItem('googleAuthStatus', JSON.stringify(false));
  }


  return (
    <MainScreen>
      <View style={style.container}>
        <View style={style.txtContainer}>
          <Text style={style.activateFitTxt}>Activate to Google Fit</Text>
          <Text style={style.commanTxt}>
            By connecting Fitnessvwork and Google Fit, you can easily integrate
            your fitness and sleep activity and you view your steps count during
            runs from various sources to help you batter understand your
            progress towords metabolic health
          </Text>
          <Text style={style.commanTxt}>
            Google Fit is an open platform that lets you control your fitness
            data from multiple app and device.
          </Text>
          <Text style={style.commanTxt}>
            You can enable or disconnect Google Fit at any time by going to
            setting
          </Text>
        </View>
        <View style={style.btnContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={style.btnView(true)}
            onPress={() => onClickGoogleAuth()}>
            <Image
              resizeMode="contain"
              source={require('../../images/Icon-40.png')}
            />
            <Text style={style.fitTxt}>{'Connect to Google Fit'}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity activeOpacity={0.9} style={style.btnView(false)}>
            <Text style={style.fitTxt}>{'Skip'}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </MainScreen>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  txtContainer: {
    flex: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    flex: 2.5,
    justifyContent: 'center',
  },
  btnView: status => ({
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    borderRadius: 30,
    backgroundColor: status ? 'rgb(245,250,250)' : 'rgb(245,250,250)',
    alignItems: 'center',
    marginTop: status ? 0 : 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  }),
  fitTxt: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    marginLeft: 14,
  },
  activateFitTxt: {
    fontSize: 23,
    fontFamily: 'Manrope-Bold',
  },
  commanTxt: {
    fontSize: 17,
    fontFamily: 'Manrope-Regular',
    textAlign: 'center',
    marginVertical: 15,
    letterSpacing: 0.2,
  },
});

export default GoogleFitVerification;
