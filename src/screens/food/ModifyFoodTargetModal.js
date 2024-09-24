import React, { useState, useEffect } from 'react'
import {View, TextInput, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../common/Constant';
import CustomModal from '../../components/CustomModal';
import GradientButton from '../../components/GradientButton';
import { setDailyFoodTarget } from '../../_action/FoodAction';

const ModifyFoodTargetModal = React.memo(props => {
  const dispatch = useDispatch();
  const {visible, onRequestClose, setModalVisible} = props;
  const [caloriesTarget, setCaloriesTarget] = useState();
  const [proteinsTarget, setProteinsTarget] = useState();
  const dailyFoodTarget = useSelector(state => state.food.dailyFoodTarget)

  const onUpdate = () => {
    let request = {
      caloriesTarget: caloriesTarget,
      proteinsTarget: proteinsTarget,
    }
    dispatch(setDailyFoodTarget(request));
    setModalVisible(false)
  }

  const handleNumbers = (text, actualValue) => {
    let prevText = actualValue
    const regex = /^[0-9]*$/
    if(regex.test(text)) {
      return text
    }
    return prevText
  }

  useEffect(()=> {
    setCaloriesTarget(dailyFoodTarget?.caloriesTarget || "")
    setProteinsTarget(dailyFoodTarget?.proteinsTarget || "")
  },[visible])


  return (
    <CustomModal visible={visible} onRequestClose={onRequestClose} modalTitle={'Update Daily Food Target'}>
        <View style={{paddingVertical:10}}>
          <Text style={styles.textStyle}>Calories</Text>
          <TextInput
            onChangeText={text => setCaloriesTarget(handleNumbers(text, caloriesTarget))} 
            maxLength={4}
            value={`${caloriesTarget}`}
            placeholder={'Enter new calorie target'}
            keyboardType='number-pad'
            style={styles.textInputStyle}/>
        </View>
        <View style={{paddingBottom:40}}>
          <Text style={styles.textStyle}>Protein</Text>
          <TextInput 
            keyboardType='number-pad'
            maxLength={3}
            placeholder={'Enter new protein target'}
            value={`${proteinsTarget}`}
            onChangeText={text => setProteinsTarget(handleNumbers(text, proteinsTarget))}
            style={styles.textInputStyle}/>
        </View>
        <View style={styles.buttonContainer}>
          <GradientButton disabled={!(caloriesTarget && proteinsTarget)} title='Update' onPress={onUpdate} />
        </View>
     </CustomModal>
  )
})

export default ModifyFoodTargetModal

const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomWidth:1, 
    borderColor: COLORS.lightGrey,
    paddingLeft:5, 
    paddingVertical:3,
    fontSize:16,
    marginHorizontal:10,
    fontFamily:'Manrope-Medium',
    color:"black"
  },
  textStyle: {
    fontFamily:'Manrope-Regular', 
    fontSize:16,
    color: COLORS.grey_2,
    marginHorizontal:10
  },
  
  buttonContainer: {
    paddingHorizontal:15, 
    justifyContent:'center'
  },
  
  
})
