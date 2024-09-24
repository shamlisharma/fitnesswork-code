import React, { useState, useEffect } from 'react'
import {View, TextInput, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector,connect } from 'react-redux';
import { COLORS } from '../../common/Constant';
import InlineError from '../../common/InlineError';
import CustomModal from '../../components/CustomModal';
import GradientButton from '../../components/GradientButton';
import { usersService } from '../../services/ApiServices';
import {setFitnessTarget } from '../../_action/FoodAction';
import { getProfileAction } from '../../_action/ProfileAction';

const ModifyStepsTargetModal = React.memo(props => {
  const dispatch = useDispatch();
  const {visible, onRequestClose, setModalVisible} = props;
  const [stepsTarget, setStepsTarget] = useState();
  const [stepsTargetError,setStepsTargetError] = useState('')
  const dailyFoodTarget = useSelector(state => state.food.dailyFoodTarget)
//   const getProfileData = useSelector(
//     state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
//   );
  
  const onUpdate = async() => {
    if(stepsTarget>60000){
      setStepsTargetError("Maximum,it should be 60k") 
    }else{
    let request = {
        stepsGoal: parseInt(stepsTarget),
    }
    dispatch(setFitnessTarget(request));
    const res =await usersService.fitnessGoal(request)
    if(res?.data?.statusCode === 1){
      dispatch(getProfileAction())
    }
    setModalVisible(false)
    
  }
}

  const handleNumbers = (text, actualValue) => {
    let prevText = actualValue
    const regex = /^[0-9]*$/
    if(regex.test(text)) {
      return text
    }
    return prevText
  };

  const handleValueChange= async (text)=>{
    let handleValueData= await handleNumbers(text, stepsTarget);
    setStepsTarget(handleValueData)
  }

  useEffect(()=> {
    setStepsTarget(props?.getProfileData?.stepsGoal || "")
  },[props?.getProfileData?.stepsGoal])

useEffect(()=>{
  if(stepsTarget<60000){
    setStepsTargetError("") 
  }
},[stepsTarget])

  return (
    <CustomModal visible={visible} onRequestClose={onRequestClose} modalTitle={'Your Goal'}>
        <View style={{paddingVertical:10}}>
          <Text style={styles.textStyle}>Goal</Text>
          <TextInput
            onChangeText={text => 
              handleValueChange(text)
            }
            maxLength={5}
            value={`${stepsTarget}`}
            placeholder={'Enter your goal'}
            keyboardType='number-pad'
            style={styles.textInputStyle}/>
            <InlineError style={[styles.inlineErrorStyle,{paddingLeft:10}]} errorMessage={stepsTargetError}/>
        </View>
        {/* <View style={{paddingBottom:40}}>
          <Text style={styles.textStyle}>Protein</Text>
          <TextInput 
            keyboardType='number-pad'
            maxLength={3}
            placeholder={'Enter new protein target'}
            value={`${proteinsTarget}`}
            onChangeText={text => setProteinsTarget(handleNumbers(text, proteinsTarget))}
            style={styles.textInputStyle}/>
        </View> */}
        <View style={styles.buttonContainer}>
          <GradientButton title='Update' onPress={onUpdate}/>
        </View>
     </CustomModal>
  )
})
const mapStateToProps = state => {
    return {
      getProfileData:
        state?.profileReducer?.profile?.data?.responseData?.userProfile,
    };
  };
export default connect(mapStateToProps)(ModifyStepsTargetModal)

const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomWidth:1, 
    borderColor: COLORS.lightGrey,
    paddingLeft:5, 
    paddingVertical:3,
    fontSize:16,
    marginHorizontal:4,
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
