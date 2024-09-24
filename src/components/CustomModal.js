import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { COLORS } from '../common/Constant'
import { StepsCloseIcon } from '../Svg'

const CustomModal = React.memo((props) => {
  const {visible, onRequestClose, modalTitle, children} = props
  return (
    <Modal
      visible={visible}
      animationType={'none'}
      presentationStyle={'overFullScreen'}
      onRequestClose={onRequestClose}
      transparent={true}
      statusBarTranslucent={true}
      >
      <View style={styles.fadedBackground} />
      <View style={styles.container}>
      <View style={styles.subContainer}>
        <TouchableOpacity onPress={onRequestClose} style={styles.closeButtonStyle}>
          <StepsCloseIcon />
        </TouchableOpacity>
        <View style={{paddingBottom:10}}>
          <Text style={styles.titleTextStyle}>{modalTitle}</Text>
        </View>
        {children}
        </View>
      </View>
    </Modal>
  )
})

export default CustomModal

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
    width:'95%', 
    borderRadius:5, 
    padding:10,
    paddingBottom:15
  },
  closeButtonStyle: {
    position:'absolute', 
    right:5, 
    top:10, 
    zIndex:10
  },
  titleTextStyle: {
    textAlign:'center', 
    fontFamily:'Manrope-SemiBold', 
    fontSize:17, 
    color:COLORS.grey_2
  },
})
