import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DeviceScreen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const COLORS = {
  white: '#fff',
  black: '#000',
  red: 'red',
  blue: '#0DB8DA',
  lightGreen: '#0CDD99',
  lightBlue: '#0DB8DA',
  inputTxtColor: '#F9F9F9',
  light_grey: '#F9F9F9',
  lightGrey: '#b6b2b2',
  grey: 'grey',
  grey_1: '#333333',
  grey_2: '#4F4F4F',
  grey_3: '#828282',
  grey_4: '#BDBDBD',
  grey_5: '#E0E0E0',
  grey_6: '#F2F2F2',
  // your colors
};
export const Constants = {
  CommonEmptyError: 'This field cannot be empty.',
  Errors: {
    EmailError: 'Invalid mail format',
    PasswordError: 'Password must be valid.',
    PasswordLengthError: 'Have 6 characters minimum',
    PasswordSpecialUpperCharError: 'Include upper case letters',
    PasswordLowerCharError: 'Include lower case letters',
    PasswordNumberError: 'Include one number',
    PassFormatError: 'Password must contain a special character and number',
    PasswordSpecialCharError: 'Include special character',
    ResetPasswordError: 'New password and confirm password must be same.',
    FirstNameError: 'First name cannot be empty',
    FirstNameFormatError: 'Please enter valid first name.',
    LastNameError: 'Last name cannot be empty',
    LastNameFormatError: 'Please enter valid last name.',
    HeightError: 'Please fill your height',
    maxHeightCMError: 'height can not be more than 215 cms',
    minHeightCMError: 'height can not be less than 130 cms',
    maxHeightFTError: 'height can not be more than 7.1 ft',
    minHeightFTError: 'height can not be less than 4.2 ft',
    WeightError: 'Please fill your weight',
    maxWeightKiloError: 'weight cannot be more than 250 kgs',
    minWeightKiloError: 'weight cannot be less than 25 kgs',
    maxWeightLbsError: 'weight cannot be more than 440 lbs',
    minWeightLbsError: 'weight cannot be less than 55 lbs',
  },
};
export const SignupStepsNum = ({num1}) => (
  <View style={{flexDirection: 'row'}}>
    <Text>
      <Text
        style={{
          color: COLORS.lightGreen,
          fontSize: 24,
          fontFamily: 'Manrope-Bold',
        }}>
        {num1}
      </Text>
      <Text
        style={{
          color: COLORS.white,
          fontSize: 18,
          fontFamily: 'Manrope-Regular',
        }}>
        /
      </Text>
      <Text
        style={{
          color: COLORS.white,
          fontSize: 18,
          fontFamily: 'Manrope-Regular',
        }}>
        8
      </Text>
    </Text>
  </View>
);
export const AppButton = ({onPress, title}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      justifyContent: 'center',
      alignSelf: 'center',
      paddingTop: 30,
    }}>
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[COLORS.lightGreen, COLORS.lightBlue]}
      style={{
        width: 335,
        height: 53,
        padding: 10,
        marginTop: 18,
        alignItems: 'center',
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      <Text
        style={{
          color: '#fff',
          textAlign: 'center',
          fontSize: 16,
          paddingTop: 0,
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

export const NotificationData = {
  notification1: 'All types of notifications will turn on',
  notification2:
    'Practical and motivational tips to help you achieve your goal.',
  notification3: 'Get reminders to stay active.',
  notification4:
    'Get reminders to train and also when your friends have trained.',
  notification5: 'Log and track your progress.',
  notification6: '(coming soon)',
};
//Community component

export async function isLoggedIn() {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) {
    return false;
  }
  return true;
}
