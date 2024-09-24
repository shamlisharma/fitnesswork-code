import React, {useReducer} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import {validateName} from '../../common/Validation';
import InlineError from '../../common/InlineError';
import AuthHeader from "../../components/header/AuthHeader";
import {Screen} from "../../common/Screen";

function SignupFirstName(props) {
  const navigation = useNavigation();
  const [data, setData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      firstName: '',
      firstNameError: '',
    },
  );
 
  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      firstNameError: '',
    });
  };

  function onSubmitSignupFirstName() {
    let {firstName} = data;

    if (firstName === '') {
      setData({firstNameError: Constants.Errors.FirstNameError});
    } else if (!validateName(firstName).status) {
      setData({firstNameError: Constants.Errors.FirstNameFormatError});
    } else {
      navigation.navigate('SignupLastName', {
        password: props.route.params.pass,
        firstName: firstName,
      });
    }
  }
  let {firstNameError} = data;
  return (
    <Screen auth={"true"}>
      <ImageBackground
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: "100%"}}>
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.Container}>
            <View style={{paddingTop: 140}}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontWeight: '700',
                  lineHeight:20
                }}>
               Introduce yourself
              </Text>
            </View>
            <View style={{paddingTop: 5, paddingBottom: 20}}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.grey_4,
                  lineHeight:20
                }}>
                What is your name?
              </Text>
            </View>
            <View style={styles.inputField}>
              <TextInput
                keyboardType="email-address"
                style={styles.inputFieldTxt}
                placeholderTextColor="#E0E0E0"
                placeholder="Enter your first name here"
                value={data.firstName}
                onChangeText={value => setData({firstName: value})}
                name="firstName"
                onChange={handleChange}
                selectionColor={COLORS.blue}
                returnKeyType="next"
                onSubmitEditing={onSubmitSignupFirstName}
              />
            </View>
            <InlineError errorMessage={firstNameError} />
            <AppButton
              title="Next"
              onPress={onSubmitSignupFirstName}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                top: '45%',
              }}>
              <SignupStepsNum num1="4" />
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
    width:'100%',
    paddingLeft:10
  },
});
export default SignupFirstName;
