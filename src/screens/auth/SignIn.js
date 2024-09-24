import React, { useState, useReducer, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import Tts from "react-native-tts";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail, validatePassword } from "../../common/Validation";
import InlineError from "../../common/InlineError";
import { COLORS, Constants } from "../../common/Constant";
import {
  EmailIcon,
  LockIcon,
  EyeIcon,
  CloseEyeIcon,
  FitnessLogo,
  DangerEmailIcon,
  DangerLockIcon,
} from "../../Svg";
import { useDispatch } from "react-redux";
import { loginAction } from "../../_action/AuthAction";
import { Loader } from "../../common/Loader";
import { Screen } from "../../common/Screen";
import GradientButton from "../../components/GradientButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DeviceInfo from "react-native-device-info";
import convertToCache from "react-native-video-cache";
// import Api from '../../config/Api';

const PERSISTENCE_KEY = "NAVIGATION_STATE";
function SignIn(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const useMount = (func) => useEffect(() => func(), []);
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: "",
      password: "",
      rememberMe: false,
      emailError: "",
      passwordError: "",
      isLoader: false,
      commonError: "",
      rememberMeData: [],
    }
  );
  const [updatedUrl, setUpdatedUrl] = useState("");
  const ref_input2 = useRef();

  const onSignUp = () => {
    navigation.navigate("SignUpEmail");
  };

  useEffect(() => {
    getUserDetails();
    //Keyboard.dismiss();
  }, []);

  useEffect(() => {
    let data = convertToCache(
      "https://cdn.fitnessvwork.com/exerciseVideo_1662444446334_Seated-V-Bar-Cable-Row.mp4"
    );
    setUpdatedUrl(data);
  }, []);

  const [hidePass, setHidePass] = useState(true);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      emailError: "",
      passwordError: "",
      commonError: "",
    });
  };

  //onSubmit
  async function signIn() {
    let uniqueId = DeviceInfo.getUniqueId();
    let token = await AsyncStorage.getItem("nToken");
    let { email, password } = data;
    if (email === "" && password === "") {
      setData({
        emailError: Constants.CommonEmptyError,
        passwordError: Constants.CommonEmptyError,
      });
    } else if (email === "") {
      setData({ emailError: Constants.CommonEmptyError });
    }
    // else if (!validateEmail(email).status) {
    //   setData({emailError: Constants.Errors.EmailError});
    // }
    else if (password === "") {
      setData({ passwordError: Constants.CommonEmptyError });
    } else if (false) {
      // } else if (!validatePassword(password).status) {
      setData({ passwordError: Constants.Errors.PassFormatError });
    } else {
      setLoader(true);
      let req = {
        email: email.toLowerCase(),
        password: password,
        deviceToken: token,
        deviceId: Platform.OS == "android" ? "android" : "ios",
      };
      console.log("req login action", req);
      dispatch(loginAction(req, () => setLoader(false)))
        .then(async (res) => {
          console.log("response login=>>", res);
          if (res.data.statusCode === 1) {
            await AsyncStorage.setItem(
              "accessToken",
              res.data.responseData.accessToken
            );
            await AsyncStorage.removeItem(PERSISTENCE_KEY);
            if (data.rememberMe === true) {
              await AsyncStorage.setItem(
                "userProfile",
                JSON.stringify({ username: email, password: password })
              );
            } else {
              await AsyncStorage.setItem("userProfile", "");
            }
          } else {
            setData({ commonError: res.data.error.responseMessage });
          }
        })
        .catch((err) => {
          console.log("caught===", err);
          setLoader(false);
          if (err) {
            if (err.message) {
              setData({ commonError: err.message });
            } else {
              setData({ commonError: err });
            }
          } else {
            setData({ commonError: "Something went wrong" });
          }
        });
      setLoader(false);
    }
  }

  async function getUserDetails() {
    const userData = await AsyncStorage.getItem("userProfile");
    let token = await AsyncStorage.getItem("nToken");
    console.log({ token });
    if (JSON.parse(userData) != null) {
      setData({ email: JSON.parse(userData).username });
      setData({ password: JSON.parse(userData).password });
      setData({ rememberMe: true });
    }
  }
  async function clearRemeberData(value) {
    setData({ rememberMe: value });
  }

  const keyboardVerticalOffset = Platform.OS === "ios" ? -150 : 0;

  let { emailError, passwordError, commonError } = data;

  return (
    <Screen>
      {/* {loader ? <Loader loading={loader} /> : null} */}

      <View style={styles.headerStyle}>
        <FitnessLogo />
      </View>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        nestedScrollEnabled={true}
      >
        <View>
          <Text style={styles.titleTextStyle}>Sign in</Text>

          <View style={styles.inputField}>
            <View style={[styles.icon]}>
              {emailError ? <DangerEmailIcon /> : <EmailIcon />}
            </View>
            <TextInput
              style={[
                styles.inputFieldTxt,
                { borderBottomColor: emailError ? "red" : "white" },
              ]}
              keyboardType="email-address"
              placeholderTextColor="#ffffffb3"
              placeholder="Email"
              maxLength={50}
              value={data.email}
              onChangeText={(value) => setData({ email: value })}
              name="email"
              onChange={handleChange}
              autoCapitalize="none"
              selectionColor={COLORS.blue}
              autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={() => ref_input2.current.focus()}
            />
          </View>
          <InlineError
            style={styles.inlineErrorStyle}
            errorMessage={emailError}
          />

          <View style={styles.inputField}>
            <View style={styles.icon}>
              {passwordError ? <DangerLockIcon /> : <LockIcon />}
            </View>
            <TextInput
              style={[
                styles.inputFieldTxt,
                { borderBottomColor: passwordError ? "red" : "white" },
              ]}
              placeholderTextColor="#ffffffb3"
              placeholder="Password"
              secureTextEntry={hidePass ? true : false}
              value={data.password}
              minLength={6}
              maxLength={50}
              onChangeText={(value) => setData({ password: value })}
              name="password"
              autoCapitalize="none"
              onChange={handleChange}
              selectionColor={COLORS.blue}
              ref={ref_input2}
              returnKeyType="done"
              onSubmitEditing={() => signIn()}
            />
            <TouchableOpacity
              style={styles.eyeButtonStyle}
              onPress={() => setHidePass(!hidePass)}
            >
              {hidePass ? <CloseEyeIcon /> : <EyeIcon />}
            </TouchableOpacity>
          </View>
          <InlineError
            style={styles.inlineErrorStyle}
            errorMessage={passwordError || commonError}
          />

          <View style={styles.rememberMeAndForgotPasswordContainer}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkboxContainer}>
                  <View
                    style={
                      Platform.OS === "ios"
                        ? styles.squareCheckBox
                        : styles.squareCheckBoxAndroid
                    }
                  >
                    <CheckBox
                      value={data.rememberMe}
                      onValueChange={(value) => clearRemeberData(value)}
                      tintColors={{
                        true: COLORS.lightGreen,
                        false: COLORS.lightGreen,
                      }}
                      tintColor={COLORS.white}
                      onFillColor={"#08ae7e"}
                      onCheckColor={"#08ae7e"}
                      boxType="square"
                      onTintColor={"#08ae7e"}
                      style={
                        Platform.OS === "ios"
                          ? styles.checkbox
                          : styles.checkboxAndroid
                      }
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.rememberMeTextStyle}>Remember me</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
              <Text style={styles.forgotPasswordTextStyle}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <GradientButton
            title="Sign In"
            onPress={() => signIn()}
            textStyle={styles.signinButtonTextStyle}
            style={{ padding: 10 }}
          />
          <View style={styles.signupButtonContainer}>
            <TouchableOpacity onPress={() => onSignUp()}>
              <Text style={styles.signupTextStyle}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  headerStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: "15%",
  },
  container: {
    justifyContent: "center",
    paddingHorizontal: 25,
    position: "absolute",
    bottom: "5%",
  },
  titleTextStyle: {
    fontSize: 28,
    color: COLORS.lightBlue,
    fontFamily: "Manrope-Regular",
    textAlign: "center",
    marginBottom: 15,
  },
  inputField: {
    flexDirection: "row",
  },
  icon: {
    position: "absolute",
    padding: 10,
  },
  inputFieldTxt: {
    height: 45,
    paddingLeft: 40,
    width: "100%",
    fontFamily: "Manrope-Regular",
    borderBottomWidth: 1,
    fontSize: 15,
    color: COLORS.inputTxtColor,
  },
  squareCheckBox: {
    borderWidth: 1.5,
    borderColor: COLORS.white,
    width: 25,
    height: 25,
  },
  squareCheckBoxAndroid: {
    borderWidth: 1.5,
    borderColor: COLORS.white,
    width: 30,
    height: 30,
  },
  checkbox: {
    width: 12,
    height: 12,
    top: 5,
    left: 5,
  },
  checkboxAndroid: {
    bottom: 3,
    right: 3,
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  eyeButtonStyle: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  forgotPasswordTextStyle: {
    color: COLORS.lightGreen,
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Manrope-Regular",
  },
  rememberMeTextStyle: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Manrope-Regular",
    alignSelf: "center",
  },
  inlineErrorStyle: {
    paddingHorizontal: 10,
  },
  rememberMeAndForgotPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  signupTextStyle: {
    color: COLORS.lightGreen,
    fontSize: 24,
    textDecorationLine: "underline",
    fontFamily: "Manrope-Regular",
  },
  signupButtonContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  signinButtonTextStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 20,
  },
});

export default SignIn;
