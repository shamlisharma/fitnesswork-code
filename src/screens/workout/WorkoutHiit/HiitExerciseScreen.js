import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
  StyleSheet,
  Dimensions,
  Vibration,
  FlatList,
  ScrollView,
  AppState,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import {useDispatch} from 'react-redux';
import Tts from 'react-native-tts';
import exerciseVideoContext from './ExerciseVideoContext';
import {getProfileAction} from '../../../_action/ProfileAction';
import {MainScreen} from '../../../common/Screen';
import {playSound} from './Sound';
import {ExerciseVideo} from './ExerciseVideo';
import {
  CrossIcon,
  MusicIcon,
  PrevMusicIcon,
  PlayBtnIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PlayIconVideo,
  ActivePrevMusicIcon,
  NextInactiveIcon,
} from '../../../Svg';
import {EachCircuitComponent} from './EachCircuitComponent';
import {styles} from './WorkoutHiitStyle';
import {useNavigation} from '@react-navigation/native';
import settings from '../../../config/settings';
import CountDownTimer from '../../../components/CountDownTimer';
import {CountdownTimer} from './CountdownTimer';
import {COLORS} from '../../../common/Constant';
import AlertModal from '../../modal/AlertModal';
import GradientButton from '../../../components/GradientButton';
import {useSelector} from 'react-redux';
import {usersService} from '../../../services/ApiServices';
import {scale} from 'react-native-size-matters';
import RNBootSplash from 'react-native-bootsplash';

let timeInterval, timeInterval2, timeInverval3;

let mediaPath = settings.s3Url.url;

const HiitExerciseScreen = React.memo(props => {
  const dispatch = useDispatch();
  const {viewFrom} = props?.route?.params;
  const eachCircuitListRef = useRef({current: null});
  const allCircuitRef = useRef({current: null});
  const [previous, setPrevios] = useState(false);
  const [next, setNext] = useState(true);
  const [activeCircuitLap, setActiveCircuitLap] = useState(1);
  const [isVideoPaused, setVideoPaused] = useState(true);
  const [scrolledCircuitIndex, setScrolledCircuitIndex] = useState(0);
  const [videoBuffer, setVideoBuffer] = useState(false);
  const [countdownTimerVisibility, setCountdownTimerVisibility] = useState(
    viewFrom === true ? true : false,
  );
  // const [countdownStartValue, setCountDownStartValue] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [finishWorkoutButton, setAllowFinishWorkoutButton] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [workoutModal, setWorkoutModal] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [timer, setTimer] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [currentCircuit, selectedCircuit] = useState(props.route.params.ind);
  const [isBlur, setBlur] = useState(false);
  const [currentExcercise, selectedExcercise] = useState(
    props?.route?.params?.viewFrom === true
      ? 0
      : props?.route?.params?.indexValue,
  );
  const dataById = props?.route?.params?.dataByid;

  let playKey = props?.route?.params?.playKey;

  const workoutId = props?.route?.params?.workoutId;
  const workoutByIdData = props?.route?.params?.workoutByIdData;
  const workoutDataBySets = props?.route?.params?.dataBySets;
  const exer = props?.route?.params?.exer;
  const circuitData = props?.route?.params.dataByCircuit;
  const {restTimeData, noOfRoundsData} = props.route.params;
  const navigation = useNavigation();

  const [current, setCurrent] = useState(
    playKey == 'true' ? 0 : props?.route?.params?.indexValue,
  );
  const [mute, setMute] = useState(false);

  // console.log('circuit dat acomg====',circuitData)
  // console.log('params====',props?.route?.params?.indexValue)
  // console.log('excercise====',currentExcercise)
  const goalData = useSelector(
    state =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo,
  );

  useEffect(() => {
    Tts.setDucking(true);
  }, []);

  // console.log("indexValue",props?.route?.params?.indexValue);

  // useEffect(() => {
  //   if(true) {
  //     selectedExcercise(0);
  //   }

  // },[currentCircuit]);

  // useEffect(() => {
  //   if (allowFo) {
  //     setVideoPaused(true);
  //   }
  // }, []);

  useEffect(() => {
    // allCircuitRef?.current?.scrollToIndex({ index: currentCircuit })
  }, [currentCircuit]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('AppState of hit excercise video', 123);
      _handleAppStateChange();
    });
    return unsubscribe;
  }, [props]);

  const _handleAppStateChange = () => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('AppState of hit excercise video', nextAppState);
      //alert("omg")
      switch (nextAppState) {
        case 'active':
          setVideoPaused(false);
          return RNBootSplash.hide({duration: 220});
        case 'background':
          _handleBlurStatus();
        case 'inactive':
          _handleBlurStatus();
          return RNBootSplash.hide({duration: 220});
        // return RNBootSplash.show({ duration: 220 });
      }
    });

    return () => {
      subscription.remove();
    };
  };

  const omg = () => {
    alert('omg');
  };

  const updateIndex = () => {
    if (!alertModal && !workoutCompleted) {
      if (circuitData[currentCircuit].length === 1) {
        // if((circuitData[currentCircuit].length - 1) ===)
        // alert('sddsf')
        if (circuitData.length - 1 === currentCircuit) {
          onHandleWorkout('completed');
        } else {
          selectedCircuit(res => res + 1);
          setTimerSeconds(0);
          setTimerMinutes(0);
          selectedExcercise(0);
          clearInterval(timeInterval);
          // setVideoPaused(true);
        }
      } else {
        if (currentExcercise === circuitData[currentCircuit].length - 1) {
          if (true) {
            if (currentCircuit === circuitData.length - 1) {
              onHandleWorkout('completed');
            } else {
              clearInterval(timeInterval);
              setTimerMinutes(0);
              setTimerSeconds(0);
              selectedExcercise(0);
              selectedCircuit(res => res + 1);
              setTimer(false);
            }
          } else {
            onHandleWorkout('completed');
          }
        } else {
          setTimerMinutes(0);
          setTimerSeconds(0);
          selectedExcercise(res => res + 1);
        }
      }
    }
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      setTimeout(() => {
        setVideoPaused(true);
      }, 500);
    } else {
      setVideoPaused(true);
    }
  }, [currentCircuit, currentExcercise]);

  const onEndVideo = (allowRestTime, allowLooping) => {
    if (viewFrom) {
      // setVideoPaused(true);
      if (allowRestTime) {
        if (!alertModal && !workoutCompleted) {
          if (
            currentExcercise == circuitData[currentCircuit].length - 1 &&
            currentCircuit === circuitData.length - 1 &&
            activeCircuitLap == noOfRoundsData[currentCircuit]
          ) {
            setTimer(true);
          } else if (
            currentExcercise == circuitData[currentCircuit].length - 1 &&
            activeCircuitLap == noOfRoundsData[currentCircuit]
          ) {
          } else {
            setTimer(true);
          }
        }
      } else if (!allowLooping) {
        updateIndex();
      }

      // setVideoPaused(true);

      // if (dataById.length - 1 === current) {
      //   setCurrent(current);
      //   // setNext(false);
      //   setPrevios(false);

      //   // navigation.goBack()
      // }

      if (allowRestTime || allowLooping) {
        // if((currentExcercise == circuitData[currentCircuit].length - 1)) {
        //   updateIndex();
        // }
        // else {
        var delayInMilliseconds; //1 second
        if (allowLooping) {
          delayInMilliseconds = 0;
        } else {
          if (
            currentExcercise === circuitData[currentCircuit].length - 1 &&
            currentCircuit === circuitData.length - 1 &&
            activeCircuitLap == noOfRoundsData[currentCircuit]
          ) {
            delayInMilliseconds = 30000;
          } else if (
            currentExcercise === circuitData[currentCircuit].length - 1 &&
            activeCircuitLap == noOfRoundsData[currentCircuit]
          ) {
            delayInMilliseconds = 0;
          } else {
            delayInMilliseconds = restTimeData[currentCircuit] * 1000;
          }
        }

        setTimeout(function () {
          setTimer(false);

          // updateIndex();

          if (currentExcercise === circuitData[currentCircuit].length - 1) {
            if (noOfRoundsData[currentCircuit] === activeCircuitLap) {
              setActiveCircuitLap(1);
              updateIndex();
            } else {
              setActiveCircuitLap(rep => rep + 1);
              setTimerSeconds(0);
              setTimerMinutes(0);
              selectedExcercise(0);
              setCountdownTimerVisibility(true);
              // videoPlayerRef?.current?.seek(0);
            }
          } else {
            updateIndex();
          }

          // if (circuitData[currentCircuit][currentExcercise]?.noOfReps) {
          //   if (
          //     circuitData[currentCircuit][currentExcercise]?.noOfReps ==
          //     activeRep
          //   ) {
          //     setActiveRep(1);
          //     updateIndex();
          //   } else {
          //     setTimerSeconds(0);
          //     setTimerMinutes(0);
          //     setCountdownTimerVisibility(true);
          //     videoPlayerRef?.current?.seek(0);
          //     setActiveRep(rep => rep + 1);
          //   }
          // }

          //
        }, delayInMilliseconds);
        // }
      }
    } else {
      setTimer(false);
      clearInterval(timeInterval);
      updateIndex();
      setVideoPaused(true);
    }
  };

  useEffect(() => {
    if (countdownTimerVisibility) {
      setVideoPaused(true);
    } else {
      setVideoPaused(false);
    }
  }, [countdownTimerVisibility]);

  useEffect(() => {
    if (viewFrom) {
      // alert(timer)

      // setTimer(false);
      if (timer) {
        // setTimeout(() => {
        //   setTimer(false)
        // },2000)
      }
      setCountdownTimerVisibility(true);
    }
  }, [currentCircuit, currentExcercise]);

  console.log('current circuit======', currentCircuit);
  console.log('current exercise======', currentExcercise);

  useEffect(() => {
    if (!viewFrom) {
    }
  }, []);

  // useEffect(() => {
  //   if(timer === false) {
  //     setCountdownTimerVisibility(true);
  //   }
  // },[timer])

  // useEffect(() => {
  //    setVideoPaused(true);

  // },[currentCircuit, currentExcercise])

  useEffect(() => {
    const timeInterval = BackgroundTimer.setInterval(() => {
      if (!countdownTimerVisibility) {
        // if (timerSeconds === 59) {
        //   setTimerMinutes(min => min + 1);
        // }
        // setTimerSeconds(sec => (sec === 59 ? 0 : sec + 1));
        console.log('BackgroundTimer starting 1333');
        setTimerSeconds(sec => sec + 1);
      }
    }, 1000);
    return () => BackgroundTimer.clearInterval(timeInterval);
  }, [isVideoPaused, timerSeconds, videoBuffer]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      // do something
      _handleBlurStatus();
      console.log('blur status on circuit video');
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    console.log('AppState of hit excercise video blur h', isVideoPaused);
  }, [isVideoPaused]);

  const _handleBlurStatus = () => {
    //console.log("blur status on circuit video status",viewFrom);
    console.log('AppState of hit excercise video blur');
    setVideoPaused(true);
    //  if (countdownTimerVisibility) {
    //     setCountdownTimerVisibility(false);
    //   }
    //   clearTimeout(timeInterval2);
    //   clearTimeout(timeInverval3);
  };

  const handleSubmit = () => {
    let params = {
      workoutId: props?.route?.params?.workoutId,
      currentWorkoutId: props?.route?.params?.currentWId,
      week: goalData?.workoutWeek,
      phase: goalData?.workoutPhase,
      day: props?.route?.params?.day,
      exerciseStats: [props?.route?.params?.noOfSets?._id],
      category: props?.route?.params?.category,
      dayGoal:
        props?.route?.params?.dashboard === true
          ? goalData?.dayGoal
            ? goalData?.dayGoal
            : 1
          : goalData?.dayGoal,
      weekGoal:
        props?.route?.params?.dashboard === true
          ? goalData?.dayGoal
            ? goalData?.weekGoal
            : goalData?.weekGoal + 1
          : goalData?.weekGoal,
    };

    usersService.saveExerciseStatistics(params).then(res => {
      setAlertModal(false);
      if (res.status === 200) {
        if (res.data.statusCode === 1) {
          dispatch(getProfileAction());
          navigation.replace('Hiit complete', {
            id: workoutId,
            cir: workoutByIdData,
            exer: exer,
            dataById: dataById,
            dashboard: props?.route?.params?.dashboard,
            workoutTitle: props?.route?.params?.workoutTitle,
            backgroundImage: props?.route?.params?.backgroundImage,
          });
        } else {
          alert('internal server error');
        }
      }
    });
  };

  // console.log('circuitData[currentCircuit]=====',circuitData)

  const onNextVideoMove = () => {
    setVideoPaused(true);
    setTimerSeconds(0);
    setTimerMinutes(0);
    clearInterval(timeInterval);
  };

  const onNextPlay = () => {
    // if (dataById.length > current) {
    //   setCurrent(current + 1);
    //   setPrevios(true);
    //   setNext(true);

    // }
    // onNextVideoMove();
    onEndVideo(false, true);
  };

  const onPrevious = () => {
    if (current <= 1) {
      setCurrent(current - 1);
      setPrevios(false);
      setNext(true);
      onNextVideoMove();
    } else {
      setCurrent(current - 1);
      setPrevios(true);
      setNext(true);
      onNextVideoMove();
    }
  };

  const handleLoad = meta => {
    // if (firstCall.current) {
    //   setDuration(meta.duration);
    //   firstCall.current = false;
    // }
    // startInterval();
  };

  const handleProgress = progress => {
    if (videoBuffer) {
      setVideoBuffer(false);
    }

    // setProgress(progress.currentTime / duration);
  };

  // console.log('props comnig===',props.route.params);

  const RepsFormater = () => {
    if (
      !circuitData[currentCircuit][currentExcercise].isTimeBased
      // circuitData[currentCircuit][currentExcercise]?.perSide == null ||
      // circuitData[currentCircuit][currentExcercise]?.noOfReps == null
    ) {
      return circuitData[currentCircuit][currentExcercise]?.time + ' ' + 'secs';
      // return dataById[current]?.time + ' ' + 'min';
    } else if (circuitData[currentCircuit][currentExcercise].isTimeBased) {
      return (
        circuitData[currentCircuit][currentExcercise]?.noOfReps +
        ' ' +
        'Reps (' +
        circuitData[currentCircuit][currentExcercise]?.perSide +
        ' per side)'
      );
    } else {
      return (
        circuitData[currentCircuit][currentExcercise]?.noOfReps + ' ' + 'Reps'
      );
    }
  };

  useEffect(() => {
    if (countdownTimerVisibility) {
      // Tts.speak(
      //   `${circuitData[currentCircuit][currentExcercise]?.title} ${circuitData[currentCircuit][currentExcercise]?.time} seconds`,
      //   {
      //     id: 'com.apple.ttsbundle.Samantha-compact',
      //     name: 'Samantha',
      //     language: 'en-US',
      //   },
      // );
    }
  }, [countdownTimerVisibility]);

  const RepsbyIdFormater = () => {
    if (
      workoutDataBySets?.perSide == null ||
      workoutDataBySets?.noOfReps == null
    ) {
      return workoutDataBySets?.time + ' ' + 'min';
    } else if (workoutDataBySets?.perSide) {
      return (
        workoutDataBySets?.noOfReps +
        ' ' +
        'Reps (' +
        workoutDataBySets?.perSide +
        ' per side)'
      );
    } else {
      return workoutDataBySets?.noOfReps + ' ' + 'Reps';
    }
  };

  const onHandleWorkout = type => {
    clearInterval(timeInterval);
    setTimerMinutes(0);
    setTimerSeconds(0);
    setTimer(false);
    setVideoPaused(true);
    if (Platform.OS == 'android') {
      setTimeout(() => {}, 1000);
    } else {
      setTimer(false);
    }

    if (props?.route?.params?.viewFrom == true) {
      // navigation.replace('Hiit complete', {
      //   id: workoutId,
      // cir: workoutByIdData,
      // exer: exer,
      // dataById: dataById,
      // dashboard:props?.route?.params?.dashboard
      // })
      setTimer(false);
      if (type == 'completed') {
        setWorkoutCompleted(true);
        setAllowFinishWorkoutButton(true);

        Tts.speak(`workout completed`, {
          id: 'com.apple.ttsbundle.Samantha-compact',
          name: 'Samantha',
          language: 'en-US',
        });
      } else {
        setAlertModal(true);
      }
    } else {
      // setAlertModal(true)
    }
  };
  const alertContent = 'Are you sure ? you want to finish your workout.';

  const renderNumberOfLaps = () => {
    if (noOfRoundsData[currentCircuit] > 1) {
      return `. Lap ${activeCircuitLap} / ${noOfRoundsData[currentCircuit]}`;
    } else {
      return `. Lap ${noOfRoundsData[currentCircuit]}`;
    }
  };

  useEffect(() => {
    if (!circuitData[currentCircuit][currentExcercise]?.isTimeBased) {
      // if(circuitData[currentCircuit][currentExcercise]?.time ==
      //   Math.floor())

      if (timerSeconds == circuitData[currentCircuit][currentExcercise]?.time) {
        if (!alertModal && !workoutCompleted && !countdownTimerVisibility) {
          setVideoPaused(true);
          onEndVideo(true);
          playSound('finished.mp3');
          Vibration.vibrate();
        }
      }
    } else {
      if (timerSeconds == 300) {
        if (!alertModal && !workoutCompleted && !countdownTimerVisibility) {
          setVideoPaused(true);
          onEndVideo(true);
          playSound('finished.mp3');
          Vibration.vibrate();
        }
      }
    }
  }, [timerSeconds]);

  const getCountdownStartTime = () => {
    if (currentExcercise == 0 && currentCircuit == 0 && activeCircuitLap == 1) {
      return 10;
    } else if (
      currentExcercise == 0 &&
      currentCircuit == 0 &&
      activeCircuitLap != 1
    ) {
      return 3;
    } else if (
      currentExcercise == 0 &&
      currentCircuit != 0 &&
      activeCircuitLap == 1
    ) {
      return 120;
    } else if (
      currentExcercise == 0 &&
      currentCircuit != 0 &&
      activeCircuitLap != 1
    ) {
      return 3;
    } else if (currentExcercise != 0) {
      return 3;
    }
  };

  useEffect(() => {
    navigation.addListener('blur', route => {
      setVideoPaused(true);
    });
  }, [navigation]);

  const onViewRef = React.useRef(viewableItems => {
    setScrolledCircuitIndex(viewableItems.changed[0].index);
  });
  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  console.log('circuitData neeraj=-======', circuitData);

  const renderExercises = () => {
    return (
      <exerciseVideoContext.Provider
        value={{
          timer: timer,
          alertModal: alertModal,
          workoutCompleted: workoutCompleted,
          countdownTimerVisibility: countdownTimerVisibility,
          isVideoPaused: isVideoPaused,
          mute: mute,
          viewFrom: viewFrom,
          scrolledCircuitIndex: scrolledCircuitIndex,
        }}>
        <FlatList
          data={circuitData}
          extraData={[circuitData, currentExcercise, currentCircuit, isBlur]}
          horizontal
          pagingEnabled
          initialScrollIndex={currentCircuit}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 0));
            wait.then(() => {
              if(allCircuitRef!= null && allCircuitRef.current){
                allCircuitRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                });
              }
           
            });
          }}
          // initialNumToRender={60}
          // initialScrollIndex={viewFrom ? 0: 1}
          ref={allCircuitRef}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          style={{marginTop: scale(30)}}
          scrollEnabled={false}
          keyExtractor={(item, index) => index + ''}
          renderItem={({item, index}) => {
            // console.log('item  whole poop===', item);
            return (
              <EachCircuitComponent
                eachCircuit={item}
                ref={eachCircuitListRef}
                currentExcercise={currentExcercise}
                currentCircuit={currentCircuit}
                activeCircuit={index}
                isBlurStatus={isBlur}
              />
            );
          }}
        />
      </exerciseVideoContext.Provider>
    );
  };

  // const renderEachCircuit = eachCircuitItem => {
  //   // console.log('eachCircuitItem neeraj', eachCircuitItem);

  //   return (
  //     <View
  //       style={{
  //         height: scale(350),
  //         width: Dimensions.get('window').width - scale(20),
  //       }}>
  //       <ScrollView
  //         ref={eachCircuitListRef}
  //         horizontal
  //         pagingEnabled
  //       >
  //         {eachCircuitItem.map((item, index) => {
  //           return <ExerciseVideo item={item} />;
  //         })}
  //       </ScrollView>
  //     </View>
  //   );
  // };

  return (
    <MainScreen>
      {alertModal ? (
        <AlertModal
          alert={true}
          onResume={() => handleSubmit()}
          headertitle="Finish Workout?"
          content={alertContent}
          cancel={() => navigation.goBack()}
          cancelBtn="Cancel Workout"
          saveBtn="Finish Workout"
          width={150}
          allowCloseIcon
          onClosePressed={() => setAlertModal(false)}
        />
      ) : null}
      {workoutModal ? (
        <AlertModal
          alert={true}
          cancel={() => setWorkoutModal(false)}
          onResume={() => navigation.goBack()}
          headertitle="Cancel Workout?"
          content={'Are you sure you want to end this workout?'}
          cancelBtn="Cancel"
          saveBtn="Yes"
          width={100}
        />
      ) : null}
      {workoutCompleted ? (
        <AlertModal
          alert={true}
          titleCustomStyle={{paddingVertical: undefined}}
          modalCustomStyle={{paddingBottom: 15}}
          content="Workout completed 🎉"
          onResume={() => {
            setWorkoutCompleted(false);
            handleSubmit();
          }}
          saveBtn="Ok"
          cancelBtn=""
          width={100}
        />
      ) : null}
      <View style={styles.Hiitheader}>
        <Pressable
          style={[Platform.OS === 'ios' ? styles.iosHeader : styles.andHeader]}
          onPress={() => {
            viewFrom ? setWorkoutModal(true) : navigation.goBack();
          }}>
          <CrossIcon />
        </Pressable>

        <View style={styles.hiitTitleContainer}>
          <Text style={styles.HiitHeaderTitle}>
            Circuit {currentCircuit + 1}
            {!alertModal && !workoutCompleted && viewFrom ? (
              renderNumberOfLaps()
            ) : (
              <View />
            )}
            {/* {`${noOfRoundsData[currentCircuit].length > 1? activeCircuitLap/noOfRoundsData[currentCircuit]: noOfRoundsData[currentCircuit] `} */}
          </Text>
          <Text
            style={[
              styles.HiitHeaderTitle,
              {color: '#333333', fontWeight: '500'},
            ]}>
            Exercise {currentExcercise + 1}/
            {circuitData[currentCircuit]?.length}
          </Text>
        </View>
        <View
          style={[
            styles.timerContainer,
            {opacity: viewFrom && finishWorkoutButton ? 1 : 0.3},
          ]}>
          <GradientButton
            title={'Finish'}
            onPress={() => viewFrom && finishWorkoutButton && onHandleWorkout()}
            style={{padding: 6, paddingHorizontal: 10}}
            textStyle={{fontSize: 13}}
          />
        </View>
      </View>

      <View style={{flex: 1, marginHorizontal: 12}}>
        {countdownTimerVisibility && (
          <CountdownTimer
            onComplete={() => {
              setCountdownTimerVisibility(false);
              setVideoPaused(false);
              Tts.speak(
                `${circuitData[currentCircuit][currentExcercise]?.title}`,
                {
                  id: 'com.apple.ttsbundle.Samantha-compact',
                  name: 'Samantha',
                  language: 'en-US',
                },
              );
              // timeInterval2 = setTimeout  (() => {
              //   setVideoPaused(true);
              //   setVideoPaused(false);

              // },2000)
            }}
            speakWorkoutTime={() => {
              Tts.speak(
                getCountdownStartTime() == 120
                  ? `next circuit begins in 2 mins`
                  : `workout begins in ${getCountdownStartTime()} seconds`,
                // ,
                // {
                //   id: 'com.apple.ttsbundle.Samantha-compact',
                //   name: 'Samantha',
                //   language: 'en-US',
                // }
              );
            }}
            speakExerciseName={
              () => {}
              // Tts.speak(

              // `${circuitData[currentCircuit][currentExcercise]?.title}`,
              // {
              //   id: 'com.apple.ttsbundle.Samantha-compact',
              //   name: 'Samantha',
              //   language: 'en-US',
              // },
              // )
            }
            countdownStartTime={getCountdownStartTime()}
          />
        )}
        <View style={{alignItems: 'center', marginTop: 10}}>
          {viewFrom && (
            <View>
              {timer && !alertModal && !workoutCompleted ? (
                <Text style={{color: COLORS.blue, fontSize: 16}}>
                  Rest time 00:
                  <CountDownTimer
                    duration={
                      currentExcercise ===
                        circuitData[currentCircuit].length - 1 &&
                      currentCircuit === circuitData.length - 1
                        ? 30000
                        : restTimeData[currentCircuit] * 1000
                    }
                    hit={'true'}
                  />
                </Text>
              ) : !alertModal && !workoutCompleted ? (
                <Text style={styles.hiitTimer}>
                  {`${
                    Math.floor(timerSeconds / 60) <= 9 ? '0' : ''
                  }${Math.floor(timerSeconds / 60)} : ${
                    Math.floor(timerSeconds % 60) <= 9 ? '0' : ''
                  }${Math.floor(timerSeconds % 60)}`}
                </Text>
              ) : (
                // <Text style={styles.hiitTimer}>
                //   {sign +
                //     (min < 10 ? '0' : '') +
                //     min +
                //     ':' +
                //     (sec < 10 ? '0' : '') +
                //     sec}
                // </Text>
                <View />
              )}
            </View>
          )}
          <Text style={styles.excerciseTitle}>
            {circuitData[currentCircuit][currentExcercise]?.title}
          </Text>
          {!alertModal && !workoutCompleted && !countdownTimerVisibility && (
            <Text style={styles.excerciseTitle1}>{RepsFormater()}</Text>
          )}
        </View>
        <View
          style={{
            flex: 8.8,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {true ? (
            <>
              {renderExercises()}
              {/* <Video
                repeat
                // mixWithOthers={'mix'}
                source={
                 
                  circuitData[currentCircuit][currentExcercise]
                    ?.exerciseVideo == ''
                    ? {
                        uri: circuitData[currentCircuit][currentExcercise]?.link
                          ?.url,
                      }
                    : {
                        uri:
                          cdnPath +
                          circuitData[currentCircuit][currentExcercise]
                            ?.exerciseVideo,
                      }
                }
                style={[styles.videoStyle, {height: '90%', width: '90%'}]}
                controls={false}
                //  mixWithOthers
                selectedVideoTrack={{
                  type: "resolution",
                  value: 144            
                }}
                resizeMode={'contain'}
                onBuffer={() => setVideoBuffer(true)}
                onLoad={handleLoad}
                // ignoreSilentSwitch={'ignore'}
                disableFocus
                paused={
                  !viewFrom
                    ? true
                    : timer
                    ? true
                    : alertModal == true
                    ? true
                    : workoutCompleted == true
                    ? true
                    : countdownTimerVisibility? true
                    : isVideoPaused
                }
                onProgress={handleProgress}
                ref={videoPlayerRef}
                onEnd={() => {
                  // setTimerMinutes(0);
                  // setTimerSeconds(0);
                  // selectedExcercise(res => res + 1);
                  //  console.log('timer seconds getting====',timerSeconds)
                  //  console.log('circuitData[currentCircuit][currentExcercise]?.time==',circuitData[currentCircuit][currentExcercise]?.time)
                  // if(timerSeconds >= circuitData[currentCircuit][currentExcercise]?.time ) {
                  //   if(!alertModal && !countdownTimerVisibility) {
                  //     onEndVideo(true);
                  //     }
                  // }
                  if (
                    !circuitData[currentCircuit][currentExcercise]?.isTimeBased
                  ) {
                    if (
                      timerSeconds <
                      circuitData[currentCircuit][currentExcercise]?.time
                    ) {
                   

                      // videoPlayerRef?.current?.seek(0);
                    }
                  } else {
                    if (timerMinutes <= 5) {
                  

                      // videoPlayerRef?.current?.seek(0);
                    }
                  }
                }}
                muted={mute}
              /> */}
            </>
          ) : (
            <Image
              source={
                dataById[current]?.thumbImage === null
                  ? {uri: dataById[current]?.link?.image}
                  : {uri: mediaPath + dataById[current]?.thumbImage}
              }
              style={{height: '90%', width: '90%'}}
            />
          )}
        </View>

        <View style={{flex: 1.2, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              flex: 1.5,
              alignItems: 'center',
              opacity: viewFrom ? 1 : 0.2,
            }}
            onPress={() => (viewFrom ? setMute(mute => !mute) : {})}>
            <Image
              source={
                mute
                  ? require('assets/speakerOff.png')
                  : require('assets/speakerOn.png')
              }
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 5.8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <View style={{flex: 1}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              {previous ? (
                <TouchableOpacity onPress={() => onPrevious()}>
                  <ActivePrevMusicIcon />
                </TouchableOpacity>
              ) : (
                <PrevMusicIcon />
              )}
            </View>

            {
              // countdownTimerVisibility ? (
              //   <TouchableOpacity
              //     style={{
              //       flex: 1,
              //       alignItems: 'center',
              //       opacity: viewFrom ? 1 : 0.3,
              //     }}
              //     onPress={() => {
              //       if (viewFrom) {
              //         clearTimeout(timeInterval2);
              //         clearTimeout(timeInverval3);
              //         setVideoPaused(false);
              //         setCountdownTimerVisibility(false);
              //         // timeInverval3 = setTimeout(() => {
              //         //   setVideoPaused(true);
              //         //   setVideoPaused(false);
              //         // }, 1500);
              //       }
              //     }}>
              //     <PlayIconVideo />
              //   </TouchableOpacity>
              // ) :
              !isVideoPaused ? (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    opacity: viewFrom ? 1 : 0.3,
                  }}
                  onPress={() => {
                    if (viewFrom) {
                      setVideoPaused(true);
                    }
                  }}>
                  <PlayBtnIcon />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={timer}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    opacity: viewFrom ? 1 : 0.3,
                  }}
                  onPress={() => {
                    if (viewFrom) {
                      setVideoPaused(false);

                      if (countdownTimerVisibility) {
                        setCountdownTimerVisibility(false);
                      }
                      clearTimeout(timeInterval2);
                      clearTimeout(timeInverval3);
                      // timeInverval3 = setTimeout(() => {

                      //   setVideoPaused(true);
                      //   setVideoPaused(false);
                      // }, 1500);
                    }
                  }}>
                  <View>
                    <PlayIconVideo />
                  </View>
                </TouchableOpacity>
              )
            }

            {next && !timer && !countdownTimerVisibility ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  opacity: viewFrom ? 1 : 0.3,
                }}
                onPress={() => (viewFrom ? onNextPlay() : {})}>
                <NextIcon />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  opacity: viewFrom ? 1 : 0.3,
                }}>
                <NextInactiveIcon />
              </TouchableOpacity>
            )}
          </View>
          <View style={{flex: 2.7, alignItems: 'center'}}>
            <Text style={[styles.HiitHeaderTitle, {color: '#BDBDBD'}]}>
              Up next
            </Text>
            <Text style={styles.upnextTitle}>
              {currentExcercise === circuitData[currentCircuit].length - 1
                ? ''
                : circuitData[currentCircuit][currentExcercise + 1]?.title}
              {/* {dataById[current + 1]?.title} */}
            </Text>
          </View>
        </View>
      </View>
    </MainScreen>
  );
});
const style = StyleSheet.create({
  videoStyle: {
    width: '100%',
    height: Dimensions.get('window').height * 0.3125,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});
export default HiitExerciseScreen;
