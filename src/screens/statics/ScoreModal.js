import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {Modal, StyleSheet, Text,TouchableOpacity,View, Pressable, Platform} from 'react-native';
import { COLORS } from '../../common/Constant';
import { StepsCloseIcon } from '../../Svg';

function ScoreModal(props) {
    const {visible,close, onPerformanceLinkedPressed} = props
    const navigation = useNavigation();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}>
      <View style={styles.fadedBackground} />
      <View style={styles.container}>
       <View style={styles.subContainer}>
        <TouchableOpacity onPress={close} style={styles.closeButtonStyle}>
          <StepsCloseIcon color={COLORS.lightBlue} width={34} height={34}/>
        </TouchableOpacity>
        <View style={{paddingBottom:10}}>
          <Text style={styles.titleTextStyle}>Momentum Score</Text>
        </View>
        <View style={styles.contentContainer}>
            <Text style={styles.content}>
            The Momentum Score is designed to  help keep you accountable and show you how well you are doing for the week. It uses your sleep, diet, workout and activity goals to create a score out of 10.

            </Text>
            <Text style={styles.content}>
            If you are hitting your goals throughout the week, your momentum will be higher. If you re not, it will be lower.
            </Text>
            <Text style={styles.content}>
              If you have not set goals you can do so in your performance score{'  '}
              
                <Text 
                onPress={ onPerformanceLinkedPressed}
                
                style={[styles.aboutDesc, styles.linkDesc]}>
                  settings page.
                </Text>
              
                </Text>
        </View>
        </View>
      </View>
      </Modal>
  );
}
export default ScoreModal;
const styles = StyleSheet.create({
    container: {
      justifyContent:'center',
      alignItems:'center',
      flex:1,
      
    },
    fadedBackground: {
      backgroundColor:'black', 
      height:'100%', 
      opacity:0.5, 
      position:'absolute', 
      width:'100%'
    },
    subContainer: {
      backgroundColor:'white', 
      width:'90%', 
      borderRadius:5, 
      padding:10,
      paddingBottom:15,
      
    },
    closeButtonStyle: {
      position:'absolute', 
      left:5, 
      top:8, 
      zIndex:10
    },
    titleTextStyle: {
      textAlign:'center', 
      fontFamily:'Manrope-SemiBold', 
      fontSize:20, 
      color:COLORS.grey_2,
      
    },
    contentContainer:{borderTopWidth:1,padding:5,borderTopColor:COLORS.grey_5},
    content:{
        fontFamily:"Manrope",
        fontSize:14,
        textAlign:"auto",
        paddingTop:10,
        lineHeight:20
    },
    aboutDesc: {
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'left',
      color: COLORS.grey_3,
      paddingHorizontal: 5,
    },
   
    linkDesc: {
      textDecorationLine: 'underline',
      color: COLORS.lightGreen,
      alignItems: 'center',
      top: Platform.OS === 'android' ? 4 : 2,
    },

    linkContainerView: {
      // top: 50,
      backgroundColor: 'red'
    }


  })
  