import React, { useReducer, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AppButton,
  COLORS,
  Constants,
  DeviceScreen,
  SignupStepsNum,
} from "../../common/Constant";
import { validatePassword } from "../../common/Validation";
import InlineError from "../../common/InlineError";
import AuthHeader from "../../components/header/AuthHeader";
import { Screen } from "../../common/Screen";
import { CloseEyeIcon, EyeIcon } from "../../Svg";

const hasNumber = (myString) => {
  return /\d/.test(myString);
};
const isValid = (str) => {
  return /[!@#$%^&*(),.?":{}|<>]/g.test(str);
};

function SignupPassword(props) {
  const navigation = useNavigation();
  const [secure, setSecure] = useState(true);
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      password: "",
      checkLength: false,
      checkUpperChar: false,
      checkLowerChar: false,
      isNumber: false,
      isSpecialChar: false,
      passwordError: "",
    }
  );

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      passwordError: "",
    });
  };

  //onSubmit
  function onSubmitPassword() {
    let { password } = data;
    if (password.length === 0) {
      setData({ passwordError: Constants.CommonEmptyError });
    } else if (!password.match(/[A-Z]/g)) {
      setData({
        passwordError: Constants.Errors.PasswordSpecialUpperCharError,
      });
    } else if (!isValid(password)) {
      setData({ passwordError: Constants.Errors.PasswordSpecialCharError });
    } else {
      props.navigation.navigate("SignupFirstName", {
        pass: password,
      });
    }
  }

  let { passwordError } = data;
  return (
    <Screen auth={"true"}>
      <ImageBackground
        source={require("../../../assets/bgSignin.png")}
        style={{ width: DeviceScreen.width, height: "100%" }}
      >
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.Container}>
            <View style={{ paddingTop: 140 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontWeight: "700",
                  lineHeight: 20,
                }}
              >
                Create password
              </Text>
            </View>
            <View style={{ paddingTop: 5, paddingBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.grey_4,
                  lineHeight: 20,
                }}
              >
                Password should contain 1 upper case and special character
              </Text>
            </View>
            <View style={styles.inputField}>
              <TextInput
               
                // keyboardType="email-address"
                style={styles.inputFieldTxt}
                placeholderTextColor="#E0E0E0"
                placeholder="Enter the password here"
                value={data.password}
                onChangeText={value => setData({password: value})}
                name="password"
                autoCapitalize="none"
                minLength={6}
                maxLength={50}
                onChange={handleChange}
                secureTextEntry={secure}
                selectionColor={COLORS.blue}
                returnKeyType="next"
                onSubmitEditing={onSubmitPassword}
              />

              <TouchableOpacity
                style={styles.eyeButtonStyle}
                onPress={() => setSecure(!secure)}
              >
                {secure ? <CloseEyeIcon /> : <EyeIcon />}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                top: "90%",
              }}
            >
              <SignupStepsNum num1="3" />
            </View>
            <InlineError errorMessage={passwordError} />
            <AppButton title="Save the password" onPress={onSubmitPassword} />
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
    backgroundColor: "rgba(7,7,7,0.4)",
  },
  inputField: {
    flexDirection: "row",
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 55,
    borderRadius: 0,
    alignItems: "center",
  },
  icon: {
    alignSelf: "center",
    alignContent: "center",
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
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
    flex: 1,
    marginRight: 5,
    // width:'100%',
  },
  eyeButtonStyle: {
    justifyContent: "center",
    marginTop: 8,

    // position: 'absolute',
    // right: 10,
    // bottom: 10,
  },
});

export default SignupPassword;
