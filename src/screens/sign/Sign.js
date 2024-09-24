import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { DeviceScreen } from '../../common/Constant'
import { BackArrowIcon } from '../../Svg'
import MyComponent from './Radio'
import RadioButton from '../../components/RadioButton'
import GradientButton from '../../components/GradientButton'

const Sign = ({navigation}) => {
  return (
 <ImageBackground 
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: "100%"}}>
<View style={{backgroundColor:"rgba(0,0,0,0.5)",flex:1,}}>
<View style={{flexDirection:"row",alignItems:"center",marginTop:20}}>
  <View style={{padding:20}}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
    <BackArrowIcon color={'white'}/>
    </TouchableOpacity>
  
  </View>
 <View>
  <TouchableOpacity >
  <Text style={{paddingLeft:100,fontSize:28,color:"#0DB8DA"}} >
    Sign Up
  </Text>
  </TouchableOpacity>
  
 </View>
</View>
<View>
  <Text style={{color:"white",fontWeight:"700",fontSize:16,marginTop:160,marginLeft:"10%"}}>
  Preferred rest day
  </Text>
</View>
<MyComponent/>
<View style={{marginHorizontal:20,marginTop:"20%"}}>

<GradientButton title="Confirm the chosed day"  onPress={() =>navigation.navigate('Sign2') }/>
</View>


</View>
          
        </ImageBackground>
   
  )
}

export default Sign

const styles = StyleSheet.create({})