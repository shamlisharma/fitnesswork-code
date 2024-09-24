import React, {useState, useReducer, useEffect} from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform, Linking,
    Keyboard
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CheckBox from "@react-native-community/checkbox";
import {
  AppButton,
  COLORS,
  Constants,
  DeviceScreen,
  SignupStepsNum,
} from '../../common/Constant';
import InlineError from '../../common/InlineError';
import {validateEmail, validatePassword} from '../../common/Validation';
import {sendOTPAction} from '../../_action/otpAction';
import {connect, useDispatch} from 'react-redux';
import {EmailIcon} from '../../Svg';
import AuthHeader from '../../components/header/AuthHeader';
import {Loader} from '../../common/Loader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Screen} from '../../common/Screen';

function SignupEmail() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
    const [loader,setLoader]=useState(false);
    const [isApiSuccess,setIsApiSuccess]=useState(false);
  const [data, setData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      email: '',
      emailError: '',
      isSelected1: false,
      isSelected2: false,
      isSelected3: false,
      isSelected4: false,
      isSelectError: '',
      isSelect1Error: '',
      isSelect2Error: '',
      isSelect3Error: '',
      isLoader: false,
      commonError: '',
    },
  );
  

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      emailError: '',
      isSelectError: '',
      commonError: '',
    });
  };
  function onSubmitSignupEmail() {
    let {email, isSelected1, isSelected2, isSelected3, isSelected4} = data;

    if (email === '') {
      setData({emailError: Constants.CommonEmptyError});
    } else if (!validateEmail(email).status) {
      setData({emailError: Constants.Errors.EmailError});
    }

    if(isSelected1 == false) {
      setData({isSelect1Error: Constants.CommonEmptyError});
    }
    else {
      setData({isSelect1Error: ''});
    }

    if(isSelected2 == false) {
      setData({isSelect2Error: Constants.CommonEmptyError});
    }
    else {
        setData({isSelect2Error: ''});
      }
    
    if(isSelected3 == false) {
      setData({isSelect3Error: Constants.CommonEmptyError});
    }
    else {
      setData({isSelect3Error: ''});
    } 

    if(email && isSelected1 && isSelected2 && isSelected3) {

  
      let data = new FormData();
      data.append('email', email);
      let req = {
        email: email.toLowerCase(),
      };
        setLoader(true);
      dispatch(sendOTPAction(req)).then(async res => {
   
          if (res.data.statusCode === 1) {
             await AsyncStorage.setItem('userId', res.data.responseData.userId);
             await AsyncStorage.removeItem('userProfile')
              setIsApiSuccess(true)
              setLoader(false);
              navigation.navigate('SignupOtp', {eMail:email});
              setData({commonError:""})
          } else {
              setIsApiSuccess(false);
              setLoader(false);
              setData({
                  commonError: res.data.error.responseMessage,
              });
          }
      }).catch((err) => {
      alert(err.message)
              setData({ commonError: err.message });
              setLoader(false);
      });    
    
    
    }

  }
  let {
    emailError, 
    isSelectError,
    isSelect1Error,
    isSelect2Error,
    isSelect3Error
  } = data;
  return (
    <Screen auth={"true"}>
      {loader ? <Loader loading={true}/>:null}
    <ImageBackground
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: "100%"}}>
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        <ScrollView style={{flex: 1}} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.Container}>
            <View style={{paddingTop: 40}}>

              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontWeight: '700',
                    lineHeight:20
                }}>
                Enter your email
              </Text>
            </View>
            <View style={{paddingTop: 5, paddingBottom: 20}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.grey_4,
                    lineHeight:20
                }}>
                We'll use this address to create your account.
              </Text>
            </View>
            <View style={styles.inputField}>
              <View style={styles.icon}>
                <EmailIcon />
              </View>
              <TextInput
                  keyboardType={'email-address'}
                style={styles.inputFieldTxt}
                placeholderTextColor="#E0E0E0"
                placeholder="Email"
                value={data.email}
                onChangeText={value => setData({email: value})}
                name="email"
                maxLength={50}
                autoCapitalize="none"
                onChange={handleChange}
                selectionColor={COLORS.blue}
                returnKeyType='done'
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
            <InlineError errorMessage={emailError} />
            <InlineError errorMessage={data.commonError} />
            <View
              style={{flexDirection: 'row', marginTop: '3%', paddingLeft: 0}}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Please, accept that you agree
              </Text>
            </View>
            <View
              style={styles.checkboxContainer}>
                <View style={Platform.OS === "ios" ? styles.squareCheckBox : styles.squareCheckBoxAndroid}>
                <CheckBox
                  value={data.isSelected1}
                  onValueChange={value => setData({isSelected1: value})}
                  tintColors={{
                    true: COLORS.lightGreen,
                    false: COLORS.lightGreen,
                  }}
                  onFillColor={'#08ae7e'}
                  onCheckColor={'#08ae7e'}
                  boxType="square"
                  name="isSelect1"
                  tintColor={COLORS.white}
                  onTintColor={'#08ae7e'}
                  onChange={handleChange}
                  style={Platform.OS === "ios" ? styles.checkbox :styles.checkboxAndroid}
                />
              </View>
              <Text
                style={styles.descTitle}>
                I accept the{' '}
              </Text>
              <TouchableOpacity 
              style={{
                 marginBottom: isSelect1Error? 5: 0 
                }}
                
                  //https://fitnessvwork.com/terms-of-services/
               
              onPress={() => Linking.openURL("https://fitnessvwork.com/terms-of-services/")}>
                <Text
                  style={{
                    color: COLORS.lightGreen,
                    textDecorationLine: 'underline',
                    paddingLeft: 2,
                    fontSize: 15,
                    paddingTop: 5,
                  }}>
                  Terms and Conditions
                </Text>
              </TouchableOpacity>
            </View>
            <InlineError errorMessage={isSelect1Error} />
            <View
              style={[styles.checkboxContainer, { marginBottom: isSelect2Error? 5: 0  }]}>
                <View style={Platform.OS === "ios" ? styles.squareCheckBox : styles.squareCheckBoxAndroid}>
                    <CheckBox
                        value={data.isSelected2}
                        onValueChange={value => setData({isSelected2: value})}
                        tintColors={{
                            true: COLORS.lightGreen,
                            false: COLORS.lightGreen,
                        }}
                        onFillColor={'#08ae7e'}
                        onCheckColor={'#08ae7e'}
                        boxType="square"
                        name="isSelect2"
                        tintColor={COLORS.white}
                        onTintColor={'#08ae7e'}
                        onChange={handleChange}
                        style={Platform.OS === "ios" ? styles.checkbox :styles.checkboxAndroid}
                    />
                </View>
              <Text
                  style={styles.descTitle}>
                I've read the{' '}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL("https://fitnessvwork.com/privacy-policy/")}>
                <Text
                  style={{
                    color: COLORS.lightGreen,
                    textDecorationLine: 'underline',
                    paddingLeft: 2,
                    fontSize: 15,
                    paddingTop: 5,
                  }}>
                  Privacy and Policy
                </Text>
              </TouchableOpacity>
            </View>
            <InlineError errorMessage={isSelect2Error} />
            <View style={[styles.checkboxContainer,{ marginBottom: isSelect2Error? 0: 0 }]}>
                <View style={Platform.OS === "ios" ? styles.squareCheckBox : styles.squareCheckBoxAndroid}>
                    <CheckBox
                        value={data.isSelected3}
                        onValueChange={value => setData({isSelected3: value})}
                        tintColors={{
                            true: COLORS.lightGreen,
                            false: COLORS.lightGreen,
                        }}
                        onFillColor={'#08ae7e'}
                        onCheckColor={'#08ae7e'}
                        boxType="square"
                        name="isSelect3"
                        tintColor={COLORS.white}
                        onTintColor={'#08ae7e'}
                        onChange={handleChange}
                        style={Platform.OS === "ios" ? styles.checkbox :styles.checkboxAndroid}
                    />
                </View>
              <Text style={styles.fitDesc}>
                I’m happy for Fitnessvwork to collect data on how I’m using the
                app, find out more in the{'  '}
                  
                <Text
                onPress={() => Linking.openURL("https://fitnessvwork.com/privacy-policy/")}
                  style={{
                    color: COLORS.lightGreen,
                      fontSize: 15,
                      marginLeft:4,
                      textDecorationLine:"underline"

                  }}>
                  Privacy and Policy
                </Text>
                  
              </Text>
            </View>
            <InlineError errorMessage={isSelect3Error} />
            <View
                style={styles.checkboxContainer}>
                <View style={Platform.OS === "ios" ? styles.squareCheckBox : styles.squareCheckBoxAndroid}>
                    <CheckBox
                        value={data.isSelected4}
                        onValueChange={value => setData({isSelected4: value})}
                        tintColors={{
                            true: COLORS.lightGreen,
                            false: COLORS.lightGreen,
                        }}
                        onFillColor={'#08ae7e'}
                        onCheckColor={'#08ae7e'}
                        boxType="square"
                        name="isSelect4"
                        tintColor={COLORS.white}
                        onTintColor={'#08ae7e'}
                        onChange={handleChange}
                        style={Platform.OS === "ios" ? styles.checkbox :styles.checkboxAndroid}
                    />
                </View>
              <Text
                  style={styles.descTitle}>
                I want to Join the Fitnessvwork mailing list, for weekly blogs
                and event info
              </Text>
            </View>
            <AppButton
              title="Verify your email"
              onPress={onSubmitSignupEmail}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                top: '5%',
              }}>
              <SignupStepsNum num1="1" />
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
    height: 45,
    borderRadius: 0,
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 12,
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
    paddingLeft: 10,
    width:'90%',
  },
  // squareCheckBox: {
  //   borderWidth: 1.5,
  //   borderColor: COLORS.white,
  //   position: 'absolute',
  // },
    checkboxContainer:{
      flexDirection: 'row',
        // flex:.2,
        marginTop:"5%",
        // marginBottom: 8
  },
    descTitle:{
        color: COLORS.white,
        paddingLeft: Platform.OS === "ios" ?'3%': '13%',
        fontSize: 15,
        lineHeight:20,
        paddingTop: 5,

    },
    fitDesc:{
        color: COLORS.white,
        marginLeft: Platform.OS === "ios" ?'3%': '13%',
        fontSize: 15,
        lineHeight:20
    },
    squareCheckBox: {
        borderWidth: 1.5,
        borderColor: COLORS.white,
        width:26,
        height:26,
    },
    squareCheckBoxAndroid: {
        borderWidth: 1.5,
        borderColor: COLORS.white,
        width:30,
        height:30,
        position: 'absolute',
    },
    checkbox:{
        width:12.89,
        height:12.89,
        marginTop:4.5,
        marginLeft:4.5
    },
    checkboxAndroid:{
        bottom:3,
        right:3
    },
});
const mapStateToProps = state => {
  return {};
};
export default connect(mapStateToProps, {sendOTPAction})(SignupEmail);
