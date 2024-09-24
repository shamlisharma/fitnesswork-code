import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';
import {playSound} from './Sound';
import {COLORS} from '../../../common/Constant';

let countdownTimerInterval1;
let countdownTimerInterval2;
let countdownTimerInterval3;
const CountdownTimer = React.memo(props => {
  const {onComplete, countdownStartTime, speakExerciseName, speakWorkoutTime} =
    props;
  const [timer, setTimer] = useState(countdownStartTime);
  // console.log('AppState=====',AppState.currentState)

  useEffect(() => {
    if (timer === 3) {
      speakExerciseName();
      playSound('countdown.mp3');
    } else if (
      (countdownStartTime == 10 && timer == 10) ||
      (countdownStartTime == 120 && timer == 120)
    ) {
      speakWorkoutTime();
    }
  }, [timer]);

  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      setTimer(res => res - 1);
    }, 1000);

    return () => BackgroundTimer.stopBackgroundTimer();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      // speakExerciseName();
      onComplete();
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [timer]);

  useEffect(() => {
    // return () => { clearInterval(countdownTimerInterval) }
  });

  return (
    <View style={styles.containerView}>
      <Text style={styles.labelStyle}>{timer}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  containerView: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    marginTop: 15,
  },

  labelStyle: {
    fontSize: 32,
    color: COLORS.black,
  },
});

export {CountdownTimer};
