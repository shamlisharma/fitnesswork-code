import React, {useState, useReducer} from 'react';
import {
    Image,
    ImageBackground, Platform,
    SafeAreaView,
    ScrollView, StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from 'react-native-linear-gradient';
import {validatePassword} from '../../common/Validation';
import InlineError from '../../common/InlineError';
import {COLORS, Constants, DeviceScreen} from '../../common/Constant';
import {EyeIcon, CloseEyeIcon} from '../../Svg';
import {useDispatch} from 'react-redux';
import {Loader} from '../../common/Loader';
import AuthHeader from "../../components/header/AuthHeader";
import { resetPassword } from '../../_action/AuthAction';
import {Screen} from "../../common/Screen";

const hasNumber = (myString) => {
    return /\d/.test(myString);
  };
  const isValid = (str) => {
    return /[!@#$%^&*(),.?":{}|<>]/g.test(str);
  };

function ResetPassword() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [userInput, setUserInput] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            newPassword: '',
            confirmPassword:'',
            confirmPasswordError: '',
            newPasswordError: '',
            commonError:"",
        },
    );

    const [hidePass, setHidePass] = useState(true);
    const [hideNewPass, setHideNewPass] = useState(true);
    const [loader,setLoader]=useState(false);

    const handleChange = e => {
        setUserInput({
            ...userInput,
            [e.target.name]: e.target.value,
            confirmPasswordError: '',
            newPasswordError: '',
            commonError:"",
        });
    };

    //onSubmit
    async function signIn() {
        let {confirmPassword, newPassword} = userInput;
        if (newPassword.length <= 5) {
            setUserInput({newPasswordError:Constants.Errors.PasswordLengthError});
          }else if(newPassword.trim() === ""){
            setUserInput({newPasswordError:Constants.Errors.PasswordLengthError});
          }else if(!newPassword.match(/[A-Z]/g)){
            setUserInput({newPasswordError: Constants.Errors.PasswordSpecialUpperCharError});
          }else if(!newPassword.match(/[a-z]/g)){
            setUserInput({newPasswordError: Constants.Errors.PasswordLowerCharError});
          }else if (!hasNumber(newPassword)) {
            setUserInput({newPasswordError: Constants.Errors.PasswordNumberError});
          }
          else if (!isValid(newPassword)) {
            setUserInput({newPasswordError: Constants.Errors.PasswordSpecialCharError});
          }
          else if (newPassword.length < 0) {
            setUserInput({newPasswordError: Constants.CommonEmptyError});
          } else if (confirmPassword.length <= 5) {
            setUserInput({confirmPasswordError:Constants.Errors.PasswordLengthError});
          }else if(confirmPassword.trim() === ""){
            setUserInput({confirmPasswordError:Constants.Errors.PasswordLengthError});
          }else if(!confirmPassword.match(/[A-Z]/g)){
            setUserInput({confirmPasswordError: Constants.Errors.PasswordSpecialUpperCharError});
          }else if(!confirmPassword.match(/[a-z]/g)){
            setUserInput({confirmPasswordError: Constants.Errors.PasswordLowerCharError});
          }else if (!hasNumber(confirmPassword)) {
            setUserInput({confirmPasswordError: Constants.Errors.PasswordNumberError});
          }
          else if (!isValid(confirmPassword)) {
            setUserInput({confirmPasswordError: Constants.Errors.PasswordSpecialCharError});
          }
          else if (confirmPassword.length < 0) {
            setUserInput({confirmPasswordError: Constants.CommonEmptyError});
          }else if (newPassword !== confirmPassword) {
            setUserInput({commonError: Constants.Errors.ResetPasswordError});
        } else {
            let req = {
                userId: await AsyncStorage.getItem('userId'),
                newPassword: newPassword,
                
            }
            setLoader(true)
            dispatch(resetPassword(req)).then(res => {
                if (res.data.statusCode === 1) {
                    setLoader(false)
                    setUserInput({confirmPassword: "", newPassword: ""});
                    navigation.replace('SignIn');
                } else {
                    setLoader(false)
                    setUserInput({
                        commonError: res.data.error.responseMessage,
                    });
                }
            }).catch((err) => {
                setLoader(false)
                setUserInput({ otpError: "Network Error",});
            });
        }
    }

    let {confirmPassword,newPassword,confirmPasswordError, newPasswordError} = userInput;
    return (
        <>
           <Screen auth={"true"}>
                {loader ? <Loader loading={true}/>:null}
                <ImageBackground
                    source={require('../../../assets/bgSignin.png')}
                    style={{width: DeviceScreen.width, height: "100%",}}>
                    <AuthHeader title="Reset Password" onPress={() => navigation.goBack()} />
                    <ScrollView style={{flex:1, backgroundColor: 'rgba(7,7,7,0.4)',}} contentContainerStyle={{paddingBottom:20,}}
                        showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                flex: 0.7,
                                justifyContent: 'center',
                                position: 'relative',
                                paddingTop: 20,
                            }}>
                            <View style={styles.Container} />
                            <View style={{padding: 28, paddingVertical: '32%'}}>

                                <View style={styles.inputField}>
                                    <TextInput
                                        style={styles.inputFieldTxt}
                                        placeholderTextColor="#ffffffb3"
                                        secureTextEntry={hideNewPass ? true : false}
                                        placeholder="New password"
                                        maxLength={50}
                                        value={newPassword}
                                        onChangeText={value => setUserInput({newPassword: value})}
                                        name="newPassword"
                                        onChange={handleChange}
                                        autoCapitalize="none"
                                        selectionColor={COLORS.blue}
                                    />
                                    <TouchableOpacity onPress={() => setHideNewPass(!hideNewPass)}>
                                        {hideNewPass ? <CloseEyeIcon /> : <EyeIcon />}
                                    </TouchableOpacity>
                                </View>
                                <InlineError errorMessage={newPasswordError} />

                                <View style={styles.inputField}>
                                    <TextInput
                                        style={styles.inputFieldTxt}
                                        placeholderTextColor="#ffffffb3"
                                        placeholder="Confirm Password"
                                        secureTextEntry={hidePass ? true : false}
                                        value={confirmPassword}
                                        minLength={6}
                                        maxLength={50}
                                        onChangeText={value => setUserInput({confirmPassword: value})}
                                        name="confirmPassword"
                                        autoCapitalize="none"
                                        onChange={handleChange}
                                        selectionColor={COLORS.blue}
                                    />
                                    <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
                                        {hidePass ? <CloseEyeIcon /> : <EyeIcon />}
                                    </TouchableOpacity>
                                </View>
                                <InlineError errorMessage={confirmPasswordError} />
                                <InlineError errorMessage={userInput.commonError} />

                                <TouchableOpacity onPress={() => signIn()}>
                                    <LinearGradient
                                        colors={[COLORS.lightGreen, COLORS.lightBlue]}
                                        style={{
                                            padding: 10,
                                            marginTop: 18,
                                            alignItems: 'center',
                                            borderRadius: 30,
                                        }}>
                                        <Text style={{color: COLORS.white, fontSize: 20}}>
                                            Reset Password
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </Screen>
        </>
    );
}
const styles = StyleSheet.create({
    Container: {
        flex: 0.1,
        paddingTop: 89,
        paddingBottom: 0,

    },
    inputField: {
        flexDirection: 'row',
        borderBottomColor: COLORS.white,
        borderBottomWidth: 1,
        height: 40,
        borderRadius: 0,
        alignItems: 'center',
    },
    icon: {
        marginLeft: 12,
    },
    errorField: {
        flexDirection: 'row',
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        height: 55,
        borderRadius: 0,
        alignItems: 'center',
    },
    inputFieldTxt: {
        height: 40,
        width: '80%',
        fontSize: 15,
        marginLeft: 12,
        lineHeight: 20,
        color: COLORS.inputTxtColor,
    },
    squareCheckBox: {
        borderWidth: 1.5,
        borderColor: COLORS.white,
        width:23,
        height:23
    },
    squareCheckBoxAndroid: {
        borderWidth: 1.5,
        borderColor: COLORS.white,
        width:30,
        height:30
    },
    checkbox:{
        width:10.89,
        height:10.89,
        top:4,
        left:4
    },
    checkboxAndroid:{
        bottom:3,
        right:3
    },
    checkboxContainer:{
        flexDirection: 'row',
        top: Platform.OS === "ios" ? 4 : 0
    }
});

export default ResetPassword;
