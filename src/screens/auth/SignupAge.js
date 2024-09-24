import React, {useReducer, useState} from 'react';
import {StyleSheet, Text, View, Pressable, Appearance} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {COLORS, Constants, SignupStepsNum} from '../../common/Constant';
import InlineError from '../../common/InlineError';
import DatePicker from 'react-native-date-picker';
import {DobCalenderIcon} from '../../Svg';
import AuthHeader from '../../components/header/AuthHeader';
import {Screen} from '../../common/Screen';
import GradientButton from '../../components/GradientButton';
import moment from 'moment';

function SignupAge(props) {
  const {colors} = useTheme();
  const colorScheme = Appearance.getColorScheme();
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [data, setData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      age: '',
      ageError: '',
    },
  );

  function onSubmitSignupAge() {
    let {age} = data;

    if (age === '') {
      setData({ageError: Constants.CommonEmptyError});
    } else {
      navigation.navigate('SignupGender', {
        password: props.route.params.password,
        firstName: props.route.params.firstName,
        lastName: props.route.params.lastName,
        age: age,
      });
    }
  }
  let {ageError} = data;

  return (
    <Screen auth={'true'}>
      <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
      <View style={styles.Container}>
        <View style={{width: '100%'}}>
          <Text style={styles.titleText}>What is your age?</Text>
          <Text style={styles.subtitleText}>
            Please, enter your date of birth
          </Text>
          <Pressable
            style={styles.selectDateFieldStyle}
            onPress={() => setOpen(true)}>
            <DobCalenderIcon />
            <Text style={styles.dateTextStyle}>{data.age || `DD.MM.YYYY`}</Text>
          </Pressable>
          <InlineError errorMessage={ageError} />
          <View style={styles.buttonContainerStyle}>
            <GradientButton title="Save the date" onPress={onSubmitSignupAge} />
          </View>
        </View>
        <DatePicker
          textColor={'black'}
          modal
          mode="date"
          open={open}
          date={date}
          androidVariant="nativeAndroid"
          maximumDate={moment().subtract(16, 'years')._d}
          minimumDate={new Date('1940-01-01')}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setData({age: moment(date).format('DD.MM.YYYY'), ageError: ''});
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <View style={{position: 'absolute', bottom: 30}}>
          <SignupStepsNum num1="6" />
        </View>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'rgba(7,7,7,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
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
    width: '95%',
    height: 50,
    alignSelf: 'flex-start',
    fontSize: 15,
    color: COLORS.grey_4,
    top: 5,
  },
  titleText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: 'white',
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: 'white',
  },
  selectDateFieldStyle: {
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 2,
    paddingHorizontal: 15,
    borderColor: COLORS.grey_4,
    flexDirection: 'row',
  },
  buttonContainerStyle: {
    marginTop: 15,
  },
  dateTextStyle: {
    color: 'white',
    paddingLeft: 10,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
  },
});
export default SignupAge;
