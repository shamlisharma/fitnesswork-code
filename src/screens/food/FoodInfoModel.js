import React from 'react';
import {Linking, Platform, Pressable, Text, View, StyleSheet} from 'react-native';
import { COLORS } from '../../common/Constant';
import CustomModal from '../../components/CustomModal';

const foodNotes = [
  {
    note: `Don’t forget to ensure you have food weighing scales to measure your foods.`,
  },
  {
    note: 'Remember these calories are a guide for how much you should eat. So use this as a starting point, you may need to reduce or increase them a little  overtime to suit your specific needs.',
  },
  {
    note: 'You’ll also find there is no fats or carbs target, focus on your protein target you can spread your remaining calories across carb and fats depending on preference.',
  },
  {
    note: '',
  },
];
let FoodInfoModel = React.memo(function FoodInfoModel(props) {
  const {visible, onRequestClose} = props;
  return (
    <CustomModal
      visible={visible}
      onRequestClose={onRequestClose}
      modalTitle={'Your calories and macros'}>
      <View style={{padding: 10}}>
        {foodNotes.map(item => (
            <>{item.note ? 
                <Text style={{padding: 5,fontFamily:"Manrope-regular"}}>{item.note}</Text>
                : 
            <Text style={{paddingHorizontal: 5,paddingTop:5,fontFamily:"Manrope-regular"}}>For best results use my target numbers and enter these into{' '}
            
              <Text 
              onPress={() => Linking.openURL("https://apps.apple.com/gb/app/myfitnesspal-calorie-counter/id341232718")}
              style={
            
            {textDecorationLine:"underline",marginRight:10,color: COLORS.lightGreen,fontWeight: "500"}
          }>my fitness pal</Text>{' '}and track and log your foods through that app using my meals on my app for ideas.</Text>}</>
          
        ))}
      </View>
    </CustomModal>
  );
});

const styles = StyleSheet.create({

})
export default FoodInfoModel;
