import React, {useEffect, useReducer, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  CalenderIcon,
  CameraIcon,
  ChangePassIcon,
  DropdownIcon,
  PassEyeIcon,
} from '../../Svg';
import {AppButton, COLORS, Constants} from '../../common/Constant';
import SelectDropdown from 'react-native-select-dropdown';
import {validateName, validatePassword} from '../../common/Validation';
import InlineError from '../../common/InlineError';
import Header from '../../components/header/Header';
import {
  changePassword,
  editProfileAction,
  getProfileAction,
} from '../../_action/ProfileAction';
import {useDispatch, connect} from 'react-redux';
import {Loader} from '../../common/Loader';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import setting from '../../config/settings';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../modal/AlertModal';
import SuccessAlertModal from '../modal/SuccessAlertModal';
import CustomHeader from '../../components/header/CustomHeader';
import {ScrollView} from 'react-native-gesture-handler';

const hasNumber = myString => {
  return /\d/.test(myString);
};
const isValid = str => {
  return /[!@#$%^&*(),.?":{}|<>]/g.test(str);
};

let Profile = React.memo(function Profile(props) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [doubleValidateModal, setDoubleValidateModal] = useState(false);
  const [dataValidateModal, setDataValidateModal] = useState(false);
  const [isProfileUpdate, setProfileUpdate] = useState(false);
  const [userDate, setUserDate] = useState(new Date());
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      showDOB: '',
      email: '',
      profilePhoto: null,
      baseProfile: null,
      currentPassword: '',
      newPassword: '',
      currentPasswordError: '',
      newPasswordError: '',
      userProfile: [],
      disable: true,
      isLoader: false,
      commonError: '',
      mediaPath: '',
    },
  );
  let mediaPath = setting.s3Url.url;
  const Data = ['male', 'female'];
  const [hidePass, setHidePass] = useState(true);
  const [hideNewPass, setHideNewPass] = useState(true);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [profileImg, setProfileImg] = useState();

  const handlePasswordChange = e => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
      currentPasswordError: '',
      newPasswordError: '',
      commonError: '',
    });
  };

  useEffect(() => {
    if (props.getProfileData) {
      let {fname, lname, gender, dob, email} = props?.getProfileData;
      setUserInput({
        firstName: fname,
        lastName: lname,
        gender: gender,
        dob: dob,
        email: email,
      });
      if (props.getProfileData) {
        setUserInput({disable: true});
      }
    }
  }, []);

  useEffect(() => {
    focusInput();
    getProfileImage();
  }, []);

  // useEffect(() => {
  //   //let newDate = userInput.dob.substring(6, 10) +'-' + userInput.dob.substring(3, 5) + '-' + userInput.dob.substring(0, 2)
  //   //console.log("user input",userInput,"newDate",new Date(newDate))
  //   // setUserDate(new Date(newDate).toISOString())
  // }, [userInput]);

  // useEffect(() => {
  //   const onFocus = props.navigation.addListener('focus', () => {
  //     // alert("comess")
  //   });
  //   return onFocus;
  // }, [props]);

  function clearErrorMessage() {
    setProfileUpdate(false);
    setUserInput({
      commonError: '',
      newPasswordError: '',
      currentPasswordError: '',
    });
    props.navigation.openDrawer();
  }

  function focusInput() {
    setUserInput({disable: false});
  }
  function onSubmitPassword() {
    let {currentPassword, newPassword} = userInput;
    if (currentPassword === '') {
      setUserInput({currentPasswordError: Constants.CommonEmptyError});
    }
    if (currentPassword.length <= 5) {
      setUserInput({currentPasswordError: 'Have 6 characters minimum'});
    } else if (currentPassword.trim() === '') {
      setUserInput({currentPasswordError: 'Have 6 characters minimum'});
    } else if (!currentPassword.match(/[A-Z]/g)) {
      setUserInput({currentPasswordError: 'Include upper case letters'});
    } else if (!currentPassword.match(/[a-z]/g)) {
      setUserInput({currentPasswordError: 'Include lower case letters'});
    } else if (!hasNumber(currentPassword)) {
      setUserInput({currentPasswordError: 'Include one number'});
    } else if (!isValid(currentPassword)) {
      setUserInput({currentPasswordError: 'Include special character'});
    } else if (currentPassword.length < 0) {
      setUserInput({currentPasswordError: Constants.CommonEmptyError});
    } else if (!validatePassword(currentPassword).status) {
      setUserInput({currentPasswordError: Constants.Errors.PasswordError});
    } else if (newPassword === '') {
      setUserInput({newPasswordError: Constants.CommonEmptyError});
    }
    if (newPassword.length <= 5) {
      setUserInput({newPasswordError: 'Have 6 characters minimum'});
    } else if (newPassword.trim() === '') {
      setUserInput({newPasswordError: 'Have 6 characters minimum'});
    } else if (!newPassword.match(/[A-Z]/g)) {
      setUserInput({newPasswordError: 'Include upper case letters'});
    } else if (!newPassword.match(/[a-z]/g)) {
      setUserInput({newPasswordError: 'Include lower case letters'});
    } else if (!hasNumber(newPassword)) {
      setUserInput({newPasswordError: 'Include one number'});
    } else if (!isValid(newPassword)) {
      setUserInput({newPasswordError: 'Include special character'});
    } else if (newPassword.length < 0) {
      setUserInput({newPasswordError: Constants.CommonEmptyError});
    } else if (!validatePassword(newPassword).status) {
      setUserInput({newPasswordError: Constants.Errors.PasswordError});
    } else if (newPassword === currentPassword) {
      setUserInput({
        newPasswordError: 'Current Password should not be same as new password',
      });
    } else {
      let req = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };
      setUserInput({isLoader: true});
      dispatch(changePassword(req)).then(res => {
        if (res.data.statusCode === 1) {
          setUserInput({isLoader: false, currentPassword: '', newPassword: ''});
          alert('Password has been changed successfully');
        } else {
          setUserInput({
            isLoader: false,
            commonError: res.data.error.responseMessage,
          });
        }
      });
    }
  }

  function handleChoosePhoto() {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
        aspect: [4, 3],
        quality: 0.3,
      },
    };
    setUserInput({disable: false});
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('cancel user');
      } else {
        const source = {uri: response.assets[0]};
        let source_uri = {uri: response.assets[0].uri};
        setUserInput({profilePhoto: source});
        setUserInput({baseProfile: response});
        await AsyncStorage.setItem('Image', response.assets[0].uri);
      }
    });
  }

  const doubleCheckVerification = () => {
    setDataValidateModal(false);
    setDoubleValidateModal(true);
    onOkay();
  };

  const onEditConfirmation = () => {
    setDataValidateModal(true);
  };

  const onOkay = () => {
    setDoubleValidateModal(false);
    editUserProfile();
  };

  function editUserProfile() {
    let {firstName, lastName, gender, dob, profilePhoto, baseProfile} =
      userInput;
    if (!validateName(firstName).status) {
    } else {
      var data = new FormData();
      data.append('fname', firstName);
      data.append('lname', lastName);
      data.append('gender', gender);
      data.append('age', dob);
      {
        baseProfile !== null
          ? data.append('profileImage', {
              uri: baseProfile.assets[0].uri,
              type: profilePhoto.uri.type,
              name: profilePhoto.uri.fileName,
            })
          : data.append('profileImage', '');
      }

      if (baseProfile !== null) {
        setImageLoader(true);
        setLoader(false);
      } else {
        console.log('base profile of user', baseProfile);
        setLoader(true);
        setImageLoader(false);
      }

      dispatch(editProfileAction(data))
        .then(async res => {
          console.log(
            'profile update response',
            res,
            'res.data.statusCode',
            res.data.statusCode,
          );
          if (res.data.statusCode === 1) {
            setImageLoader(false);
            setUserInput({disable: true});
            dispatch(getProfileAction());
            setLoader(false);
            setUserInput({baseProfile: null});
            let img = await AsyncStorage.getItem('Image');
            setProfileImg(img);
            setProfileUpdate(true);
            //clearErrorMessage();
          } else {
            setLoader(false);
            setImageLoader(false);
            setUserInput({
              commonError: res.data.error.responseMessage,
            });
          }
        })
        .catch(err => {
          alert(err);
          setLoader(false);
        });
    }

    //clearErrorMessage();
  }

  async function getProfileImage() {
    let imgMeta = await AsyncStorage.getItem('Image');
    setProfileImg(imgMeta);
  }

  const onChanged = data => {
    let value = data;
    // value = value.replace(/[^A-Za-z]/gi, '');
    value = value.replace(/[^a-zA-ZşŞıİçÇöÖüÜĞğ\- ]/g, '');
    setUserInput({firstName: value});
  };
  const onChangedLastName = data => {
    let value = data;
    // value = value.replace(/[^A-Za-z]/gi, '');
    value = value.replace(/[^a-zA-ZşŞıİçÇöÖüÜĞğ\- ]/g, '');
    setUserInput({lastName: value});
  };
  const hideDatePicker = () => {
    setOpen(false);
  };
  const openDatePicker = () => {
    setOpen(true);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked1: ', date);
    console.log('A date has been picked22: ', new Date());
    // let dateee = convertUTC(date);
    // console.log("A date has been picked3: ", dateee);
    // let m = moment(dateee).format('DD-MM-YYYY');
    // console.log("A date has been moment: ", m);
    // setDOB(m)
    hideDatePicker();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      {/* {loader ? <Loader loading={true} /> : null} */}

      {/* <Header 
        title="Profile" 
        status="drawer" 
      /> */}
      <CustomHeader
        title="Profile"
        status="drawer"
        onPress={() => clearErrorMessage()}
      />
      <AlertModal
        alert={dataValidateModal}
        onResume={() => doubleCheckVerification()}
        headertitle="Profile"
        content={'Are you sure you want to update your details?'}
        cancel={() => setDataValidateModal(false)}
        cancelBtn="Close"
        saveBtn="Yes"
        width={100}
        opacity={'#000000cf'}
      />

      <SuccessAlertModal
        alert={isProfileUpdate}
        onResume={() => clearErrorMessage()}
        headertitle="Profile"
        content={'Profile was update successfully!'}
        cancel={() => setProfileUpdate(false)}
        cancelBtn="Close"
        saveBtn="Ok"
        width={100}
        opacity={'#000000cf'}
      />

      {/* <AlertModal alert={doubleValidateModal} onResume={() => onOkay()} headertitle="Profile" content={'Are you really sure you want to update your details?'} cancel={()=>setDoubleValidateModal(false)} cancelBtn="Cancel" saveBtn="Yes" width={100} opacity={'#000000cf'}/> */}
      <KeyboardAwareScrollView  keyboardShouldPersistTaps='handled'>
        {/* {userInput.isLoader && <Loader loading={userInput.isLoader} />} */}
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View>
          <View style={styles.userProfileContainer}>
            <View style={{alignItems: 'center'}}>
              <Pressable onPress={handleChoosePhoto}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '5%',
                  }}>
                  {userInput.baseProfile !== null ? (
                    <ImageBackground
                      source={{
                        uri:
                          userInput?.baseProfile?.assets[0]?.uri || profileImg,
                      }}
                      imageStyle={{
                        borderRadius: 232,
                        borderWidth: 1.5,
                        borderColor: COLORS.lightBlue,
                      }}
                      style={{
                        width: 120,
                        height: 120,
                      }}>
                      <View style={{paddingTop: '40%'}}>
                        <ActivityIndicator
                          animating={imageLoader}
                          size="large"
                          color="#0DB8DA"
                        />
                      </View>
                    </ImageBackground>
                  ) : props?.getProfileData?.profileImage == 'null' ? (
                    <Image
                      source={require('../../../assets/useric.png')}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 232,
                        borderWidth: 1.5,
                        borderColor: COLORS.lightBlue,
                      }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri:
                          profileImg ||
                          mediaPath + props?.getProfileData?.profileImage,
                      }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 232,
                        borderWidth: 1.5,
                        borderColor: COLORS.lightBlue,
                      }}
                    />
                  )}

                  <View
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: COLORS.lightBlue,
                      borderRadius: 20,
                      bottom: 25,
                      left: 30,
                    }}>
                    <View style={{alignSelf: 'center', top: 8}}>
                      <CameraIcon />
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
            {loader ? (
              <ActivityIndicator
                animating={loader}
                size="large"
                color="#0DB8DA"
              />
            ) : null}

            <View style={{paddingLeft: 12}}>
              <Text style={{fontSize: 16, color: COLORS.lightBlue}}>
                Personal information
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.title}>First name</Text>
              <TextInput
                placeholder="first name"
                placeholderTextColor="#E0E0E0"
                style={styles.input}
                name="firstName"
                value={userInput.firstName}
                onChangeText={firstName => onChanged(firstName)}
                onFocus={() => focusInput()}
                selectionColor={COLORS.blue}
              />
            </View>

            <View style={styles.form}>
              <Text style={styles.title}>Last name</Text>
              <TextInput
                placeholder="last name"
                placeholderTextColor="#E0E0E0"
                style={styles.input}
                name="lastName"
                value={userInput.lastName}
                onChangeText={lastName => onChangedLastName(lastName)}
                onFocus={() => focusInput()}
                selectionColor={COLORS.blue}
              />
            </View>
            <View style={styles.form}>
              <Text style={styles.title}>Gender</Text>
              <SelectDropdown
                data={Data}
                defaultButtonText={userInput.gender}
                onSelect={(selectedItem, index) => {
                  setUserInput({gender: selectedItem});
                }}
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
            </View>
            <View style={styles.form}>
              <Text style={[styles.title]}>Date of birth</Text>
              <Pressable
                onPress={() => setOpen(true)}
                style={{
                  padding: 10,
                  borderColor: COLORS.grey_6,
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: 'black'}}>{userInput.dob}</Text>
                <CalenderIcon />
              </Pressable>

              {Platform.OS === 'android' && (
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={userDate}
                  androidVariant="iosClone"
                  maximumDate={moment().subtract(16, 'years')._d}
                  minimumDate={new Date('1950-01-01')}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                    setUserInput({
                      dob: moment(date).format('DD.MM.YYYY'),
                      showDOB: moment(date).format('MM-DD-YYYY'),
                    });
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              )}

              {Platform.OS === 'ios' && (
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={
                    new Date(
                      userInput.dob.substring(6, 10) +
                        '-' +
                        userInput.dob.substring(3, 5) +
                        '-' +
                        userInput.dob.substring(0, 2),
                    )
                  }
                  androidVariant="iosClone"
                  maximumDate={moment().subtract(16, 'years')._d}
                  minimumDate={new Date('1980-01-01')}
                  onConfirm={date => {
                    setOpen(false);
                    setDate(date);
                    setUserInput({
                      dob: moment(date).format('DD.MM.YYYY'),
                      showDOB: moment(date).format('MM-DD-YYYY'),
                    });
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              )}
            </View>
            <View style={styles.form}>
              <Text style={styles.title}>Email</Text>
              <TextInput
                placeholder="email"
                placeholderTextColor="#E0E0E0"
                style={[styles.inputDisable, {textTransform: 'lowercase'}]}
                name="email"
                value={userInput.email}
                editable={false}
                onChangeText={email => setUserInput({email})}
              />
            </View>
            {userInput.firstName === '' || userInput.lastName === '' ? (
              <View
                style={{
                  backgroundColor: COLORS.grey_6,
                  borderRadius: 30,
                  width: '95%',
                  height: 50,
                  marginTop: 20,
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: 335,
                    height: 53,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  disable={true}>
                  <Text
                    style={{
                      color: COLORS.grey_4,
                      fontFamily: 'Manrope-Bold',
                      textAlign: 'center',
                      fontSize: 15,
                      paddingTop: 0,
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <AppButton title="Save" onPress={onEditConfirmation} />
            )}
            <View style={styles.boxInput}>
              <View style={{paddingLeft: 12, top: 15}}>
                <Text style={{fontSize: 16, color: COLORS.lightBlue}}>
                  Change the password
                </Text>
              </View>
              <View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 20}}>
                <Text style={styles.title}>Current Password</Text>
              </View>
              <View style={styles.textBoxBtnHolder}>
                <TextInput
                  underlineColorAndroid="transparent"
                  secureTextEntry={hidePass ? true : false}
                  placeholder="Enter current password"
                  placeholderTextColor="#E0E0E0"
                  style={styles.textBox}
                  value={userInput.currentPassword}
                  onChangeText={value => setUserInput({currentPassword: value})}
                  name="currentPassword"
                  onChange={handlePasswordChange}
                  selectionColor={COLORS.blue}
                />
                <TouchableOpacity
                  style={styles.visibilityBtn}
                  onPress={() => setHidePass(!hidePass)}>
                  {hidePass ? <ChangePassIcon /> : <PassEyeIcon />}
                </TouchableOpacity>
                <InlineError errorMessage={userInput.currentPasswordError} />
                <InlineError errorMessage={userInput.commonError} />
              </View>

              <View style={{paddingLeft: 12, paddingRight: 12}}>
                <Text style={styles.title}>New Password</Text>
              </View>
              <View style={styles.textBoxBtnHolder}>
                <TextInput
                  underlineColorAndroid="transparent"
                  secureTextEntry={hideNewPass ? true : false}
                  placeholder="Enter new password"
                  placeholderTextColor="#E0E0E0"
                  style={styles.textBox}
                  value={userInput.newPassword}
                  onChangeText={value => setUserInput({newPassword: value})}
                  name="newPassword"
                  onChange={handlePasswordChange}
                  selectionColor={COLORS.blue}
                />
                <TouchableOpacity
                  style={styles.visibilityNewBtn}
                  onPress={() => setHideNewPass(!hideNewPass)}>
                  {hideNewPass ? <ChangePassIcon /> : <PassEyeIcon />}
                </TouchableOpacity>
                <InlineError errorMessage={userInput.newPasswordError} />
                {/* <InlineError errorMessage={userInput.commonError} /> */}
              </View>
              <View style={{bottom: '10%'}}>
                <AppButton
                  title="Save new password"
                  onPress={onSubmitPassword}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  userProfileContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  form: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
  },
  passwordInput: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 14,
  },
  title: {
    color: COLORS.lightGrey,
    paddingBottom: 5,
    fontSize: 15,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
    borderRadius: 4,
    paddingLeft: 10,
    fontSize: 15,
    textTransform: 'capitalize',
    color: COLORS.black,
  },
  inputDisable: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
    borderRadius: 4,
    paddingLeft: 10,
    fontSize: 15,
    textTransform: 'capitalize',
    color: COLORS.grey,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    top: 6,
    borderColor: COLORS.grey_6,
  },
  dropdown1BtnTxtStyle: {
    color: '#000',
    textAlign: 'left',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  dropdown1DropdownStyle: {
    backgroundColor: '#EFEFEF',
    textTransform: 'capitalize',
  },
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#706f6f',
    textTransform: 'capitalize',
  },
  dropdown1RowTxtStyle: {
    color: '#4d4c4c',
    textAlign: 'left',
    textTransform: 'capitalize',
    fontSize: 15,
  },
  textBoxBtnHolder: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  textBox: {
    fontSize: 15,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
    borderRadius: 4,
    paddingLeft: 10,
  },
  visibilityBtn: {
    position: 'absolute',
    right: 15,
    top:14,
    // height: 40,
    width: 35,
    // padding: 4,
  },
  visibilityNewBtn: {
    position: 'absolute',
    right: 15,
    top:14,
    // height: 40,
    width: 35,
    // paddingBottom: 55,
  },
  calenderIcon: {
    position: 'absolute',
    right: 15,
    height: 40,
    width: 35,
    paddingTop: 10,
  },
  btnImage: {resizeMode: 'contain', height: '100%', width: '100%'},
  boxInput: {
    paddingBottom: 30,
    textTransform: 'capitalize',
  },
});

const mapStateToProps = state => {
  return {
    getProfileData:
      state?.profileReducer?.profile?.data?.responseData?.userProfile,
  };
};
export default connect(mapStateToProps)(Profile);
