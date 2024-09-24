import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DeviceScreen} from '../../common/Constant';

let SplashScreen = React.memo(function SplashScreen() {
  const [isVisible, setVisible] = useState(true);

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(function () {
      setVisible(false);
    }, 10000);
    navigation.navigate('SignIn');
  }, []);

  return (
    <SafeAreaView>
      <View style={{flex: 1}}>
        <Image
          source={require('../../../assets/splash.png')}
          style={{
            width: DeviceScreen.width,
            height: DeviceScreen.height,
          }}
          resizeMode={'cover'}
        />
      </View>
    </SafeAreaView>
  );
})

export default SplashScreen;
