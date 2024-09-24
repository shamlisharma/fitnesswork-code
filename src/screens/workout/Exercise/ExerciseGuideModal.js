import React from 'react';
import {
  Linking,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS} from '../../../common/Constant';
import CustomModal from '../../../components/CustomModal';


let FoodInfoModel = React.memo(function FoodInfoModel(props) {
  const {visible, close} = props;
  const navigation = useNavigation();
  return (
    <CustomModal
      visible={visible}
      onRequestClose={close}
      modalTitle={'What weight should I be lifting?'}>
      <View style={{padding: 10}}>
        <Text style={{fontFamily: 'Manrope-regular', marginBottom: 5}}>
          Find a weight where the last 3 reps feel progessively challenging, but
          not impossible to complete across each set. If it's too easy,then
          increase the weight slightly. Too hard- then reduce the weight.
        </Text>
        <Text style={{fontFamily: 'Manrope-regular', marginVertical: 5}}>
          I have made a video on this{'  '}
          <Text
            style={{
              color: 'green',
              textDecorationLine: 'underline',
              color: COLORS.lightGreen,
            }}
            onPress={() => {
              navigation.navigate('CommunityTab');
                setTimeout(() => {
                  navigation.navigate('Learn')
                },500)
                close();
            }}
            >
            check it out
          </Text>
        </Text>
        <Text style={{fontFamily: 'Manrope-regular', marginVertical: 5}}>
          You can also find replacement exercises {' '}
          <Text
            style={{
              color: 'green',
              textDecorationLine: 'underline',
              color: COLORS.lightGreen,
            }}
            onPress={() => Linking.openURL("https://fitnessvwork.com/exercise-library/")}
            >
            here
          </Text>
        </Text>
      </View>
    </CustomModal>
  );
});

const styles = StyleSheet.create({});
export default FoodInfoModel;
