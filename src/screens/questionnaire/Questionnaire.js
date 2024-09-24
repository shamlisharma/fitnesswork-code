import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Text, View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {
  AppButton,
  COLORS,
  Constants,
  DeviceScreen,
} from '../../common/Constant';
import SelectDropdown from 'react-native-select-dropdown';
import Header from '../../components/header/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {DropdownIcon} from '../../Svg';
import {useDispatch, useSelector, connect} from 'react-redux';
import {
  questionnaireAction,
  getQuestionnaireAction,
} from '../../_action/QuestionnaireAction';
import moment from 'moment';
import InlineError from '../../common/InlineError';
import {getProfileAction} from '../../_action/ProfileAction';
import {MainScreen} from '../../common/Screen';
import GradientButton from '../../components/GradientButton';
import {useIsFocused} from '@react-navigation/core';
import {BackHandler} from 'react-native';
import AlertModal from '../modal/AlertModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Loader } from '../../common/Loader';

let Questionnaire = React.memo(function Questionnaire(props) {
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const {params} = props?.route;
  const navigation = useNavigation();
  const objectiveDropdownRef = useRef();
  const activityDropdownRef = useRef();
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const questionnaireData = useSelector(
    state => state?.questReducer?.QuestionnaireData?.data?.responseData?.result,
  );

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      questionnaireData: '',
      activityData: '',
      sleepGoal: '',
      stepsGoal: '',
      dailyActivityLevel: '',
      trainningExpData: '',
      goal: '',
      weight: '',
      height: '',
      ageDob: '',
      feet: '',
      heightUnit: '',
      weightUnit: '',
      inch: '',
      objectiveError: '',
      weightError: '',
      heightError: '',
      feetError: '',
      activityError: '',
      trainingExp: '',
      trainingExpDataError: '',
      Data: ['Fat Loss', 'Maintain', 'Build muscle'],
      trainingExpArray: ['Beginner', 'Intermediate', 'Advanced'],
      Activity: [
        'Sedentary (Little or no exercise)',
        'Lightly Active (Sports 1-3 days/week)',
        'Moderately Active (Sports 3-5 days/week)',
        'Very Active (Trains everyday)',
      ],
    },
  );
  const [ft, setFT] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const weightUnit = ['KG', 'LBS'];
  const heightUnit = ['CM', 'FT'];

  useEffect(() => {
    if (
      questionnaireData?.height &&
      questionnaireData?.height.toString().includes('.')
    ) {
      let inchCopy = questionnaireData?.height.toString().split('.');
      let inchCopyStr = questionnaireData?.height;
      console.log(
        "get questionnaireData from api's",
        inchCopy,
        'inchCopyStr',
        inchCopyStr,
      );
      setUserInput({
        feet: Math.floor(questionnaireData.height),
        //inch: inchCopy[1],
        inch: userInput.inch === '' ? inchCopy[1] : userInput.inch,
        heightUnit: questionnaireData?.heightUnit,
      });
    }
  }, [questionnaireData]);

  useEffect(() => {
    var dob = getProfileData?.dob ? getProfileData?.dob : '.';
    var dob2 = dob.split('.');
    var dob3 = parseInt(dob2[2]);
    var dd = new Date();
    var d = dd.getFullYear();

    var age = d - dob3;
    // console.log('age coming===',dob);
    // console.log('dob3 coming===',dob3);
    // console.log('date coming===',moment('15.10.96').format('YYYY'));
    if (isNaN(age) === true) setUserInput({ageDob: 0});
    else setUserInput({ageDob: `${age}`});
  }, [getProfileData?.dob]);

  useFocusEffect(
    React.useCallback(() => {
      setUserInput({...questionnaireData});
    }, [isFocused]),
  );

  useEffect(() => {
    objectiveDropdownRef.current.reset();
    activityDropdownRef.current.reset();

    return () => {
      setUserInput({heightError: '', weightError: ''});
    };
  }, [isFocused]);

  const handleChange = e => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
      objectiveError: '',
      weightError: '',
      heightError: '',
      feetError: '',
      activityError: '',
      trainningExpDataError: '',
    });
  };

  function questionnaireSave() {

    console.log({userInput});
    if (userInput.goal == '' || userInput.goal == null) {
      setUserInput({objectiveError: 'Please select your objective'});
    } else if (userInput.weight == 0 || userInput.weight == '') {
      setUserInput({weightError: Constants.Errors.WeightError});
    } else if (
      userInput.weightUnit.toLowerCase() == 'kg' &&
      userInput.weight > 250
    ) {
      setUserInput({weightError: Constants.Errors.maxWeightKiloError});
    } else if (
      userInput.weightUnit.toLowerCase() == 'kg' &&
      userInput.weight < 25
    ) {
      setUserInput({weightError: Constants.Errors.minWeightKiloError});
    } else if (
      userInput.weightUnit.toLowerCase() == 'lbs' &&
      userInput.weight > 440
    ) {
      setUserInput({weightError: Constants.Errors.maxWeightLbsError});
    } else if (
      userInput.weightUnit.toLowerCase() == 'lbs' &&
      userInput.weight < 55
    ) {
      setUserInput({weightError: Constants.Errors.minWeightLbsError});
    } else if (
      userInput.heightUnit.toLowerCase() === 'cm' &&
      userInput.height == 0
    ) {
      setUserInput({heightError: Constants.Errors.HeightError});
    } else if (
      userInput.heightUnit.toLowerCase() === 'cm' &&
      userInput.height > 215
    ) {
      setUserInput({heightError: Constants.Errors.maxHeightCMError});
    } else if (
      userInput.heightUnit.toLowerCase() === 'cm' &&
      userInput.height < 130
    ) {
      setUserInput({heightError: Constants.Errors.minHeightCMError});
    } else if (
      userInput.heightUnit.toLowerCase() === 'ft' &&
      parseFloat(`${userInput.feet}.${userInput.inch}`) > 7.1
    ) {
      setUserInput({heightError: Constants.Errors.maxHeightFTError});
    } else if (
      userInput.heightUnit.toLowerCase() === 'ft' &&
      parseFloat(`${userInput.feet}.${userInput.inch}`) < 4.2 &&
      parseFloat(`${userInput.feet}.${userInput.inch}`) != 4.1
    ) {
      setUserInput({heightError: Constants.Errors.minHeightFTError});
    } else if (ft == true && userInput.feet == 0) {
      setUserInput({feetError: Constants.Errors.HeightError});
    } else if (
      userInput.heightUnit.toLowerCase() === 'cm' &&
      userInput.height == ''
    ) {
      setUserInput({heightError: Constants.Errors.HeightError});
    } else if (ft == true && userInput.feet == '') {
      setUserInput({feetError: Constants.Errors.HeightError});
    } else if (
      userInput.dailyActivityLevel == '' ||
      userInput.dailyActivityLevel == null
    ) {
      setUserInput({activityError: 'Please choose your daily acitivity level'});
    }
    // else if (userInput.weight > 200) {
    //   setErrorAlert(true)
    //   // alert('please enter valid data');
    // } else if (userInput.heightUnit === 'ft' && userInput.feet > 9) {
    //   setErrorAlert(true)
    //   // alert('please enter valid data');
    // } else if (userInput.heightUnit === 'cm' && userInput.height > 600) {
    //   setErrorAlert(true)
    //   // alert('please enter valid data');
    // } else if (userInput.trainingExp === '' || userInput.trainingExp === null) {
    //   setUserInput({
    //     trainingExpDataError: 'Please choose your trainning experiance',
    //   });
    // }
    else {
      setLoader(true)
      let req = {
        height:
          ft == true && userInput.heightUnit != 'cm'
            ? userInput.feet + '.' + userInput.inch
            : userInput.height,
        weight: userInput.weight,
        weightUnit: userInput.weightUnit == null ? 'KG' : userInput.weightUnit,
        heightUnit: userInput.heightUnit == null ? 'CM' : userInput.heightUnit,
        goal: userInput.goal,
        dailyActivityLevel: userInput.dailyActivityLevel,
        trainingExp: userInput.trainingExp,
        stepsGoal: parseInt(userInput.stepsGoal),
        sleepGoal: parseInt(userInput.sleepGoal),
      };
      console.log("req of questionare",req);
      dispatch(questionnaireAction(req)).then(res => {
        console.log("res of questionaire",res);
        if (res.data.statusCode === 1) {
        
          dispatch(getQuestionnaireAction());
          setLoader(false)
          // navigation.goBack()
          navigation.navigate('Home');
          setUserInput({heightError: '', feetError: ''});
        }else{
          setLoader(false)
        }
      });
      console.log("get questionnaireData from api's req", req);
    }
  }

  // function handleBackButtonClick() {
  //   navigation.navigate('HomeTab');
  //   return true;
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       handleBackButtonClick,
  //     );
  //   };
  // }, []);

  // console.log("userInput.feet + '.' + userInput.inch",userInput.height,userInput.feet + '.' + userInput.inch);

  return (
    <MainScreen>
      <Header
        title="Questionnaire"
        status={params?.filter == 'drawer' ? 'drawer' : 'back'}
      />
      <KeyboardAwareScrollView>
        <AlertModal
          alert={errorAlert}
          onResume={() => setErrorAlert(false)}
          headertitle="Alert"
          content={
            'Please enter valid values, eg. Weight cannot be more than 200 kg, and height cannot be more than 600 cm or 9 ft.'
          }
          cancelBtn=""
          saveBtn="Ok"
          width={100}
          opacity={'#000000cf'}
        />
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.textHeadFrmt, {color: COLORS.grey_4}]}>
                Gender :
              </Text>
              <Text style={[styles.textFrmt, {textTransform: 'capitalize'}]}>
                {' '}
                {getProfileData?.gender}
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingLeft: 60}}>
              <Text style={[styles.textHeadFrmt, {color: COLORS.grey_4}]}>
                Age :
              </Text>
              <Text style={styles.textFrmt}> {`${userInput?.ageDob} y.o`}</Text>
            </View>
          </View>

          <View style={{paddingVertical: 10, marginBottom: 10}}>
            <Text style={styles.textFrmt}>Objective</Text>
            <SelectDropdown
              data={userInput.Data}
              ref={objectiveDropdownRef}
              onSelect={(selectedItem, index) => {
                setUserInput({goal: selectedItem, objectiveError: ''});
              }}
              defaultButtonText={
                questionnaireData?.goal || 'Select an objective'
              }
              defaultValue={questionnaireData?.goal}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={() => {
                return <DropdownIcon />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
            {userInput?.objectiveError ? (
              <View style={{paddingVertical: 5, paddingHorizontal: 2}}>
                <InlineError errorMessage={userInput.objectiveError} />
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <View style={{width: '50%'}}>
              <Text style={styles.textHeadFrmt}>Your Weight</Text>
            </View>
            <View style={{width: '50%'}}>
              <Text style={styles.textHeadFrmt}>Your Height</Text>
            </View>
          </View>
          <View style={styles.dropdownsContainer}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputFieldTxt}
                    placeholder="weight"
                    name="weight"
                    placeholderTextColor="#E0E0E0"
                    value={userInput.weight === 0 ? '' : `${userInput.weight}`}
                    onChangeText={value => setUserInput({weight: value})}
                    keyboardType="decimal-pad"
                    selectionColor={COLORS.blue}
                    maxLength={5}
                    onChange={handleChange}
                  />
                </View>
                <SelectDropdown
                  data={weightUnit}
                  defaultValueByIndex={0}
                  defaultValue={userInput.weightUnit}
                  onSelect={(selectedItem, index) => {
                    setUserInput({weightUnit: selectedItem, weightError: ''});
                  }}
                  defaultButtonText={userInput.weightUnit}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={[
                    styles.dropdown4BtnTxtStyle,
                    {textTransform: 'uppercase'},
                  ]}
                  renderDropdownIcon={() => {
                    return <DropdownIcon />;
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={[
                    styles.dropdown4BtnTxtStyle,
                    {textTransform: 'uppercase'},
                  ]}
                />
              </View>
              {userInput.weightError ? (
                <View style={{padding: 2}}>
                  <InlineError errorMessage={userInput.weightError} />
                </View>
              ) : null}
            </View>
            <View
              style={{
                right: 65,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={
                    userInput.heightUnit.toLowerCase() != 'cm'
                      ? styles.inputFieldFeet
                      : styles.inputField
                  }>
                  <TextInput
                    style={
                      userInput.heightUnit.toLowerCase() != 'cm'
                        ? styles.inputFieldTxtFeet
                        : styles.inputFieldTxt
                    }
                    placeholder={
                      userInput.heightUnit.toLowerCase() != 'cm'
                        ? 'feet'
                        : 'height'
                    }
                    placeholderTextColor="#E0E0E0"
                    maxLength={
                      userInput.heightUnit.toLowerCase() != 'cm' ? 1 : 3
                    }
                    value={
                      userInput.heightUnit.toLowerCase() != 'cm'
                        ? `${userInput.feet}`
                        : userInput.height === 0 || userInput.height == ''
                        ? ''
                        : `${Math.floor(userInput.height)}`
                    }
                    onChangeText={value =>
                      userInput.heightUnit.toLowerCase() != 'cm'
                        ? setUserInput({feet: value})
                        : setUserInput({height: value})
                    }
                    keyboardType="numeric"
                    selectionColor={COLORS.blue}
                    name="height"
                    onChange={handleChange}
                  />
                </View>
                {userInput.heightUnit.toLowerCase() != 'cm' ? (
                  <View style={styles.inputFieldFeet}>
                    <TextInput
                      style={styles.inputFieldTxtFeet}
                      placeholder="inch"
                      maxLength={2}
                      placeholderTextColor="#E0E0E0"
                      value={
                        userInput.inch === '0' ? userInput.inch : userInput.inch
                      }
                      onChangeText={value => {
                        console.log(value);
                        if (value > 11) setUserInput({inch: '11'});
                        else {
                          setUserInput({inch: value});
                        }
                      }}
                      keyboardType="numeric"
                      selectionColor={COLORS.blue}
                    />
                  </View>
                ) : (
                  <></>
                )}
                <SelectDropdown
                  data={
                    questionnaireData?.heightUnit == 'ft'
                      ? ['FT', 'CM']
                      : ['CM', 'FT']
                  }
                  defaultValueByIndex={0}
                  defaultValue={userInput.heightUnit}
                  onSelect={(selectedItem, index) => {
                    setUserInput({
                      heightUnit: selectedItem,
                      feetError: '',
                      heightError: '',
                      height: '',
                      feet: '',
                      inch: '',
                    });
                    {
                      selectedItem.toLowerCase() == 'ft'
                        ? setFT(true)
                        : setFT(false);
                    }
                  }}
                  defaultButtonText={userInput.heightUnit}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={
                    userInput.heightUnit.toLowerCase() != 'cm'
                      ? styles.dropdown5BtnStyleFeet
                      : styles.dropdown5BtnStyle
                  }
                  buttonTextStyle={[
                    styles.dropdown4BtnTxtStyle,
                    {textTransform: 'uppercase'},
                  ]}
                  renderDropdownIcon={() => {
                    return <DropdownIcon />;
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={[
                    styles.dropdown4BtnTxtStyle,
                    {textTransform: 'uppercase'},
                  ]}
                />
              </View>
            </View>
          </View>
          {userInput.heightError ? (
            <View style={{padding: 2, alignItems: 'flex-end'}}>
              <InlineError errorMessage={userInput.heightError} />
            </View>
          ) : null}
          {userInput.feetError ? (
            <View style={{padding: 2, alignItems: 'flex-end'}}>
              <InlineError errorMessage={userInput.feetError} />
            </View>
          ) : null}

          <View style={[styles.activityContainer]}>
            <Text style={styles.textFrmt}>Daily Activity Level</Text>
            <SelectDropdown
              data={userInput.Activity}
              ref={activityDropdownRef}
              onSelect={(selectedItem, index) => {
                setUserInput({
                  dailyActivityLevel: selectedItem,
                  activityError: '',
                });
              }}
              defaultButtonText={
                questionnaireData?.dailyActivityLevel ||
                'Select an activity level'
              }
              defaultValue={questionnaireData?.dailyActivityLevel}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={() => {
                return <DropdownIcon />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
            {userInput.activityError ? (
              <View style={{paddingHorizontal: 3, paddingVertical: 7}}>
                <InlineError errorMessage={userInput.activityError} />
              </View>
            ) : null}
          </View>

          <View style={[styles.activityContainer]}>
            <Text style={styles.textFrmt}>Training Experience </Text>
            <SelectDropdown
              data={userInput.trainingExpArray}
              ref={activityDropdownRef}
              onSelect={(selectedItem, index) => {
                setUserInput({
                  trainingExp: selectedItem,
                  trainingExpDataError: '',
                });
              }}
              defaultButtonText={
                questionnaireData?.trainingExp || 'Select an activity level'
              }
              defaultValue={userInput.trainingExp}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={() => {
                return <DropdownIcon />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
            {userInput.trainingExpDataError ? (
              <View style={{paddingHorizontal: 3, paddingVertical: 7}}>
                <InlineError errorMessage={userInput.trainingExpDataError} />
              </View>
            ) : null}
          </View>
          <View style={{paddingTop: 40}}>
            <GradientButton title="Save" onPress={questionnaireSave} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* <Loader loading={loader}/> */}
    </MainScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: DeviceScreen.width,
    height: DeviceScreen.height,
    padding: 15,
  },
  activityContainer: {
    paddingVertical: 10,
  },
  textFrmt: {
    fontSize: 16,
    color: '#4d4c4c',
    color: COLORS.grey_3,
  },
  textHeadFrmt: {
    fontSize: 16,
    color: COLORS.grey,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    top: 6,
    borderColor: '#F2F2F2',
  },
  dropdown1BtnTxtStyle: {color: '#4d4c4c', textAlign: 'left', fontSize: 16},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#F2F2F2',
    borderBottomColor: COLORS.lightGrey,
  },
  dropdown1RowTxtStyle: {
    color: '#4d4c4c',
    textAlign: 'left',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
  },
  dropdown4BtnStyle: {
    width: '34%',
    height: 50,
    backgroundColor: '#F9F9F9',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  dropdown4BtnTxtStyle: {color: '#444', fontSize: 14},
  dropdown4DropdownStyle: {backgroundColor: '#3d3c3c'},
  dropdown4RowStyle: {
    backgroundColor: '#e0dbdb',
    borderBottomColor: '#F2F2F2',
  },
  dropdown4RowTxtStyle: {color: '#444', fontSize: 14},
  inputFieldTxt: {
    width: 60,
    height: 50,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.grey_2,
  },
  inputFieldTxtFeet: {
    width: 60,
    height: 50,
    fontSize: 16,
    marginLeft: 12,
    paddingLeft: 10,
    color: COLORS.grey_2,
  },
  inputFieldTextTarget: {
    width: '100%',
    height: 50,
    fontSize: 16,
    padding: 10,
    color: COLORS.grey_2,
  },
  inputField: {
    width: '35%',
    height: 50,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    alignItems: 'center',
  },
  inputFieldFeet: {
    width: '20%',
    height: 50,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    alignItems: 'center',
  },
  inputFieldtarget: {
    width: '48%',
    height: 50,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    alignItems: 'center',
    margin: 6,
  },
  dropdown5BtnStyle: {
    width: '35%',
    height: 50,
    backgroundColor: '#F9F9F9',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  dropdown5BtnStyleFeet: {
    width: '30%',
    height: 50,
    backgroundColor: '#F9F9F9',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  inputimage: {
    width: 25,
    height: 25,
  },
  dropdownsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
const mapStateToProps = state => {
  return {
    getQuestionnaireData:
      state?.questReducer?.QuestionnaireData?.data?.responseData?.result,
  };
};
export default connect(mapStateToProps)(Questionnaire);
