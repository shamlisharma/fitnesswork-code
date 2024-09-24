import React, {memo, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions,Image} from 'react-native';
import Video from 'react-native-video';
import ExerciseVideoContext from './ExerciseVideoContext';
import {scale} from 'react-native-size-matters';
import settings from '../../../config/settings';
let cdnPath = settings.cdnUrl.url;
const ExerciseVideo = memo(props => {
  const {
    item,
    // timer,
    // alertModal,
    // workoutCompleted,
    // countdownTimerVisibility,
    // isVideoPaused,
     mute,
    currentExcercise,
    currentCircuit,
    index,
  } = props;

  const value = useContext(ExerciseVideoContext);

//  console.log("mutemutemute",mute,"exerciseVideo",item.exerciseVideo)
  const {exerciseVideo} = item;
  console.log('exerciseVideo====',exerciseVideo)


  // return null;
  return (

    !value.viewFrom?
     <Image
      source={{ uri: cdnPath + item.thumbImage }}
      style={ {
        height: scale(350),
         width: Dimensions.get('window').width - scale(20) ,
      }}
    />
    : 
    <Video
      repeat
      source={{uri: cdnPath + exerciseVideo}}
      style={{
        height: scale(350),
        // width: 20,
         width: Dimensions.get('window').width - scale(20) ,
        alignSelf: 'center',
      }}
      ignoreSilentSwitch={"ignore"}
      controls={false}
      selectedVideoTrack={{
        type: 'resolution',
        value: 144,
      }}
     
      volume={10}
      //resizeMode={'contain'}
      //disableFocus
      paused={
        !value.viewFrom
          ? true
          : index != currentExcercise
          ? true
          : currentCircuit != value.scrolledCircuitIndex
          ? true
          : value.timer
          ? true
          : value.alertModal == true
          ? true
          : value.workoutCompleted == true
          ? true
          : value.countdownTimerVisibility
          ? true
          : value.isVideoPaused

        // true
        // (index == currentExcercise
        // )? false:  true
      }
      // onEnd={() => {

      //   if (
      //     !circuitData[currentCircuit][currentExcercise]?.isTimeBased
      //   ) {
      //     if (
      //       timerSeconds <
      //       circuitData[currentCircuit][currentExcercise]?.time
      //     ) {

      //       // videoPlayerRef?.current?.seek(0);
      //     }
      //   } else {
      //     if (timerMinutes <= 5) {

      //       // videoPlayerRef?.current?.seek(0);
      //     }
      //   }
      // }}
      // muted={false}
      resizeMode={'contain'}
    />
  );
});

export {ExerciseVideo};
