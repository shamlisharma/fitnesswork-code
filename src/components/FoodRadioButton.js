import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { COLORS } from '../common/Constant'
import GradientContainer from './GradientContainer';

const FoodRadioButton = React.memo((props) => {
  const {name, selected, style, onSelect} = props;


  return (
    <Pressable style={{flexDirection:'row', alignItems:'center',...style}} onPress={onSelect}>
      <View style={{height:25, width:25, borderRadius:12.5, borderWidth:1, borderColor:(selected?COLORS.lightGreen:'#E0E0E0'), alignItems:'center', justifyContent:'center'}}>
        {selected ? <GradientContainer style={{width:13, height:13, borderRadius:10, backgroundColor:COLORS.lightGreen}} /> : null}
      </View>
      <Text style={{fontFamily:'Manrope-Regular', color:COLORS.white, fontSize:15, paddingLeft:10}}>{name}</Text>
    </Pressable>
  )
})

export default FoodRadioButton
