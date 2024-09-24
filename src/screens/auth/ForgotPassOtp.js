import React, {useEffect, useReducer, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  AppButton,
  COLORS,
  Constants,
  DeviceScreen,
  SignupStepsNum,
} from '../../common/Constant';
import InlineError from '../../common/InlineError';
import {verifyOTPAction} from '../../_action/otpAction';
import {connect, useDispatch} from 'react-redux';
import AuthHeader from '../../components/header/AuthHeader';
import {Loader} from '../../common/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Screen} from '../../common/Screen';

function ForgotPassOtp() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const [data, setData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      otp: '',
      otpError: '',
      isLoader: false,
    },
  );

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      otpError: '',
    });
  };
  async function onSubmitSignupOTP() {
    let {otp} = data;

    if (otp === '') {
      setData({otpError: Constants.CommonEmptyError});
    } else {
      let req = {
        otp: otp,
        userId: await AsyncStorage.getItem('userId'),
      };

      setLoader(true);
      dispatch(verifyOTPAction(req))
        .then(res => {
          if (res.data.statusCode === 1) {
            setIsApiSuccess(true);
            setLoader(false);
            navigation.navigate('ResetPassword');
          } else {
            setIsApiSuccess(false);
            setLoader(false);
            setData({
              otpError: res.data.error.responseMessage,
            });
          }
        })
        .catch(err => {
          setData({isLoader: false, otpError: 'Network Error'});
        });
    }
  }
  let {otpError} = data;
  return (
    <Screen auth={'true'}>
      {loader ? <Loader loading={true} /> : null}
      <ImageBackground
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: '100%'}}>
        <AuthHeader
          title="Forgot Password"
          onPress={() => navigation.goBack()}
        />
        <ScrollView style={{flex: 1}} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.Container}>
            <View style={{paddingTop: 140}}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontWeight: '700',
                  lineHeight: 20,
                }}>
                Please, check your email
              </Text>
            </View>
            <View style={{paddingTop: 5, paddingBottom: 20}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.grey_4,
                  lineHeight: 20,
                }}>
                If you don't see in it your inbox, check spam
              </Text>
            </View>
            <View style={styles.inputField}>
              <TextInput
                keyboardType="numeric"
                style={styles.inputFieldTxt}
                placeholderTextColor="#ffffffb3"
                placeholder="Enter OTP here"
                value={data.otp}
                onChangeText={value => setData({otp: value})}
                name="otp"
                maxLength={6}
                onChange={handleChange}
                selectionColor={COLORS.blue}
              />
            </View>
            <InlineError errorMessage={otpError} />
            <AppButton title="Verify your OTP" onPress={onSubmitSignupOTP} />
          </View>
        </ScrollView>
      </ImageBackground>
    </Screen>
  );
}
const styles = StyleSheet.create({
  Container: {
    height: DeviceScreen.height,
    padding: 30,
    backgroundColor: 'rgba(7,7,7,0.4)',
  },
  inputField: {
    flexDirection: 'row',
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 55,
    borderRadius: 0,
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorField: {
    fontSize: 16,
    marginVertical: 5,
    color: COLORS.white,
  },
  inputFieldTxt: {
    height: 50,
    fontSize: 15,
    color: COLORS.grey_5,
    left: 10,
  },
});
const mapStateToProps = state => {
  return {};
};
export default connect(mapStateToProps, {verifyOTPAction})(ForgotPassOtp);
