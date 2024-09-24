import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import {Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native'
import { COLORS } from '../../common/Constant'
import { Loader } from '../../common/Loader'
import { MainScreen } from '../../common/Screen'
import { usersService } from '../../services/ApiServices'
import { RightArrowIcon } from '../../Svg'


const DATA = [
  {
    name:'Bench'
  },
  {
    name:'Barbell Squat'
  },
  {
    name:'Deadlift '
  },
  {
    name:'Chest Press '
  },
  {
    name:'Pull Ups '
  },
  {
    name:'Hip Thrust'
  },
  {
    name:'Barbell Rows'
  },
  {
    name:'My Weight'
  },
]

const MilestonesTrackerScreen = React.memo(({route}) => {
  const navigation = useNavigation();
const [milestoneExercise,setMilestoneExercise] = useState([])
const [loader,setLoader] = useState(false)
  const renderItem = ({item, index}) => {
    console.warn({item,type:route?.params?.type})
    return(
    <TouchableOpacity 
      style={styles.componentContainerStyle} 
      onPress={()=>navigation.navigate('TrackDataScreen',{title:item?.title, category:index+1, type:route?.params?.type,exerciseId:item?._id})}>
      <Text style={styles.componentTextStyle}>{item?.title}</Text>
      <RightArrowIcon />
    </TouchableOpacity>
  )
  }
  useEffect(()=>{
    getMilestoneExercise()
  },[])
const getMilestoneExercise = async()=>{
  setLoader(true)
  const result = await usersService.getMilestoneExercise() 
  if(result?.data?.statusCode===1)
  setLoader(false)
  setMilestoneExercise(result?.data?.responseData?.result)
 
} 


  return (
    <MainScreen>
      <Loader loading={loader}/>
      <FlatList 
        data={milestoneExercise}
        renderItem={renderItem}
        style={{padding:10}}
       />
    </MainScreen>
  )
})

export default MilestonesTrackerScreen

const styles = StyleSheet.create({
  componentContainerStyle: {
    backgroundColor:COLORS.light_grey, 
    padding:15, 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    marginVertical:1 
  },
  componentTextStyle: {
    fontFamily:'Manrope-Regular', 
    fontSize:16
  }
})