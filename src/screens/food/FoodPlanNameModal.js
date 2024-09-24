import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import CustomModal from '../../components/CustomModal'
import GradientButton from '../../components/GradientButton'

const FoodPlanNameModal = React.memo(props => {
  const {visible, onRequestClose, navigation} = props
  const [planName, setPlanName] = useState('');
  
  useEffect(()=> {
    setPlanName('')
  }, [visible])

  const onChangeText = (text) => {
    if(text.length>50)
      setPlanName(text.slice(0,50))
    else
      setPlanName(text)
  }

  return (
    <CustomModal visible={visible} onRequestClose={onRequestClose} modalTitle={'Food Plan Name'}>
      <View>
        <TextInput 
          value={planName}
          autoCapitalize={'sentences'}
          onChangeText={text=>onChangeText(text)}
          placeholder={'Enter a name for the food plan'}
          style={{padding:5, borderBottomWidth:1, fontSize:16, fontFamily:'Manrope-Regular', marginHorizontal:10, marginTop:15,color:"black"}} />
        <GradientButton title='Create' disabled={planName.length===0} style={{marginTop:25, marginHorizontal:20}} 
            onPress={()=>{
            onRequestClose()
            navigation.navigate('Add food', {title:planName})}} />
      </View>
    </CustomModal>
  )
})

export default FoodPlanNameModal
