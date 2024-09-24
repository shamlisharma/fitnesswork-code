import React from 'react';
import {
  Linking,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS} from '../../../common/Constant';
import CustomModal from '../../../components/CustomModal';


let WarmUpGuideModal = React.memo(function WarmUpGuideModal(props) {
  const {visible, close} = props;
  const navigation = useNavigation();
  var time = Platform.OS == "ios" ? 500 : 2000;
  return (
    <CustomModal
      visible={visible}
      onRequestClose={close}
      modalTitle={'Warm Up'}>
      <View style={{padding: 10}}>
        <Text style={{fontFamily: 'Manrope-regular', marginBottom: 5}}>
          Complete 3-5 mins of cardio on any cardio machine or light jog on the spot. You should be at 60-70% effort when completing this. Then complete 1-3 sets of your first exercise shown on this screen without weights or very light weight.
        </Text>
        <Text style={{fontFamily: 'Manrope-regular', marginVertical: 5}}>
        Once you’ve done this, you are good to start your first set 💪🏾
          
        </Text>
        <Text style={{fontFamily: 'Manrope-regular', marginVertical: 5}}>
        More about warming up {' '}
          <Text
            style={{
              color: 'green',
              textDecorationLine: 'underline',
              color: COLORS.lightGreen,
            }}
            onPress={() => {
              close();
             
              navigation.navigate('CommunityTab');
              setTimeout(() => {
                navigation.navigate('Learn',{isWarmUp :true})
              },time)
            }}
            >
            here
          </Text>
        </Text>
      </View>
    </CustomModal>
  );
});

const styles = StyleSheet.create({});
export default WarmUpGuideModal;
