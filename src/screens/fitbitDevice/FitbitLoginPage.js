import React, {useEffect, useReducer, useState, useRef} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import Header from '../../components/header/Header';
import {DeviceScreen} from '../../common/Constant';
import {useDispatch} from 'react-redux';
import {fitbitInfoAction} from '../../_action/FitnessAction';


let FitbitLoginPage = React.memo(function FitbitLoginPage(props) {
  let dispatch = useDispatch();

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      code: '',
      errorMessage: '',
    },
  );
  const [loader, setLoader] = useState(false);

  const handleWebViewNavigationStateChange = newNavState => {
    if (newNavState.url != ' ') {
      let authCodeUrl = newNavState.url;
      const urlRegex = /(https:\/\/[^\s]+)/g;
     
      if (!authCodeUrl.match(urlRegex)) {
        var data1 = authCodeUrl.split('http://localhost');
        
        var data = data1[1].split('/?code');
        var data2 = data[1].split(/[#,_,=]/);
        console.log("fitbit info params authcode",data2)
        var authCode = data2[1];

        if (authCode !== '' && newNavState.loader == false) {
          setUserInput({code: authCode});
        }
        if (authCodeUrl !== '') {
          setLoader(true);
          props.navigation.navigate('FitbitConnectivity');
        }

        if (authCode != '' && authCode !== undefined) {
          let req = {
            code: authCode,
            auth_code: 'MjM4VjQ3OjQxZjEzMDBhZjgzMmJkNGYwZWJiNjcyNzdhYjU4YTQ2',
            
          };

          console.log("fitbit info params",req)
         
          dispatch(fitbitInfoAction(req))
            .then(res => {
              console.log("fitbit info params res",res)
              if (res.data.statusCode === 1) {
                alert(res.data.responseData.message);
                setLoader(false);
              } else {
                setLoader(false);
                setUserInput({errorMessage: res.data.error.responseMessage});
              }
            })
            .catch(err => {
              alert(err);
              setLoader(false);
            });
        }
      }
    }
  };

  console.log("props.route.params.url",props.route.params.url)

  return (
    <View style={{flex: 1}}>
      <Header title="Fitbit" />

      {userInput.errorMessage ? (
        alert(userInput.errorMessage)
      ) : (
        <WebView
          source={{uri: props.route.params.url}}
          style={{flex: 1, width: DeviceScreen.width}}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />
      )}
    </View>
  );
});

export default FitbitLoginPage;
