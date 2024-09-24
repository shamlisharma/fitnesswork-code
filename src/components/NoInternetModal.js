import React, {useState, useEffect} from 'react'
import { View, Text, Image } from 'react-native'



const NoInternetModal = React.memo(props => {


  return (
    // <CustomModal visible={visible} modalTitle={'Connection Error'}>
      <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'white', flex:1}}>
        <Image source={require('../../assets/nointernet.png')} style={{height:100, width:100}} />
        <Text style={{fontFamily:'Manrope-Regular', fontSize:15, textAlign:'center'}}>No Internet Available</Text>
      </View>
    // </CustomModal>
  )
})

export default NoInternetModal
