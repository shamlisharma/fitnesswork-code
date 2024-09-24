import React, {useReducer, useState} from 'react';
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
} from '../../common/Constant';
import InlineError from '../../common/InlineError';
import {validateEmail} from '../../common/Validation';
import AuthHeader from '../../components/header/AuthHeader';
import {sendOTPAction} from '../../_action/otpAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {forgotPassword} from '../../_action/AuthAction';
import {useDispatch} from 'react-redux';
import {Screen} from '../../common/Screen';

function ForgotPass() {
  let dispatch = useDispatch();
  const navigation = useNavigation();
  const [data, setData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      email: '',
      emailError: '',
    },
  );

  const [loader, setLoader] = useState(false);

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      emailError: '',
    });
  };

  function onSubmitSignupAge() {
    let {email} = data;

    if (email === '') {
      setData({emailError: Constants.CommonEmptyError});
    } else if (!validateEmail(email).status) {
      setData({emailError: Constants.Errors.EmailError});
    } else {
      let req = {
        email: email.toLowerCase(),
      };
      setLoader(true);

      setData({isLoader: true});
      dispatch(forgotPassword(req))
        .then(async res => {
          console.log("buhahah",res)
          if (res.data.statusCode === 1) {
            setLoader(false);
            await AsyncStorage.setItem(
              'userId',
              res.data.responseData.userId.userId,
            );
            navigation.navigate('ForgotPassOtp');
          } else {
            setLoader(false);
            setData({
              emailError: res.data.error.responseMessage,
            });
          }
        })
        .catch(err => {
          setData({isLoader: false, otpError: 'Network Error'});
        });
    }
  }

  let {emailError} = data;
  return (
    <Screen auth={'true'}>
      
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
                  fontWeight: 'bold',
                  fontFamily: 'Manrope',
                }}>
                Please, enter your email here
              </Text>
            </View>
            <View style={styles.inputField}>
              <TextInput
                keyboardType="email-address"
                style={styles.inputFieldTxt}
                placeholderTextColor="#E0E0E0"
                placeholder="Email"
                value={data.email}
                onChangeText={value => setData({email: value})}
                name="email"
                onChange={handleChange}
                autoCapitalize="none"
                selectionColor={COLORS.blue}
              />
            </View>
            <InlineError errorMessage={emailError} />
            <AppButton title="Submit" onPress={onSubmitSignupAge} />
          </View>
        </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 30,
    height: DeviceScreen.height,
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
    fontFamily: 'Manrope',
    paddingLeft: 10,
    width:'100%'
  },
});
export default ForgotPass;
