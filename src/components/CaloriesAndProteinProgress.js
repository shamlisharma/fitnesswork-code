import React, { useEffect, useState } from 'react'
import { View, StyleSheet} from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS } from '../common/Constant'
import ProgressIndicator from './ProgressIndicator'

const CaloriesAndProteinProgress = React.memo((props) => {
  const {totalCalories, totalProtein} = props
  const dailyFoodTarget = useSelector(state => state.food.dailyFoodTarget)
  const [calories,setCalories] = useState('')
  const [protein,setProtein] = useState('')

  useEffect(()=>{
   if(totalCalories){
     if(totalCalories.toString().length>4){
       let str=totalCalories.toString().match(/.{1,4}/g)
       setCalories(str[0]+"")
     }
     else{
      setCalories(totalCalories)
     }
   }
   if(totalProtein){
    if(totalProtein.toString().length>4){
      let str=totalProtein.toString().match(/.{1,4}/g)
      setProtein(str[0]+"")
    }
    else{
     setProtein(totalProtein)
    } 
   }
  },[totalCalories,totalProtein])
  return (
    <View style={styles.container}>
      <ProgressIndicator
        title={'Calories'}
        progressValue = {calories|| 0}
        targetValue = {dailyFoodTarget?.caloriesTarget}
        fromCalories={true}
        color={(Math.floor((calories / dailyFoodTarget?.caloriesTarget) * 100)>=80 && Math.floor((calories / dailyFoodTarget?.caloriesTarget) * 100)<=120) ? COLORS.lightGreen:"#f27030"}
      />
      <ProgressIndicator
        title={'Protein'}
        progressValue={protein || 0}
        targetValue={dailyFoodTarget?.proteinsTarget}
        fromCalories={true}
        color={Math.floor((protein / dailyFoodTarget?.proteinsTarget) * 100)>=80 && Math.floor((protein / dailyFoodTarget?.proteinsTarget) * 100)<=120 ? COLORS.lightGreen:"#f27030"}

      />
    </View>
  )
})

export default CaloriesAndProteinProgress

const styles = StyleSheet.create({
  container: {
    backgroundColor:COLORS.inputTxtColor, 
    flex:1, 
    flexWrap:'wrap', 
    flexDirection:'row', 
    justifyContent:'space-between', 
    paddingVertical:10, 
  }
})