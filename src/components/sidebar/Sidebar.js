import React, { useReducer, useEffect, useRef, useState } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Icon,
  Body,
  Title,
  Right,
  Button,
} from 'native-base';
import { COLORS, DeviceScreen } from '../../common/Constant';
import {
  ContactDrawerIcon,
  FitbitDeviceIcon,
  HelpIcon,
  MembershipIcon,
  NotificationIcon,
  PrivacyPolicyIcon,
  ProfileIcon,
  QuestionnaireIcon,
  SmallArrowIcon,
  DeleteIconTeal,
  UnitIcon,
  CrossIcon,
  DropdownIcon
} from '../../Svg';

import { useDispatch, connect } from 'react-redux';
import { getProfileAction } from '../../_action/ProfileAction';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  logoutAction,
  signupTypes,
  deleteUserAction,
} from '../../_action/AuthAction';
import { useFocusEffect } from '@react-navigation/native';
import setting from '../../config/settings';
import { Stats } from '../../screens/statics/Stats';
import { getQuestionnaireAction } from '../../_action/QuestionnaireAction';
import { useIsFocused } from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';
import AlertModal from '../../screens/modal/AlertModal';
import RBSheet from "react-native-raw-bottom-sheet"
import GradientButton from '../../components/GradientButton';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

function ListItem(props) {
  const dispatch = useDispatch();
  const [selectedUnit, setSelectedUnit] = useState()
  const RBSheetRef = useRef()
  const userDeleteAccount = async () => {
    let token = await AsyncStorage.getItem('nToken');
    let req = {
      deviceToken: token,
    };

    dispatch(deleteUserAction(req));
  };
useEffect(async() => {
  const unitt = await AsyncStorage.getItem("selectedUnit")
  console.log({unitt});
  if(unitt){
    setSelectedUnit(JSON.parse(unitt))
  }
}, [])

  const handleRoutes = () => {
    if (props.route === 'DeleteAccount') {
      Alert.alert(
        'Delete Account',
        'Deleting your account will mean all your data will be loss. Are you sure you want to delete your account?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => userDeleteAccount() },
        ],
        {
          cancelable: false,
        },
      );
    } else if (props.route === 'Unit') {
      RBSheetRef.current?.open()
    }
    else {
      props.navigation.navigate(props.route, { filter: 'drawer' });
    }
  };
  const onChangeUnit =async (unit) => {
await AsyncStorage.setItem("selectedUnit",JSON.stringify(unit))
setSelectedUnit(unit)
  }
  return (
    <View style={{ paddingRight: 10, paddingLeft: 10, margin: 3 }}>
      <TouchableOpacity onPress={() => handleRoutes()}>
        <View
          style={{
            backgroundColor: '#F9F9F9',
            width: '100%',
            height: 53,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.drawerTitle}>
            {props.route == 'Profile' ? <ProfileIcon /> : <></>}
            {props.route == 'Unit' ? <UnitIcon /> : <></>}
            {props.route == 'Membership' ? <MembershipIcon /> : <></>}
            {/* {props.route == 'Lift' ? <MembershipIcon /> : <></>} */}
            {props.route == 'Notification' ? <NotificationIcon /> : <></>}
            {props.route == 'Questionnaire' ? <QuestionnaireIcon /> : <></>}
            {props.route == 'FitbitConnectivity' ? <FitbitDeviceIcon /> : <></>}
            {props.route == 'help' ? <HelpIcon /> : <></>}
            {props.route == 'Contact' ? <ContactDrawerIcon /> : <></>}
            {props.route == 'PrivacyPolicy' ? <PrivacyPolicyIcon /> : <></>}
            {props.route == 'DeleteAccount' ? <DeleteIconTeal /> : <></>}
            <Text style={styles.sidebarTitle}>{props.title}</Text>
          </View>
          {props.route != 'DeleteAccount' && (
            <View style={{ padding: 18 }}>
              <SmallArrowIcon />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <RBSheet
        ref={RBSheetRef}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            backgroundColor: "#F9F9F9"
            // justifyContent: "center",
            // alignItems: "center"
          }
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 30, marginTop: 15, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#4F4F4F", fontWeight: "700", }}>
            Select Your Units
          </Text>
          <TouchableOpacity onPress={() => RBSheetRef.current?.close()}>
            <CrossIcon />
          </TouchableOpacity>



        </View>
        <View>
          <View style={{marginVertical:20}}>
            <SelectDropdown
              data={['KG', 'LBS']}
              defaultValueByIndex={0}
              defaultValue={selectedUnit|| ''}
              onSelect={(selectedItem, index) => {
                // setUserInput({weightUnit: selectedItem, weightError: ''});
                onChangeUnit(selectedItem)
              }}
              defaultButtonText={selectedUnit|| "kg / lbs"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{ width: "90%", marginHorizontal: "5%", backgroundColor: "#fff",borderWidth:1,borderColor:"#F2F2F2",borderRadius:3 }}
              buttonTextStyle={[

                { textTransform: 'uppercase', textAlign: "left", backgroundColor: "blue" },
              ]}
              renderDropdownIcon={() => {
                return <DropdownIcon />;
              }}
              dropdownIconPosition={'right'}
              // dropdownStyle={{ backgroundColor: "red" }}
              // rowStyle={{ backgroundColor: "blue" }}

              rowTextStyle={[

                { textTransform: 'uppercase', },
              ]}
            />
          </View>
        </View>
        <GradientButton title="Save " onPress={()=>{
           showMessage({
            message: 'Message',
            description: 'Unit Set Successfully.',
            type: 'default',
            backgroundColor: COLORS.lightGreen,
            color: COLORS.white,
          });
          RBSheetRef?.current?.close()
        }
        
        } />
      </RBSheet>
    </View>
  );
}

let Sidebar = React.memo(function Sidebar(props) {
  const navigation = props.navigation;
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      userProfile: [],
      dailyStepsData: 0,
      questionnaireData: '',
      googleDailyStep: 0,
      dailySteps: 0,
    },
  );
  const [profileImage, setProfileImage] = useState();
  const [logoutModal, setLogoutModal] = useState({
    header: '',
    content: '',
  });
  const { header, content } = logoutModal;
  const isFocused = useIsFocused();
  var currentTime = new Date();
  var year = currentTime.getFullYear();
  let mediaPath = setting.s3Url.url;

  useEffect(() => {
    userToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getImage();

      window.profileLocation = getImage();
    }, [profileImage, userInput.dailySteps, isFocused]),
  );

  const userToken = async () => {
    let token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common['AccessToken'] = token;
    getProfile();
    getQuestionnaireData();
  };

  async function getImage() {
    const image = await AsyncStorage.getItem('Image');
    setProfileImage(image);
  }
  function getProfile() {
    dispatch(getProfileAction());
  }
  function getQuestionnaireData() {
    dispatch(getQuestionnaireAction());
  }

  const onLogout = async () => {
    let uniqueId = DeviceInfo.getUniqueId();
    let token = await AsyncStorage.getItem('nToken');
    AsyncStorage.removeItem("accessToken");
    let req = {
      deviceToken: token,
      deviceId: uniqueId,
    };

    dispatch(logoutAction(req));
  };

  return (
    <Container>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header
        androidStatusBarColor="#fff"
        iosBarStyle="dark-content"
        style={{ backgroundColor: COLORS.white, height: 50 }}>
        <Stats
          dailySteps={userInput.dailySteps }
          googleDailyStep={userInput.googleDailyStep}
          setUserInput={setUserInput}
          isFocused={props.getProfileData}
        />
        <Left style={{ flex: 1 }}>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <Icon name="close" style={styles.icon} />
          </Pressable>
        </Left>

        <Body style={{ flex: 1 }}>
          <Title style={styles.title}>Menu</Title>
        </Body>
        <Right style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() =>
              setLogoutModal({
                header: 'Logout',
                content: 'Are you sure, you want to logout',
              })
            }>
            <Title style={{ color: COLORS.lightBlue }}>Log out</Title>
          </TouchableOpacity>
        </Right>
      </Header>
      <Content>
        <View style={{ flexDirection: 'row', padding: 20 }}>
          <View
            style={{
              borderRadius: 50,
            }}>
            {props?.getProfileData?.profileImage == 'null' ? (
              <Image
                source={require('../../../assets/useric.png')}
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 2.5,
                  borderRadius: 50,
                  borderColor: COLORS.lightBlue,
                }}
              />
            ) : (
              <Image
                source={{ uri: mediaPath + props?.getProfileData?.profileImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 2.5,
                  borderRadius: 50,
                  borderColor: COLORS.lightBlue,
                }}
              />
            )}
          </View>
          <View style={{ padding: 14, top: 5 }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 20,
                color: COLORS.grey_2,
                fontWeight: '700',
                fontFamily: 'Manrope',
                textTransform: 'capitalize',
              }}>
              {props?.getProfileData != undefined
                ? props?.getProfileData?.fullName
                : ''}
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 20,
                color: COLORS.grey_3,
                fontWeight: '400',
                fontFamily: 'Manrope',
              }}>
              Journey : {props?.getQuestionnaireData?.goal}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  fontFamily: 'Manrope',
                  lineHeight: 20,
                  color: COLORS.grey_3,
                }}>
                Steps :{' '}
                {Platform.OS == 'ios'
                  ? userInput.dailySteps !== undefined
                    ? userInput.dailySteps?.toFixed(0)
                    : userInput.dailySteps
                  : userInput!= null && userInput?.googleDailyStep !== undefined
                    ? userInput?.googleDailyStep?.toFixed(0)|| 0
                    : userInput?.googleDailyStep || 0}
              </Text>
              {/* <Text style={{left: 12, fontSize: 15,fontWeight:"400",fontFamily:"Manrope",lineHeight:20, color: COLORS.grey_3}}>
                Day : 16
              </Text> */}
            </View>
          </View>
        </View>

        {/*Drawer List Item*/}
        <ListItem title={'Profile'} route={'Profile'} {...props} />
        <ListItem title={'Membership'} route={'Membership'} {...props} />
        {/* <ListItem title={'Lift History'} route={'Lift'} {...props} /> */}
        <ListItem title={'Notifications'} route={'Notification'} {...props} />
        <ListItem title={'Unit'} route={'Unit'} {...props} />
        <ListItem title={'Questionnaire'} route={'Questionnaire'} {...props} />
        <ListItem
          title={'Fitbit device connectivity'}
          route={'FitbitConnectivity'}
          {...props}
        />
        <ListItem title={'Help'} route={'help'} {...props} />
        <ListItem title={'Contact'} route={'Contact'} {...props} />
        <ListItem title={'Privacy Policy'} route={'PrivacyPolicy'} {...props} />
        <ListItem title={'Delete Account'} route={'DeleteAccount'} {...props} />

        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: COLORS.grey_3,
              fontFamily: 'Manrope',
            }}>
            Copyright © Fitnessvwork {year}
          </Text>
        </View>
      </Content>
      <AlertModal
        alert={logoutModal.header ? true : false}
        onResume={() => {
          // customizedAlertModal.onConfirm();
          // onCancelCustomizedAlert();

          onLogout();
        }}
        headertitle={logoutModal.header}
        content={logoutModal.content}
        cancel={() => setLogoutModal({ header: '', content: '' })}
        cancelBtn={'Cancel'}
        saveBtn={'Log out'}
        width={100}
        opacity={''}
      />

    </Container>
  );
});

const styles = StyleSheet.create({
  icon: {
    color: COLORS.black,
  },
  title: {
    color: COLORS.black,
    alignSelf: 'center',
  },
  drawerContainer: {
    width: DeviceScreen.width,
  },
  sidebarTitle: {
    left: 10,
    fontSize: 16,
    lineHeight: 16,
    color: COLORS.grey_2,
    fontFamily: 'Manrope',
    fontWeight: '500',
    marginTop: 3,
  },
  drawerTitle: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    getProfileData:
      state?.profileReducer?.profile?.data?.responseData?.userProfile,
    getQuestionnaireData:
      state?.questReducer?.QuestionnaireData?.data?.responseData?.result,
  };
};
export default connect(mapStateToProps)(Sidebar);

// export default Sidebar;
