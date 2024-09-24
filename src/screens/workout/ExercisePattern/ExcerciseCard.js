import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../../common/Constant';
import {RightArrowIcon} from '../../../Svg';
import {useNavigation} from '@react-navigation/core';


const ExcerciseCard = React.memo(props => {
  const {exerciseInfoData, exersizeData, dayGoal,workoutPhase,phase, fromDashboard} = props;
  const {exerciseId, noOfSets, _id, title} = props.item;
  
  const navigation = useNavigation();

const onWorkout =()=>{
  if(workoutPhase==phase)
  
  
  navigation.navigate('Excercise', {
    title: title,
    exerciseData: props.item,
    exerciseInfoData: exerciseInfoData,
    setCount: noOfSets,
    wId: props?.workoutid,
    dashboard: props?.dashboardData,
    workoutId:props?.workoutid,
    cWId:props?.cWorkId,
    cWorkWeek:props?.cWorkWeek,
    cPhase:props?.cPhase,
    index:props?.index,
    day:props?.day,
    fromDashboard,
    category:props?.category
  })
  
}

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
     //   onWorkout()
     console.log("hello")
      }>
      <View style={styles.textContainer}>
        <Text style={styles.titleTextStyle}>{title}</Text>
        <Text style={styles.subtitleTextStyle}>{`${props.setCount} Sets`}</Text>
      </View>
      <View style={styles.iconContainer}>
        {/* <RightArrowIcon color={COLORS.grey_4} /> */}
      </View>
    </TouchableOpacity>
  );
});

export default ExcerciseCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light_grey,
    padding: 2,
    borderRadius: 6,
    height: 80,
    flexDirection: 'row',
    marginVertical: 5,
  },
  imageStyle: {
    width: '30%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: '100%',
  },
  textContainer: {
    justifyContent: 'center',
    paddingLeft: 20,
    flex: 1,
  },
  titleTextStyle: {
    color: COLORS.blue,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  subtitleTextStyle: {
    color: COLORS.grey_4,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
