import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import ProgressBar from '../../components/progress/ProgressBar';
import ProgressIndicator from '../../components/ProgressIndicator';
import {CaloriesIcon, InfoIcon, MoonIcon, PenIcon, StepsIcon, WorkOutIcon} from '../../Svg';
import moment from 'moment';
import {useSelector, connect, useDispatch} from 'react-redux';
import ModifyStepsTargetModal from './ModifyStepsTargetModal';
import ModifySleepTargetModal from './SleepGoal';
import {getProfileAction} from '../../_action/ProfileAction';
import {useNavigation} from '@react-navigation/native';
import ScoreModal from './ScoreModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { prop } from 'lodash/fp';
import UpdateWorkoutGoal from './UpdateWorkoutGoal';

let PerformanceScore = React.memo(function PerformanceScore(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const dailyFoodTarget = useSelector(state => state.food.dailyFoodTarget);
  const [stepsTarget,setStepsTarget] = useState()
  const [sleepTarget,setSleepTarget] = useState()

  const {loading, data} = useSelector(
    state => state?.workout?.workoutProgramme,
  );
  const goalData = useSelector(
    state =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo,
  );
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
const workoutDailyGoal=props?.route?.params?.workout;
const scoreBarPercentage=props?.route?.params?.scoreBarPercentage
  const [infoModal, setInfoModal] = useState(false);
  const [endDateStr, setEndDateStr] = useState();
  const [endDateMonth, setEndDateMonth] = useState();
  const [startDateMonth, setStartDateMonth] = useState();
  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [weekGoalData, setWeekGoalData] = useState();
  const [workoutModal,setWorkoutModal] = useState(false)
  const [progressBaarPercentege,setProgressBarPercentage] = useState()
  const [year, setYear] = useState();
  const [padding,setPadding]=useState(0)
  const {dailySteps,percentageSteps,totalCalories,sleepData,minute, workoutData} =props?.route?.params;
  const { workoutGoal } = props.route.params;
  // console.log('props comingg====',props.route.params);
  // console.log('profile goal data===',getProfileData)
  
  useEffect(() => {
    let currentDate = moment();
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    let weekStart = currentDate.clone().startOf('isoWeek');
    let weekEnd = currentDate.clone().endOf('isoWeek');
    let getYear = new Date().getFullYear();

    setYear(getYear);

    setEndDateStr(weekEnd.get('D'));
    setEndDateMonth(moment(weekEnd).format('MMM'));
    setStartDateMonth(months[weekStart.get('M')]);
    dispatch(getProfileAction());
  }, []);

  let workout = data?.data?.responseData?.result;
  let workoutArr = [];
  
  if (data?.data?.statusCode == 1) {
    var day = 1;
    workoutArr = workout.phase.map(val => {
      return {...val, day: day++, dayGoals: goalData?.dayGoal};
    });
  }
  
  useEffect(() => {
    const workoutsData = workout?.phase?.map(item => item.workouts);
    if (goalData?.workoutPhase == 1) {
      const workoutById = workoutsData[0]?.filter(item => item.workoutId);
      setWeekGoalData(workout?.phase[0]?.workoutPerWeek);
    }
    if (goalData?.workoutPhase == 2) {
      const workoutById = workoutsData[1]?.filter(item => item.workoutId);
      setWeekGoalData(workout?.phase[1]?.workoutPerWeek);
    }
    if (goalData?.workoutPhase == 3) {
      const workoutById = workoutsData[2]?.filter(item => item.workoutId);
      setWeekGoalData(workout?.phase[2]?.workoutPerWeek);
    }
  }, [navigation]);

  const [progressBarValue, setProgressBarValue] = useState(0);
  useEffect(() => {
    handleGetDashboardData();
  }, [
    props?.getProfileData?.stepsGoal,
    dailyFoodTarget?.caloriesTarget,
    workoutArr?.length,
    props?.getProfileData?.sleepGoal,

    dailySteps,

    totalCalories,

    goalData?.weekGoal,

    sleepData,
  ]);

  const handleGetDashboardData = () => {
    if (!props?.getProfileData) return;
    let {stepsGoal, sleepGoal,myDiet} = props?.getProfileData;
    if (totalCalories <= dailyFoodTarget?.caloriesTarget) {
      var calAvg = myDiet*6.25;
      calAvg = calAvg ? calAvg : 0;
    } else {
      var calAvg = myDiet*6.25;
      calAvg = calAvg ? calAvg : 0;
    }

    if (goalData?.weekGoal <= weekGoalData) {
      var workoutAvg = (goalData?.weekGoal * 25) / weekGoalData;
      workoutAvg = workoutAvg ? workoutAvg : 0;
    } else {
      var workoutAvg = (weekGoalData * 25) / weekGoalData;
      workoutAvg = workoutAvg ? workoutAvg : 0;
    }

    var stepAvg;
    var sleepAvg;

    if (dailySteps <= stepsGoal) {
      stepAvg = (dailySteps * 25) / stepsGoal;
    } else {
      stepAvg = (stepsGoal * 25) / stepsGoal;
    }
    if (sleepData <= sleepGoal) {
      sleepAvg = (sleepData?.toFixed(2) * 25) / sleepGoal;
    } else {
      sleepAvg = (sleepGoal?.toFixed(2) * 25) / sleepGoal;
    }

    stepAvg = stepAvg ? stepAvg : 0;
    sleepAvg = sleepAvg ? sleepAvg : 0;
    setProgressBarValue((calAvg + workoutAvg + stepAvg + sleepAvg) / 100);
    let barPercentage = calAvg + workoutAvg + stepAvg + sleepAvg;
    setProgressBarPercentage(barPercentage)
  };

  const toggleSleepsModa = () => {
    setSleepModalVisible(!sleepModalVisible);
  };

  const toggleWorkoutModal = () =>{
    setWorkoutModal(!workoutModal)
  }

  const toggleStepsModal = () => {
    setStepsModalVisible(!stepsModalVisible);
  };

const onDiet = async()=>{
  await AsyncStorage.setItem("fromHomeTab","true")
  navigation.navigate('FoodTab')
}

useEffect(()=>{
  // console.log('props.getprofile data==',props.getProfileData)
setStepsTarget(props?.getProfileData?.stepsGoal)
setSleepTarget(props?.getProfileData?.sleepGoal)

},[props?.getProfileData?.stepsGoal,props?.getProfileData?.sleepGoal, props?.getProfileData?.workoutGoal])

useEffect(()=>{
if(stepsTarget?.toString().length == 5){
  setPadding(10)
}else if(stepsTarget?.toString().length == 4){
  setPadding(23)
}else if(stepsTarget?.toString().length == 3){
  setPadding(26)
}else{
  setPadding(26)
}

},[stepsTarget])

const calculateWorkoutPercentage = () => {
  if(getProfileData?.totalWorkout &&  getProfileData?.workoutGoal) {
    return ((getProfileData?.totalWorkout + (workoutData || 0)  ) / getProfileData?.workoutGoal) * 100
   }
   else {
     return 0;  
   }
  }

const renderProgressBarColor = (value) => {
  
  if(value >= 80 && value <= 120) {
    return '#00FF00'
  }
  else if(value < 80) {
   return 'orange'
  }
  else {
    
      return 'orange'
    }
}

const changeMemershipModal = () => {
  Alert.alert(
    'Upgrade Plan',
    'To customise your performance score, please upgrade your account.',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => props.navigation.navigate('Membership')},
    ],
    {
      cancelable: false,
    },
  );
};

const onClickUpdateData = (type) => {
  // console.log("onClickUpdateData",getProfileData?.planName,"----",getProfileData?.planName != 'Standard' && getProfileData?.planName != 'Premium')
  // if(getProfileData?.planName != 'Standard' && getProfileData?.planName != 'Premium' ) {
  //    changeMemershipModal()
  // }
  // else {
    switch(type) {
      case 'steps':
      setStepsModalVisible(true);
      break;
      case 'sleep':
        toggleSleepsModa(true)
        break;
      case 'workout':
        setWorkoutModal(true)
        break;
    }
  // }
}


 return (
    <MainScreen color={COLORS.inputTxtColor}>
      <ModifyStepsTargetModal
        visible={stepsModalVisible}
        onRequestClose={toggleStepsModal}
        setModalVisible={() => {
          toggleStepsModal();
          handleGetDashboardData();
        }}
      />
      {infoModal ? (
        <ScoreModal 
          visible={infoModal} 
          close={() => setInfoModal(false)} 
          onPerformanceLinkedPressed={() => setInfoModal(false)}
        />
      ) : null}
      <ModifySleepTargetModal
        visible={sleepModalVisible}
        onRequestClose={toggleSleepsModa}
        setModalVisible={() => {
          toggleSleepsModa();
          handleGetDashboardData();
        }}
      />
      <UpdateWorkoutGoal 
      visible={workoutModal}
      onRequestClose={toggleWorkoutModal}
      setModalVisible={() => {
        toggleWorkoutModal();
      }}
      weekGoalData={getProfileData?.workoutGoal}/>
      <View style={styles.performanceScoreTitleContainer}>
        <View style={styles.performanceScoreTextContainer}>
          <View style={{flexDirection:"row",}}>
          <Text style={styles.performanceScoreTitleTextStyle}>
            This week's score
          </Text>
          <TouchableOpacity
            style={styles.infoIconStyle}
            onPress={() => setInfoModal(true)}>
            <InfoIcon color={"#6839ef29"} infoColor={"#6839ef"}/>
          </TouchableOpacity>
          </View>
          <Text style={{fontSize:18,fontFamily:"Manrope-Bold",}}> {scoreBarPercentage || 0}/10</Text>
 
        </View>
        <View style={styles.performanceSubTextContainer}>
          <Text style={styles.performanceSubTextStyle}>
            {props?.route?.params?.startDate} - {props?.route?.params?.endDate}
            {', '}
            {year}
          </Text>
        </View>
        <View style={styles.performanceScoreBarContainer}>
          <ProgressBar
            width={Dimensions.get('window').width - 60}
            progress={props?.route?.params?.progressBarValue||0}
            color1={props?.route?.params?.progressBaarPercentege < 60 ? '#f27030':COLORS.lightGreen}
                    color2={props?.route?.params?.progressBaarPercentege < 60 ? '#db5615':'#06a572'}
                    strokeColor={COLORS.grey_6}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          backgroundColor: COLORS.white,
          marginTop: 5,
        }}>
        <ProgressIndicator
          percent={props?.getProfileData?.stepsGoal||0}
          color={"#76c72e"}
          title={'Steps Daily Avg.'}
          targetValue={props?.getProfileData?.stepsGoal || 0}
          progressValue={dailySteps}
          icon={<StepsIcon color={"#76c72e"}/>}
          calories={true}
          workoutFromHome={true}
        />
        <View style={{}}>
          <View style={{
            flex:1,
            // paddingRight: padding
            width: 100
            }}>
            <Text style={styles.goal}>Steps Goal</Text>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => onClickUpdateData('steps')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <PenIcon width={18} height={18} color={COLORS.lightBlue} />
              </View>
              <Text style={styles.goalValue}>
                {stepsTarget || 0}
                
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.performanceCard} onPress={()=>onDiet()}>
        <ProgressIndicator
          percent={
            getProfileData?.myDietCount === 0
              ? 0
              : getProfileData?.myDietCount === 1
              ? 25
              : getProfileData?.myDietCount === 2
              ? 50
              : getProfileData?.myDietCount === 3
              ? 75
              : getProfileData?.myDietCount
              ? 100
              : 0
          }
          color={'#f27030'}
          getPercentValueDirectly
          title={'Diet Daily Avg.'}
          targetValue={dailyFoodTarget?.caloriesTarget == undefined ? 0 : dailyFoodTarget?.caloriesTarget}
          progressValue={~~totalCalories}
          calories={true}
          icon={<CaloriesIcon color={'#f27030'}/>}
          workoutFromHome={true}
          onPress={onDiet}
         />
         <View>


          <View style={{
            // flex:1,
            // paddingRight: padding,
            width: 100,
            
            }}>
            <Text style={styles.goal}>Diet Goal</Text>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => onClickUpdateData('steps')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <PenIcon width={18} height={18} color={COLORS.lightBlue} /> */}
              </View>
              <Text style={styles.goalValue}>
              {dailyFoodTarget?.caloriesTarget || 0}
            
              </Text>
            </TouchableOpacity>
          </View>



          
          
        </View>
      </TouchableOpacity>
      <View style={styles.performanceCard}>
        <ProgressIndicator
          percent={props?.getProfileData?.sleepGoal||0}
          targetValue={props?.getProfileData?.sleepGoal}
          color={'#6839ef'}
          title={'Sleep Daily Avg.'}
          progressValue={sleepData ? sleepData : 0}
          calories={true}
          icon={<MoonIcon color={'#6839ef'}/>}
          minute={minute}
          dataFromSleep={true}
          workoutFromHome={true}
        />
        <View>
          <View style={{
            // width: '100%',
             width: 100
             
             }}>
            <Text style={styles.goal}>Sleep Goal</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => onClickUpdateData('sleep')}>
              <PenIcon width={18} height={18} color={COLORS.lightBlue} />
              <Text style={styles.goalValue}>
                {sleepTarget
                  ? sleepTarget + 'h'
                  : 0 + 'h'} 
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.performanceCard}>
        <ProgressIndicator
          percent={calculateWorkoutPercentage()}
          color={'#3db1eb'}
          title={'Workouts'}
          targetValue={getProfileData?.workoutGoal}
          // targetValue={goalData?.weekGoal}
          progressValue={getProfileData?.totalWorkout + workoutData || 0}
          // progressValue={workoutDailyGoal ? workoutDailyGoal+goalData?.weekTarget||0:goalData?.weekTarget || 0}
          workoutFromHome={true}
          calories={true}
          icon={<WorkOutIcon color={"#3db1eb"}/>}
        />
        <View>
          <View style={{width: 100}}>
            <Text style={styles.goal}>Workouts Goal</Text>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => onClickUpdateData('workout')}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <PenIcon width={18} height={18} color={COLORS.lightBlue} />
              </View>
              <Text style={[styles.goalValue]}>
                {getProfileData?.workoutGoal || 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </MainScreen>
  );
});
const mapStateToProps = state => {
  return {
    getProfileData:
      state?.profileReducer?.profile?.data?.responseData?.userProfile,
  };
};
export default connect(mapStateToProps)(PerformanceScore);

const styles = StyleSheet.create({
  performanceProgressCircleContainer: {
    // flex: 1,
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    // backgroundColor: COLORS.inputTxtColor,
  },
  performanceScoreTitleContainer: {
    backgroundColor: COLORS.white,
    marginTop: 5,
    padding: 15,
    paddingHorizontal:20
  },
  performanceScoreTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceScoreTitleTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.grey_2,
  },
  infoIconStyle: {
    top: -2,
    left: 5,
  },
  performanceScoreBarContainer: {
    paddingTop: 10,
  },
  performanceSubContainer: {
    backgroundColor: COLORS.inputTxtColor,
    marginTop: 2,
  },
  performanceSubTextContainer: {
    flexDirection: 'row',
  },
  performanceSubTextStyle: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.grey_2,
  },
  performanceProgressCircleContainer: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goal: {
    fontFamily: 'Manrope',
    fontSize: 14,
    color: COLORS.grey_3,
    paddingVertical: 4,
  },
  goalValue: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    // marginLeft: 5,
  },
  performanceCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: COLORS.white,
    
  },
  calValue: {
    marginLeft: 23,
  },
});
