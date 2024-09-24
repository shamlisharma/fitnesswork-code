import React, { useState, useEffect } from 'react'
import {View, TextInput, Text, StyleSheet } from 'react-native'
import { useDispatch, connect } from 'react-redux';
import { COLORS } from '../../common/Constant';
import CustomModal from '../../components/CustomModal';
import GradientButton from '../../components/GradientButton';
import { usersService } from '../../services/ApiServices';
import { setDailyFoodTarget, setFitnessTarget } from '../../_action/FoodAction';
import { getProfileAction } from '../../_action/ProfileAction';

const ModifySleepTargetModal = React.memo(props => {
  const dispatch = useDispatch();
  const {visible, onRequestClose, setModalVisible} = props;
  const [sleepTarget, setSleepTarget] = useState();
  
  
  const onUpdate = async() => {
    let request = {
      sleepGoal: parseInt(sleepTarget),
    }
    dispatch(setFitnessTarget(request));
    const res =await usersService.fitnessGoal(request)
    if(res?.data?.statusCode === 1){
    dispatch(getProfileAction())
   
   }
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
  const handleValueChange= async (text)=>{
    let handleValueData= await handleNumbers(text, sleepTarget);
    setSleepTarget(handleValueData)
  }

  useEffect(()=> {
    setSleepTarget(props?.getProfileData?.sleepGoal || "")
  },[visible])


  return (
    <CustomModal visible={visible} onRequestClose={onRequestClose} modalTitle={'Your Goal'}>
        <View style={{paddingVertical:10}}>
          <Text style={styles.textStyle}>Goal</Text>
          <TextInput
            onChangeText={text => 
              handleValueChange(text)
            } 
            maxLength={4}
            value={`${sleepTarget}`}
            placeholder={'Enter your goal'}
            keyboardType='number-pad'
            style={styles.textInputStyle}/>
        </View>
        
        <View style={styles.buttonContainer}>
          <GradientButton title='Update' onPress={onUpdate} />
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
  export default connect(mapStateToProps)(ModifySleepTargetModal)

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
