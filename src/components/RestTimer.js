import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {Text, StyleSheet, AppState, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../common/Constant';
import {workoutProgrammeActionTypes} from '../_action/WorkoutAction';
import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';

//this variable stores the data of 'time' on component unmount
var second;
let timer;
const RestTimer = React.memo(props => {
  const {dependency, style, onCompleteWorkout, playVideo,currentTime,onChangeTime,restMode=false,timeout=60,completeRest} = props;
  // const [time, setTime] = useState(useSelector(state => state.workout.workoutDuration.seconds))
  const [time, setTime] = useState(currentTime||0);
  const dispatch = useDispatch();

  useEffect(() => {
    second = time;

    if (time >= 0) {
      onCompleteWorkout && onCompleteWorkout();
    }
    if(restMode&&time>=timeout){
      completeRest&&completeRest(true)
      setTime(0)
    }
    onChangeTime&&onChangeTime(time)
  }, [time]);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const getTimerStatus = useSelector(
    state => state.workout.workoutDurationCheck1,
  );
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState=====??', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useLayoutEffect(() => {
    if (appStateVisible === 'background') {
      dispatch({
        type: workoutProgrammeActionTypes.WORKOUT_DURARATION_ACTIVE_REST,
        payload: {
          active: true,
          previousTime: time,
          previousDateTime: moment(new Date()),
        },
      });
    }
    if (appStateVisible === 'active') {
      const dateTemp = moment(new Date());
      const duration = moment.duration(
        dateTemp.diff(getTimerStatus.previousDateTime),
      );
      const secondTemp = duration.asSeconds();
      if (getTimerStatus.active === true) {
        setTime(() => getTimerStatus.previousTime + parseInt(secondTemp));
      }
      dispatch({
        type: workoutProgrammeActionTypes.WORKOUT_DURARATION_ACTIVE_REST,
        payload: {
          active: false,
          previousTime: time,
          previousDateTime: moment(new Date()),
        },
      });
    }
  }, [appStateVisible]);

  useEffect(() => {
    // BackgroundTimer.start();
    const timeInterval = setInterval(() => {
      if (playVideo) {
      
        setTime(prevState => prevState + 1);
      
      }
    }, 1000);
    // timer = BackgroundTimer.setInterval(() => {
    //   if (playVideo) {
    //     setTime(prevState => prevState + 1);
    //   }
    // }, 1000);
    return () => {
      //updateDuration();
      //clearInterval(timer);
      clearInterval(timeInterval);
      // BackgroundTimer.stop();
    };
    
  }, [dependency, playVideo]);

  // const onClearInterval = () => {
  //   clearInterval(timer)
  // }

  const formattedTime = () => {
    let minutes = parseInt(time / 60);
    let seconds = time % 60;
    return `${minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2})}`;
  };

  const updateDuration = () => {
    dispatch({
      type: workoutProgrammeActionTypes.UPDATE_WORKOUT_DURATION_REST,
      payload: second,
    });
  };
  return <Text style={[styles.timerTextStyle, style]}>{formattedTime()}</Text>;
});

export default RestTimer;

const styles = StyleSheet.create({
  timerTextStyle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: COLORS.lightBlue,
  },
});
