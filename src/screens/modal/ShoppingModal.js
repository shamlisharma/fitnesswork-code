import React, {useState} from 'react';
import {Text, Pressable, StyleSheet, View, Modal,TextInput,ScrollView} from 'react-native';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {AppButton, COLORS} from '../../common/Constant';
import RadioButton from '../../components/RadioButton';
import {CloseFoodIcon, StepsCloseIcon} from '../../Svg';

export const ShoppingModal = React.memo(props => {
  const {addCart, closeShopping} = props;
  const [title, setTitle] = useState("");
  
  return (
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={addCart}
      onRequestClose={closeShopping}>
        <ScrollView>
      <View style={styles.modalBg}>
        <View style={styles.modalBackground}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  color: COLORS.grey_2,
                  fontSize: 16,
                  lineHeight: 20,
                  fontFamily: 'Manrope-Semibold',
                }}>
                No shopping lists yet
              </Text>
              <Text style={styles.subTitleText}>
                Create the list to add the meal
              </Text>
            </View>
            <Pressable onPress={closeShopping}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </Pressable>
          </View>
          <Text style={[styles.subTitleText,styles.textPadding]}>Title of the shopping list</Text>
         
          <View style={styles.inputBoxContainer}>
          <TextInput  maxLength={50} style={styles.inputBoxStyle} onChangeText={text => setTitle(text)}/>
          
          <AppButton title="Creat a list and add the meal there"/>
        </View>
        
        </View>
        
      </View>
      </ScrollView>
    </Modal>
   
  );
});
const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: '#00000040',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: COLORS.light_grey,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    marginTop: 472,
  },
  subTitleText: {
    fontSize: 14,
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
  },
  textPadding:{
      paddingTop:10
  },
  inputBoxStyle: { 
    backgroundColor:'white', 
    borderWidth:1, 
    paddingHorizontal:10,
    borderRadius:5,
    paddingVertical:10,
    borderColor:COLORS.grey_6,
    color:COLORS.grey_2,
    fontFamily:'Manrope-Regular',
    fontSize:15,
  },
  inputBoxContainer: {
    flex:1, 
    paddingTop:10
  },
});
