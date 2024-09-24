import React, {useEffect, useReducer, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  COLORS,
  Constants,
  DeviceScreen,
  SignupStepsNum,
} from '../../common/Constant';
import InlineError from '../../common/InlineError';
import {verifyOTPAction, sendOTPAction} from '../../_action/otpAction';
import {connect, useDispatch} from 'react-redux';
import AuthHeader from '../../components/header/AuthHeader';
import {Loader} from '../../common/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Screen} from '../../common/Screen';
import GradientButton from '../../components/GradientButton';
import CountDownTimer from '../../components/CountDownTimer';

const WAIT_FOR_OTP = 31000;

function SignupOtp() {
  const navigation = useNavigation();
  const route = useRoute();
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

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    let timerId = setTimeout(() => setDisabled(false), WAIT_FOR_OTP);

    return () => {
      clearTimeout(timerId);
    };
  }, [disabled]);

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      otpError: '',
    });
  };

  function onResendOTP() {
    setData({otp: '', otpError: ''});
    let req = {
      email: route.params.eMail.toLowerCase(),
    };
    setLoader(true);
    dispatch(sendOTPAction(req))
      .then(async res => {
        if (res.data.statusCode === 1) {
          await AsyncStorage.setItem('userId', res.data.responseData.userId);
          setLoader(false);
          setDisabled(true);
        } else {
          setData({otpError: res.data.error.sresponseMessage});
        }
      })
      .catch(err => {
        setLoader(false);
      });
  }
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
            navigation.replace('SignupPass');
          } else {
            console.log('res.data====', res.data);
            setIsApiSuccess(false);
            setLoader(false);
            setData({
              otpError: res.data.error.errors.responseMessage,
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
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
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
              <Text
                style={{
                  fontSize: 14,
                  color:'#0DB8DA',
                  lineHeight: 20,
                }}>
                {route?.params?.eMail.toLowerCase()}
              </Text>
            </View>
            <View style={{paddingTop: 15, paddingBottom: 20}}>
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
                returnKeyType="next"
                onChange={handleChange}
                selectionColor={COLORS.blue}
                onSubmitEditing={onSubmitSignupOTP}
              />
            </View>
            <InlineError errorMessage={otpError} />
            <View
              style={{
                flexWrap: 'wrap-reverse',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {disabled && (
                <Text style={{color: 'white'}}>
                  {' '}
                  Wait <CountDownTimer duration={WAIT_FOR_OTP} /> seconds to{' '}
                </Text>
              )}
              <TouchableOpacity
                style={{alignItems: 'flex-end', opacity: disabled ? 0.5 : 1}}
                onPress={onResendOTP}
                disabled={disabled}>
                <Text style={{color: COLORS.lightGreen}}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.25, marginTop: 30}}>
              <GradientButton
                title="Verify your OTP"
                onPress={onSubmitSignupOTP}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                top: '40%',
              }}>
              <SignupStepsNum num1="2" />
            </View>
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
    width: '100%',
    paddingLeft: 10,
  },
});
const mapStateToProps = state => {
  return {};
};
export default connect(mapStateToProps, {verifyOTPAction})(SignupOtp);
