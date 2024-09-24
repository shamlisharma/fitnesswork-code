import React, {useEffect, useReducer, useState,useRef} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  AppState,
  Platform
} from 'react-native';
import {CommonActions, StackActions,NavigationAction, useNavigation} from '@react-navigation/native';
import {getProfileAction} from '../../_action/ProfileAction';
import {authAction, logoutAction} from '../../../src/_action/AuthAction';
import ExpiredModal from '../home/Modal';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  AppButton,
  COLORS,
  Constants,
  DeviceScreen,
  SignupStepsNum,
} from '../../common/Constant';
import {useFocusEffect} from '@react-navigation/native';
import {Loader} from '../../common/Loader';
import {Screen} from '../../common/Screen';
import { Fab } from 'native-base';
import { iapAction } from '../../_action/InappPurchaseAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNIap from 'react-native-iap'
import { usersService } from '../../services/ApiServices';
  var count = 0;
function NoPermission(props) {
      let dispatch = useDispatch();
      const navigation= useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const [loader, setLoader] = useState(true);
   const getProfileData = useSelector(
     state => state?.profileReducer?.profile?.data?.responseData,
   );
   const timerRef = useRef(null);
   const appState = useRef(AppState.currentState);
   const [appStateVisible, setAppStateVisible] = useState(appState.current);
   useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState 1', appState.current);
    });

    // return () => {
    //   subscription.remove();
    // };
  }, []);
   useEffect(
     () => {
      console.log("i am start")
   timerRef.current = setTimeout(() => {
     if (loader == true) {
      setLoader(false)
       Alert.alert(
         "You've been logged out",
         "Session expired. Please log in again",
         [
           {
             text: 'OK',
             onPress: () => {
              setLoader(false)
              dispatch(logoutAction())
            },
           },
         ],
         {
           cancelable: false,
         },
       );
       dispatch(logoutAction());
      
     }
   }, 15000);

       // this will clear Timeout
       // when component unmount like in willComponentUnmount
       // and show will not change to true
       return () => {
        console.log("i am done")
        setLoader(false)
         clearTimeout(timerRef);
       };
     },
     // useEffect will run only one time with empty []
     // if you pass a value to array,
     // like this - [data]
     // than clearTimeout will run every time
     // this value changes (useEffect re-run)
     [],
   );

   useEffect(()=>{
        dispatch(getProfileAction());
        async function fetchToken (){
          const value  = await AsyncStorage.getItem("accessToken");
     
          if(value!=null){
            // getAvailable();
          }
      }
  
      fetchToken();
   },[])

   

  const validateAndroidReceipt = async (res) => {
    usersService
      .validatePayment(res[0].productId, res[0].purchaseToken)
      .then((res) => {

        console.log(res.data.statusCode === 1, "NEW_API_RESULT")
        if(res.data.statusCode === 1){
          setLoader(false)
         console.log("SUCCESS")
         navigation.reset({
        index:0,
        routes:[{name: 'Tabs'}]
      })
        }
        else {
          console.log("'FAILURE")
          // setShowModal(true)
          // upgradePlan()
          downgradeToFreeUser()
        }
      })
      .catch((err) => {
        console.log("API_ERROR", err)
        setLoader(false)
      });
  };

  const validateIOSReceipt = async (transactionReceipt) => {
    const receiptBody = {
      "receipt-data": transactionReceipt,
      password: "c589d4eb53334fd2a44574ed2b907cf9", // app shared secret, can be found in App Store Connect
    };
    const result = await RNIap.validateReceiptIos(receiptBody, false);
    console.log(count,"TOTAL_API_RESPONSE_TIME");
    if(result.status === 0 || result.status === 21007){
      setLoader(false)
      navigation.reset({
        index:0,
        routes:[{name: 'Tabs'}]
      })
    }else{
      downgradeToFreeUser()
    }
 

    // 
  };


  const getAvailable = async () => {
    setLoader(true)
    RNIap.initConnection()
      .then(() => {
        RNIap.getAvailablePurchases()
          .then((res) => {
            console.log("NEW_RESULT_FOUND", res);
         if(res.length > 0){
          if (Platform.OS == "android") {
            validateAndroidReceipt(res);
          } else {
            validateIOSReceipt(res[0].transactionReceipt);
          }
         }
         else{
          // setShowModal(true)
          // upgradePlan()
          downgradeToFreeUser()
         }
          })
          .catch((err) => {
            console.log("AVAILABLE_ERROR", err);
            setLoader(false)
            dispatch(logoutAction())
           
          });
      })
      .catch((err) => {
        setLoader(false)
        console.log("INIT_ERROR", err);
      });
  };

  
  const  checkValidateion=(date_)=>{
    var GivenDate = date_;
    var CurrentDate = new Date();
GivenDate = new Date(GivenDate);

if(GivenDate > CurrentDate){
   return true
}else{
    return false;
}
   }
   
   useEffect(() => {
    // console.log({getProfileData});
   if (getProfileData){
  clearTimeout(timerRef.current);
    //  setTimeout(() => {
       setLoader(false);
       if (
         getProfileData?.userProfile.isActivePaidUser ||
         checkValidateion(getProfileData?.userProfile.subscriptionEnd)
       ) {
         setShowModal(false);
         //props.navigation.navigate('Tabs');
        //  props.navigation.dispatch(StackActions.replace('Tabs', {params: {}}));
      
        // getAvailable();
      navigation.reset({
        index:0,
        routes:[{name: 'Tabs'}]
      })
        //  props.navigation.reset({
        //    index: 0,
        //    routes: [{name: 'Tabs'}],
        //  });
       } else if (getProfileData?.userProfile.planName == 'Free') {
        navigation.reset({
          index:0,
          routes:[{name: 'Tabs'}]
        })
         setShowModal(true);
       } else {
         console.log('dasasdasdas', getProfileData?.userProfile.planName);
           console.log(
             'dasasdasdas',
             getProfileData?.userProfile.isActivePaidUser,
           );
             console.log(
               'dasasdasdas',
               getProfileData?.userProfile.subscriptionEnd,
             );
         setShowModal(true);
       }
    //  }, 4000);
   }
   }, [getProfileData]);
     //    useFocusEffect(
     //      React.useCallback(() => {
     //         console.log("oneeee1")
     //         if (getProfileData?.userProfile){
     //    if (getProfileData?.userProfile.isActivePaidUser == true) {
     //      console.log('oneeee2');
     //      setShowModal(false);
     //      props.navigation.navigate('Tabs');
     //    } else {
     //      console.log('oneeee3');
     //      setShowModal(true);
     //    }
     //         }else{
     //   console.log('oneeee4');

     //           setTimeout(() => {
     //             if (getProfileData?.userProfile.isActivePaidUser == true) {
     //               console.log('oneeee4');
     //               setShowModal(false);
     //               props.navigation.navigate('Tabs');
     //             } else {
     //              console.log('oneeee5', getProfileData);
     //               setShowModal(true);
     //             }
     //           }, 6000);
     //         }

     //        return () => {

     //        };
     //      }, []),
     //    );

     useEffect(() => {
      
       if(getProfileData!= null){
        AsyncStorage.setItem('user_id',getProfileData.userProfile._id+"")
        console.log('asasd', getProfileData.userProfile);
       }
     }, [getProfileData]);

     const downgradeToFreeUser = planId => {
      let req = {
        userId: getProfileData?.userProfile?._id,
        iap_prod_id: "0",
        planId: '6309da0e7de542001b93a996',//"6309dadbc2dacd0014060335", //'6309da0e7de542001b93a996',
        transactionId: "downgrade",
        startDate: new Date(),
        endDate: new Date(),
        isPremium: 0,
      };
   // console.log("downgrade to fre");
      dispatch(iapAction(req))
        .then(res => {console.log("res from downgrade",res);
          if (res.data.statusCode === 1) {
            dispatch(getProfileAction());
            props.navigation.navigate('No Permission');
          }
        })
        .catch(err => {
         console.log("in downgrade error",{err});
         //  alert(err);
         // props.navigation.navigate('No Permission');
          props.setLoader(false);
        });
    };
   
     const upgradePlan = planId => {
      let req = {
        userId: getProfileData?.userProfile?._id,
        iap_prod_id: "0",
        planId: '6309dadbc2dacd0014060335',
        transactionId: "free plan",
        startDate: new Date(),
        endDate: new Date(),
        isPremium: 0,
      };
   console.log("downgrade to fre",getProfileData);
      dispatch(iapAction(req))
        .then(res => {console.log("res from downgrade",res);
          if (res.data.statusCode === 1) {
        
            dispatch(getProfileAction());
            props.navigation.navigate('No Permission');
            // setShowModal(true)
          }
          else{
            props.navigation.navigate("Login")
          }
        })
        .catch(err => {
         console.log("in downgrade error",{err});
         //  alert(err);
         // props.navigation.navigate('No Permission');
          props.setLoader(false);
        });
    };
         const validReceiotCallback = () => {
          props.navigation.navigate('Membership');
          setShowModal(false)
          setLoader(false)
        
           if (!getProfileData?.userProfile?.downgraded) {
            //  Alert.alert(
            //    'Alert',
            //    'Please contact administrator to upgrade your membership!',
            //    [
            //      {
            //        text: 'Close',
            //        onPress: () => console.log('Cancel Pressed'),
            //        style: 'cancel',
            //      },
            //      // {text: 'Close', onPress: () => onChallange()},
            //    ],
            //    {
            //      cancelable: false,
            //    },ß
            //  );
            upgradePlan()
           } else {
            setShowModal(false)
            setLoader(false)
            props.navigation.navigate('Membership',{fromExpireModal:true});
            
             // setreceiptValid(true);
           }
         };
         console.log('zeela', showModal);
  return (
    <View>
      <ImageBackground
        source={require('../../../assets/launch_screen.png')}
        style={{width: DeviceScreen.width, height: '100%'}}>
        {loader ? <Loader loading={loader} />:
        <>
          {/* {showModal==true && (
            <ExpiredModal
              onClick={validReceiotCallback}
              isDowngrade={getProfileData?.userProfile?.downgraded}
              type={getProfileData?.userProfile.planName == 'Free'?"Free": getProfileData?.planName}
            />
          )} */}
        </>
}
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  textCentre: {
    textAlign: 'center',

    color: 'white',
    padding: 10,
  },
  flexView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default NoPermission;
