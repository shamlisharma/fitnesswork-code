import React, {useReducer, useEffect} from 'react';
import {
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/header/Header';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../common/Constant';
import {useDispatch, connect} from 'react-redux';
import {getActivityAction} from '../../_action/FitnessAction';

let FitbitConnectivity = React.memo(function FitbitConnectivity(props) {
  let dispatch = useDispatch();
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      userfitnessInfo: '',
    },
  );

  let code = '';
  const navigation = useNavigation();
  let clientID = '238V47';   //   Client id:238V47   23BD3S


  let redirectURL = 'http://localhost';
  let defaultScope =
    'sleep+settings+nutrition+activity+social+heartrate+profile+weight+location';
  let url =
    'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=' +
    clientID +
    '&redirect_uri=' +
    redirectURL +
    '&scope=' +
    defaultScope +
    '&expires_in=3153600';

  useEffect(() => {
    getActivityinfo();
  }, []);

  function getActivityinfo() {
    let req = {
      deviceId: 1,
      day: '1',
    };
    dispatch(getActivityAction(req)).then(res => {
      if (res.data.statusCode === 1) {
     
        setUserInput({userfitnessInfo: res.data.responseData.result});
      } else {
      }
    });
  }
  
  return (
    <>
      <Header 
        title="Fitbit connectivity" 
        status="drawer" 
      />
      <SafeAreaView
        style={{flex: 1, padding: 15, backgroundColor: COLORS.white}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View
          style={{
            backgroundColor: COLORS.light_grey,
            padding: 15,
            marginTop: 10,
          }}>
          <Text>My devices</Text>
        </View>
        {userInput?.userfitnessInfo ? (
          <View
            style={{
              backgroundColor: COLORS.light_grey,
              padding: 15,
              marginTop: 5,
            }}>
            <Text style={{color: COLORS.black}}>Fitbit user</Text>
            <Text style={{color: COLORS.grey_3}}>
              {userInput?.userfitnessInfo?.fullName}
            </Text>
          </View>
        ) : (
          <></>
        )}
        <>
          {userInput?.userfitnessInfo?.fullName ? (
            <></>
          ) : (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('FitbitLoginPage', {
                    url: url,
                    code: code,
                  })
                }
                style={{marginTop: 5}}>
                <View style={{backgroundColor: COLORS.light_grey, padding: 15}}>
                  <Text style={{color: COLORS.lightBlue, textAlign: 'center'}}>
                    Add fitbit device
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </>
      </SafeAreaView>
    </>
  );
})
const mapStateToProps = state => {
  return {
    getFitbitData: state?.fitbitReducer?.data
      ? state?.fitbitReducer?.data?.responseData
      : state?.fitbitReducer,
  };
};
export default connect(mapStateToProps)(FitbitConnectivity);
// export default FitbitConnectivity;
