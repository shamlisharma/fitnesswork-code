import React, { useState } from 'react';
import { Modal, View,Text,StyleSheet,Pressable,TextInput,ScrollView } from 'react-native';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppButton, COLORS } from '../../common/Constant';
import { CloseFoodIcon } from '../../Svg';

let RenameFoodTitle = React.memo(function RenameFoodTitle(props)
{
    const {rename,close}=props;
    const [title,setTitle]=useState("");
    return(
        
        <Modal animationType="slide"
        transparent={true}
        visible={rename}
        onRequestClose={close}>
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
                Rename shopping list
              </Text>
             
            </View>
            <Pressable onPress={close}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </Pressable>
          </View>
          <Text style={[styles.subTitleText,styles.textPadding]}>Rename title of the shopping list</Text>
          <View style={styles.inputBoxContainer}>
          <TextInput  maxLength={50} style={styles.inputBoxStyle} onChangeText={text => setTitle(text)}/>
          <AppButton title="Rename a list and add the meal there"/>
        </View>
        </View>
        
      </View>
      </ScrollView>
    </Modal>
    )
})
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
      borderRadius:5,
      paddingVertical:10,
      paddingHorizontal:10,
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
  
export default RenameFoodTitle;