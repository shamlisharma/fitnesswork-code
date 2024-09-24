import React from 'react';
import {Modal,View,Text, StyleSheet, Pressable} from 'react-native';
import { COLORS } from './Constant';

// This components used for show inline errors
const InlineModal = React.memo(props => (
    <Modal transparent={true}>
        <View style={styles.modalBackground}>
           <View style={styles.activityIndicatorWrapper}>
               <View style={{borderBottomWidth:1,borderBottomColor:COLORS.grey_4}}>
    <Text style={[styles.cm_alert_danger, props.style]}>{props.errorMessage}</Text>
    </View>
    <Pressable onPress={props.close}><Text style={[styles.ok_alert, props.style]}>OK</Text></Pressable>
    </View>
    </View>
    </Modal>
));

const styles = StyleSheet.create({
  cm_alert_danger: {
    color: COLORS.black,
    fontFamily:"Manrope-Semibold",
    fontSize:16,
    marginTop:25,
    textAlign:"center",
    letterSpacing:.5,
    paddingBottom:10
  },
  ok_alert:{
    color: COLORS.blue,
    fontWeight:"600",
    fontSize:17,
    marginTop:15,
    textAlign:"center",
     
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
 
},
activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height:"auto",
    width: "80%",
    paddingBottom:15,
    borderRadius:10
    
    

}
});

export default InlineModal;
