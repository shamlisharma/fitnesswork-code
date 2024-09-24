import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { MainScreen } from "../../../common/Screen";
import ExerciseGuideModal from "./ExerciseGuideModal";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import ExerciseCard from "./ExerciseCard";
import { getProfileAction } from "../../../_action/ProfileAction";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GradientButton from "../../../components/GradientButton";
import BackgroundTimer from "react-native-background-timer";
import * as Progress from "react-native-progress";
import { Switch } from "react-native-switch";
import Octicons from "react-native-vector-icons/Octicons";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  AppState,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Vibration,
} from "react-native";
import _debounce from "lodash/debounce";

import AlertModal from "../../modal/AlertModal";
import {
  Bookicon,
  CloseFoodIcon,
  CrossIcon,
  DoubleArrow,
  Historyicon,
  InfoIcon,
  InfoIconWithBorder,
  PauseIcon,
  PlayIcon,
  VideoPlayIcon,
} from "../../../Svg";
import Timer from "../../../components/Timer";

import ExerciseDetailRow from "./ExerciseDetailRow";
import GradientContainer from "../../../components/GradientContainer";
import settings from "../../../config/settings";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../common/Constant";
import { usersService } from "../../../services/ApiServices";
import { workoutProgrammeActionTypes } from "../../../_action/WorkoutAction";
import RBSheet from "react-native-raw-bottom-sheet";
import { BackHandler } from "react-native";
import { set } from "lodash";
import WarmUpGuideModal from "./WarmUpGuideModal";
import Video from "react-native-video";
import ModalTester2 from "../../Exercise/Modal2";
import SubmitScoreModal from "./SubmitScoreModal";
import ScoreInfoModal from "../../Exercise/ScoreInfoModal";
import ScoreInfoGuideModal from "./ScoreInfoGuideModal";
import RestTimer from "../../../components/RestTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loader } from "../../../common/Loader";
import moment from "moment";
import { showMessage } from "react-native-flash-message";
import { secondsToTime } from "../../../utils/helper";
// optional
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
var totalLatestScore = 0;
let tempData = [],
  outerIndex,
  innerIndex;
let cdnPath = settings.cdnUrl.url;
const ExerciseScreen = React.memo((props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      kG: "",
      repS: "",
      resT: "",
    }
  );

  // const {  viewFrom } = props?.route?.params;
  const dispatch = useDispatch();
  const RBSheetRef = useRef();
  const RBSheetRef2 = useRef();
  // const [timerPaused]
  const [currentlyPlayingVideoId, setCurrentlyPlayingVideoId] = useState("");
  const [workoutStatus, setWorkoutStatus] = useState(
    props?.route?.params?.viewFrom ? 1 : 0
  );
  const [restStatus, setRestStatus] = useState(0);
  const [exerId, setExerId] = useState([]);
  const [viewFrom, setIsViewFrom] = useState(props?.route?.params?.viewFrom);
  const [excerciseGuideVisibility, setExerciseGuideVisibility] =
    useState(false);
  const [eId, setId] = useState([]);
  const videoPlayerRef = useRef(null);
  const [isTimePaused, setTimePaused] = useState(false);
  const [startWorkout, setWorkout] = useState(false);
  const [radio, setRadio] = useState(false);
  const [currentWorkoutHistory, setCurrentWorkoutHistory] = useState();

  const time = useSelector((state) => state.workout.workoutDuration.seconds);
  const goal = useSelector(
    (state) => state.workout.workoutProgramme?.data?.data?.responseData?.result
  );
  const goalData = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo
  );
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData
  );
  
  // title={SubmitScoreModalTxt} isVisible={showSubmitScoreModal}
  const [SubmitScoreModalTxt, setSubmitScoreModalTxt] = useState("");
  const [showSubmitScoreModal, setshowSubmitScoreModal] = useState(false);
  const [warmupGuideVisibilty, setWarmupGuideVisibility] = useState(false);
  const [finishButtonVisibility, setFinishButtonVisibility] = useState(false);
  const [playVideo, setPlayVideo] = useState(true);
  const [startRest, setStartRest] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [exerciseStats, setExerciseStats] = useState([]);
  const [exerciseArr, setExerciseArr] = useState([]);
  const [fieldsValidationModal, setFieldValidationModal] = useState(false);
  const [completeWorkout, setCompleteWorkout] = useState(false);
  const [updatedExerciseStats, setUpdatedExerciseStats] = useState([]);
  const [alertModal, setAlertModal] = useState(false);
  const [closeWorkoutModal, setCloseWorkoutModal] = useState(false);
  const [currentVideoPath, setCurrentVideoPath] = useState();
  const [completeWorkoutResponse, setCompleteWorkoutResponse] = useState(null);
  const [muted, setMuted] = useState(true);
  const [currentExrID, setCurrentExrID] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [maxScore, setMaxScore] = useState(450);
  const [allScores, setAllScores] = useState([]);
  const [routeStates, setRouteStates] = useState({ ...route?.params });
  const [timeElapses, setTimeElapses] = useState(0);
  const [repsScores, setRepsScores] = useState({ scores: 0, reps: 0 });
  const [olddsc, setOlddsc] = useState(0);
  const [oldWorkoutData, setOldWorkoutData] = useState();
  const [latestScore, setLatestScore] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState("KG");
  const [submitPressed, setSubmitPressed] = useState(false);
  const [loading, setLoader] = useState(false);
  const [timeConsumed, setTimeConsumed] = useState("00:00")
  const alertContent =
    "This workout will not be marked as completed, because you have unsaved sets, reps and others changes.";

  // console.log({routeStates});
  const setsArray = (item) => {
    let temp = [];
    for (let i = 1; i <= item.setInfo?.length; i++) {
      temp.push(i);
    }
    return temp;
  };
  // 
  useEffect(async () => {
    // alert(route?.params?.allCompleteWorkout)
    // console.log("allCompleteWorkout", route?.params?.allCompleteWorkout)
    const unitt = await AsyncStorage.getItem("selectedUnit");

    if (unitt) {
      setSelectedUnit(JSON.parse(unitt));
    }
  }, []);
  
  const handleChange = async (states) => {
    setRouteStates({
      ...routeStates,
      exerciseInfoData: states?.updatedExerciseStats,
      ...states,
    });

    setUpdatedExerciseStats([...states?.updatedExerciseStats]);
    // exerciseInfoData: route?.params.exerciseInfoData,
    // wId: route?.params?.wId,
    // dashboard: route?.params.dashboard,
    // workoutId: route?.params?.workoutId,
    // cWId: route?.params?.cWId,
    // cWorkWeek: route?.params?.cWorkWeek,
    // cPhase: route?.params?.cPhase,
    // index: 0,
    // day: route?.params?.day,
    // category: route?.params?.category,
    // viewFrom: true,
    // workoutTitle: route?.params?.workoutTitle,
    // backgroundImage: route?.params.backgroundImage,
    // return
    let index1 = 0,
      updatedData = [],
      oldscoress = 0,
      oldreps = 0;

    // setOldWorkoutData(exerciseInfoData)

    while (index1 <= states?.updatedExerciseStats.length - 1) {
      let oldScores = 0;
      const res = await usersService.getWorkoutScores(
        states?.updatedExerciseStats[index1].exerciseId
      );
      console.log("scores", res?.data?.responseData?.score);
      if (res?.data?.statusCode == 1) {
        oldScores = res?.data?.responseData?.score;
        oldscoress = oldscoress + (oldScores || 0);
      }
      states?.updatedExerciseStats[index1].stats?.map((val, index) => {
        // val.completed=false
      });

      //progress bar data value
      updatedData.push({
        ...states?.updatedExerciseStats[index1],
        exerciseId: states?.updatedExerciseStats[index1].exerciseId,
        stats: states?.updatedExerciseStats[index1].stats,
        scores: oldScores,
      });

      index1++;
    }
    states?.updatedExerciseStats?.map((val, index) => {
      val?.stats?.map((value) => {
        oldreps = oldreps + (Number(value?.noOfReps) || 0);
      });
    });

    setRepsScores({ scores: oldscoress, reps: oldreps });
    setOlddsc(oldscoress);
    setUpdatedExerciseStats(updatedData);
  };
  const onBackToDetails = () => {
    if (routeStates?.viewFrom == true) {
      dispatch({
        type: workoutProgrammeActionTypes.RESET_WORKOUT_DURATION,
      });
      setCloseWorkoutModal(true);
    } else {
      dispatch({
        type: workoutProgrammeActionTypes.RESET_WORKOUT_DURATION,
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if(routeStates?.completedDay){
              navigation.goBack()
            }
            else{
              onBackToDetails();
            }
          }}
        >
          <CloseFoodIcon color={COLORS.grey_3} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleBackButtonClick = () => {
    if(routeStates?.completedDay) return navigation.goBack()
    Alert.alert(
      "Are you sure you want to leave workout?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      {
        cancelable: false,
      }
    );
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);
console.log({completeWorkout});
  useEffect(async () => {
    if(routeStates?.completedDay)return
    // alert("runs")
    let index1 = 0,
      updatedData = [],
      oldscoress = 0,
      oldreps = 0;
    const { exerciseInfoData } = route.params;
    console.log({exerciseInfoData:JSON.stringify(exerciseInfoData)});
    setOldWorkoutData(exerciseInfoData);

    while (index1 <= exerciseInfoData.length - 1) {
      let oldScores = 0;
      const res = await usersService.getWorkoutScores(
        exerciseInfoData[index1].exerciseId
      );

      if (res?.data?.statusCode == 1) {
        oldScores = res?.data?.responseData?.score;

        oldscoress = oldscoress + (oldScores || 0);
      }
      exerciseInfoData[index1].setInfo?.map((val, index) => {
        val.weight =0//val.weight>=0&&val?.weight?val.weight:0;
        // val.noOfReps=8
      });
      updatedData.push({
        exerciseId: exerciseInfoData[index1].exerciseId,
        stats: exerciseInfoData[index1].setInfo,
        scores: oldScores,
      });

      index1++;
    }
    exerciseInfoData?.map((val, index) => {
      val?.setInfo?.map((value) => {
        oldreps = oldreps + (Number(value?.noOfReps) || 0);
      });
    });

    setRepsScores({ scores: oldscoress, reps: oldreps });
    setOlddsc(oldscoress);
    setUpdatedExerciseStats(updatedData);
  }, []);
  
  useEffect(() => {
    //_handleAppStateChange();
    _getWorkoutHistory();
  }, [props]);
  console.log({currentWorkoutHistory});
  const _getWorkoutHistory = () => {
    // weekno/:day
   console.log("route?.params?.workoutId",route?.params?.workoutId);
   console.log(route?.params?.workoutId+"/" + getProfileData?.userProfile?.workoutProgrammeId+"/"+routeStates?.selectedWeek+"/"+routeStates?.currentDay);
    usersService
      .getWorkoutHistoryByWorkoutId(route?.params?.workoutId+"/" + getProfileData?.userProfile?.workoutProgrammeId+"/"+routeStates?.selectedWeek+"/"+routeStates?.currentDay)
      .then((res) => {

        if (res?.data?.responseData) {
          setCurrentWorkoutHistory(res?.data?.responseData);
          setTimeConsumed(secondsToTime(Number(res?.data?.responseData?.duration||0)))
          _updateCurrentWorkoutHistory(res?.data?.responseData?.workoutData)
        }
      })
      .catch((e) => console.log({ e }));
  };
  const _updateCurrentWorkoutHistory=async(exers)=>{
    let index1 = 0,
    updatedData = [],
    oldscoress = 0,
    oldreps = 0;
  const { exerciseInfoData } = route.params;
  console.log({exerciseInfoData:JSON.stringify(exerciseInfoData)});
  setOldWorkoutData(exerciseInfoData);

  while (index1 <= exerciseInfoData.length - 1) {
    let oldScores = 0;
   
    exerciseInfoData[index1].setInfo?.map((val, index) => {
      val.weight =exers[index1].weights[index] //val.weight>=0&&val?.weight?val.weight:0;
      val.noOfReps=exers[index1].reps[index]
    });
    updatedData.push({
      exerciseId: exerciseInfoData[index1].exerciseId,
      stats: exerciseInfoData[index1].setInfo,
      scores: oldScores,
    });

    index1++;
  }
  exerciseInfoData?.map((val, index) => {
    val?.setInfo?.map((value) => {
      oldreps = oldreps + (Number(value?.noOfReps) || 0);
    });
  });

  setRepsScores({ scores: oldscoress, reps: oldreps });
  setOlddsc(oldscoress);
  setUpdatedExerciseStats(updatedData);
  }
  const _saveWorkoutHistory = () => {
    console.log("route?.params?.workoutId", route?.params?.workoutId);
    let data = {
      workoutId: route?.params?.workoutId,
      completed: "5",
      duration: "5 m",
      score: "10",
      sets: "2",
      reps: "3",
    };
    usersService
      .setWorkoutHistoryByWorkoutId(data)
      .then((res) => {
        console.log("res from workout is", res?.data);
      })
      .catch((e) => console.log({ e }));
  };
  const _handleAppStateChange = () => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      //alert("omg")
      switch (nextAppState) {
        case "active":

        case "background":
          setWorkoutStatus(2);
        case "inactive":
          setWorkoutStatus(2);
      }
    });

    return () => {
      subscription.remove();
    };
  };

  const handleExerciseStats = (data, id) => {
    onValueChange(data, id);
    console.log("changeData", data);
    let tempArray = exerciseStats;
    let filteredData = tempArray.filter((item) => item.set === data.set);
    let index = tempArray.indexOf(filteredData[0]);
    // let data1 = [...id]
    setId((prevState) => prevState.concat(id));
    // setExerId(len)
    setExerciseStats(tempArray);
    let uniques = eId.filter((item, i, ar) => ar.indexOf(item) === i);

    if (index === -1) tempArray.push(data);
    else tempArray[index] = data;

    const groups = exerciseStats?.reduce((groups, chat) => {
      const exerciseId = chat?.exerciseId;
      if (!groups[exerciseId]) {
        groups[exerciseId] = [];
      }
      groups[exerciseId].push(chat);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object?.keys(groups)?.map((exerciseId) => {
      return {
        exerciseId,
        stats: groups[exerciseId],
      };
    });

    setExerciseArr(groupArrays);
  };
console.log("route.params.allCompleteWorkout",route.params.allCompleteWorkout);
  const checkIfAnyItemEmpty = (data) => {
    console.log({ data });
    let flag = 0;
    outerIndex = 0;
    while (outerIndex <= data.length - 1) {
      innerIndex = 0;
      while (innerIndex <= data[outerIndex].stats.length - 1) {
        const { weight, noOfReps, restTime } =
          data[outerIndex].stats[innerIndex];
        console.log("first", weight);
        if (weight == null || weight <= 0 || noOfReps < 1 || restTime < 1) {
          console.log("first");
          flag = 1;
        }
        //  else {
        //   flag = 1;
        //   // return;
        // }
        innerIndex++;
      }
      outerIndex++;
    }
    if (data.length > 0) {
      return flag;
    } else {
      return 1;
    }
  };
  const changeEmptyStatus = (data) => {
    let flag = 0;
    outerIndex = 0;
    // const data=JSON.parse(JSON.stringify(d))
    while (outerIndex <= data.length - 1) {
      innerIndex = 0;
      while (innerIndex <= data[outerIndex].stats.length - 1) {
        const { weight, noOfReps, restTime } =
          data[outerIndex].stats[innerIndex];
        console.log({ weight });
        if (weight < 0 || weight === null) {
          data[outerIndex].stats[innerIndex].weight = -1;
        }
        if (!noOfReps) {
          data[outerIndex].stats[innerIndex].noOfReps = -1;
        }
        if (!restTime) {
          data[outerIndex].stats[innerIndex].restTime = -1;
        }
        innerIndex++;
      }
      outerIndex++;
    }
    return data;
  };
  const _makingHistoryParams = (data) => {
    let flag = 0;
    outerIndex = 0;
    // const data=JSON.parse(JSON.stringify(d))
    while (outerIndex <= data.length - 1) {
      innerIndex = 0;
      data[outerIndex].weights=[]
        data[outerIndex].reps=[]
        data[outerIndex].sets=[]
      while (innerIndex <= data[outerIndex]?.stats?.length - 1) {
        const { weight, noOfReps, restTime,set } =
          data[outerIndex].stats[innerIndex];
        // console.log({ weight });
        data[outerIndex].weights.push(weight)
        data[outerIndex].reps.push(noOfReps)
        data[outerIndex].sets.push(set)
        innerIndex++;
      }
      // delete data[outerIndex].stats
      // delete data[outerIndex].scores
      outerIndex++;
    }
    return data;
  };

  const handleSubmit = async (states, exerItem, kGData, zz, zzz, T, R) => {
    setSubmitPressed(false);

    if (updatedExerciseStats?.length < 1) return;
    setLoader(true);
    let oldscoress = 0,
      oldreps = 0,
      index1 = 0,
      exerciseInfoData = oldWorkoutData;
    while (index1 <= exerciseInfoData.length - 1) {
      let oldScores = 0;
      const res = await usersService.getWorkoutScores(
        exerciseInfoData[index1].exerciseId
      );

      if (res?.data?.statusCode == 1) {
        oldScores = res?.data?.responseData?.score;
        oldscoress = oldscoress + (oldScores || 0);
      }
      index1++;
    }

    exerciseInfoData?.map((val, index) => {
      val?.setInfo?.map((value) => {
        oldreps = oldreps + (Number(value?.noOfReps) || 0);
      });
    });

    console.log(olddsc);
    // const {kG, resT, repS} = userInput;
    // if (kG == 0 || kG == '') {
    //   setAlertModal(true);
    // } else if (resT == 0 || resT == '') {
    //   setAlertModal(true);
    // } else if (repS == 0 || repS == '') {
    //   setAlertModal(true);
    // }
    // else
    {
      // let index1 = 0,
      //   index2 = 0;

      // while (index1 <= exerciseArr.length - 1) {

      //   index2 = 0;
      //   while (index2 <= exerciseArr[index1].stats.length - 1) {
      //     exerciseArr[index1].stats[index2].noOfReps =
      //       exerciseArr[index1].stats[index2].reps; // on object create new key name. Assign old value to this
      //     delete exerciseArr[index1].stats[index2].reps;
      //     index2++;
      //   }
      //   index1++;
      // }
      // changeEmptyStatus(updatedExerciseStats);
      
      // return
      // if (checkIfAnyItemEmpty(updatedExerciseStats) === 0) {
      // console.log(routeStates?.dashboard, "routeStates?.dashboard ");
      // console.log({updatedExerciseStats});
      // console.log(updatedExerciseStats[0].stats);
      // setLoader(false);
      // return
      let params = {
        day: routeStates?.day,
        category: routeStates?.category,
        workoutId: routeStates?.workoutId,
        exerciseStats: updatedExerciseStats,
        currentWorkoutId: routeStates?.cWId,
        week: goalData?.workoutWeek,
        // phase: goalData?.workoutPhase,
        dayGoal:
          routeStates?.dashboard === true
            ? goalData?.dayGoal
              ? goalData?.dayGoal
              : 1
            : goalData?.dayGoal,
        weekGoal:
          routeStates?.dashboard === true
            ? goalData?.dayGoal
              ? goalData?.weekGoal
              : goalData?.weekGoal + 1
            : goalData?.weekGoal,
      };
      let saveParams={
        userId:getProfileData.userProfile._id,
        workoutId:routeStates?.workoutId,
        workoutProgrammeId: getProfileData?.userProfile?.workoutProgrammeId,
        workoutData:_makingHistoryParams(updatedExerciseStats),
        duration:timeElapses,
        weekno:routeStates?.selectedWeek,
        day:routeStates?.currentDay,
      }
      console.log({saveParams});
      console.log(saveParams.workoutData);
      // setLoader(false)
      // return
      if (goalData?.workoutPhase) {
        params = { ...params, phase: goalData?.workoutPhase };
      }
      console.log("requestParams", routeStates?.selectedWeek);
      usersService
        .editUserProfile1({workoutWeek:routeStates?.selectedWeek})
        .then(response => {
          console.log({"response workout week":JSON.stringify(response)});
        })
        .catch(err => {
          console.log({err});
        });
      try {
        usersService
        .setWorkoutHistoryByWorkoutId(saveParams)
        .then((res) => {
          console.log("res from workout is",res?.data);
          
        })
        .catch((e) => {
          console.log({ e });
          
        });
        setCompleteWorkout(false);
        dispatch(getProfileAction());
        showMessage({
          message: "Message",
          description: "Congrats! Workout completed successfully.",
          type: "default",
          backgroundColor: COLORS.lightGreen,
          color: COLORS.white,
        });
        let data = {
          userId: getProfileData.userProfile._id,
          workoutProgrammeId: getProfileData?.userProfile?.workoutProgrammeId,
          workoutProgrammeHistory: {
            workoutId: routeStates?.workoutId,
            workoutWeek: routeStates?.selectedWeek,
          },
        }
        console.log({"program data is":data});
        const responsee = await usersService.updateWorkoutProgramHistory(
          data
        );
        console.log({ responsee:responsee });
        navigation.replace("Hiit complete", {
          id: routeStates?.workoutId,
          exLength: routeStates?.exerciseInfoData, //updatedExerciseStats
          workoutTitle: routeStates?.workoutTitle,
          dashboard: routeStates?.dashboard,
          fromDashboard: routeStates?.fromDashboard,
          backgroundImage: routeStates?.backgroundImage,
          day: routeStates?.currentDay,
          allComplete: route.params.allCompleteWorkout,
          timeElapses,
          repsScores: { scores: totalLatestScore, reps: oldreps },
        });
        setPlayVideo(false);
      } catch (error) {
        
      }
      //Comment for temporary
      // usersService
      //   .saveExerciseStatistics(params)
      //   .then(async (res) => {
      //     setLoader(false);
      //     if (res.status === 200) {
      //       if (res.data.statusCode === 1) {
      //         usersService
      //         .setWorkoutHistoryByWorkoutId(saveParams)
      //         .then((res) => {
      //           console.log("res from workout is",res?.data);
                
      //         })
      //         .catch((e) => {
      //           console.log({ e });
                
      //         });
      //         setCompleteWorkout(false);
      //         dispatch(getProfileAction());
      //         showMessage({
      //           message: "Message",
      //           description: "Congrats! Workout completed successfully.",
      //           type: "default",
      //           backgroundColor: COLORS.lightGreen,
      //           color: COLORS.white,
      //         });
      //         let data = {
      //           userId: getProfileData.userProfile._id,
      //           workoutProgrammeId: getProfileData?.userProfile?.workoutProgrammeId,
      //           workoutProgrammeHistory: {
      //             workoutId: routeStates?.workoutId,
      //             workoutWeek: routeStates?.selectedWeek,
      //           },
      //         }
      //         console.log({"program data is":data});
      //         const responsee = await usersService.updateWorkoutProgramHistory(
      //           data
      //         );
      //         console.log({ responsee:responsee.data });
      //         navigation.replace("Hiit complete", {
      //           id: routeStates?.workoutId,
      //           exLength: routeStates?.exerciseInfoData, //updatedExerciseStats
      //           workoutTitle: routeStates?.workoutTitle,
      //           dashboard: routeStates?.dashboard,
      //           fromDashboard: routeStates?.fromDashboard,
      //           backgroundImage: routeStates?.backgroundImage,
      //           day: routeStates?.currentDay,
      //           allComplete: route.params.allCompleteWorkout,
      //           timeElapses,
      //           repsScores: { scores: totalLatestScore, reps: oldreps },
      //         });
      //         setPlayVideo(false);
      //       } else {
      //         setCompleteWorkoutResponse(res.data.error.responseMessage);
      //       }
      //     }
      //   })
      //   .catch((e) => {
      //     // alert("catch")
      //     setLoader(false);
      //   });
      // } else {
      //   setLoader(false);

      //   setFieldValidationModal(true);
      // }
      // end temporary commented
    }
  };

  const onViewSubmit = () => {
    navigation.replace("Hiit complete", {
      id: routeStates?.workoutId,
      exLength: routeStates?.exerciseInfoData,
      title: routeStates?.title,
      onLoaderTrue: true,
      timeElapses,
      repsScores,
    });
  };
  const onResume = () => {
    setWorkoutStatus(2);
    setAlertModal(false);
  };

  const onPlay = (data) => {
    setWorkoutStatus(1);
    setPlayVideo(true);
  };
  useEffect(() => {
    if (submitPressed) {
      handleSubmit(updatedExerciseStats);
    }
  }, [submitPressed]);
console.log(routeStates?.completedDay);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        routeStates?.viewFrom ? (
          <View style={{ opacity: finishButtonVisibility ? 1 : 0.3 }}>
            {!routeStates?.completedDay && <GradientButton
              title={"Finish"}
              onPress={() => {
                console.log({ totalLatestScore });
                if (checkIfAnyItemEmpty(updatedExerciseStats) === 1) {
                  setCompleteWorkout(true);
                } else {
                  setSubmitPressed(true);
                  if (finishButtonVisibility) {
                    routeStates?.viewFrom == true
                      ? () => {}
                      : // handleSubmit(
                        //   updatedExerciseStats,
                        //   exerciseArr,
                        //   userInput.kG,
                        //   userInput.repS,
                        //   userInput.resT,
                        //   timeElapses,
                        //   repsScores
                        // )
                        onViewSubmit();
                  }
                }
              }}
              style={{ padding: 6, paddingHorizontal: 10 }}
              textStyle={{ fontSize: 13 }}
            />}
          </View>
        ) : (
          <View></View>
        ),
    });
  }, [navigation, exerciseArr, finishButtonVisibility]);
  const refContainer = useRef(null);

  useEffect(() => {
    if (routeStates?.viewFrom == true) {
    } else {
      if (refContainer?.current) {
        // setTimeout(
        //   () =>
        //     refContainer.current.scrollToIndex({
        //       animated: true,
        //       index: route?.params?.index || 0,
        //       viewPosition: 0,
        //     }),
        //   2000,
        // );
      }
    }
  }, [navigation]);

  const onValueChange = (data, id) => {
    // return
    if (updatedExerciseStats.length) {
      tempData = updatedExerciseStats;
      outerIndex = tempData.findIndex((item) => item.exerciseId == id);
      innerIndex =
        tempData != null &&
        tempData.length > 0 &&
        tempData[outerIndex]?.stats.findIndex(
          (item) => data.exerciseId == item._id
        );
      if (
        tempData != null &&
        tempData != undefined &&
        tempData[outerIndex] != undefined
      ) {
        tempData[outerIndex].stats[innerIndex] = {
          ...data,
          _id: data.exerciseId,
          noOfReps: data.reps,
        };
        delete tempData[outerIndex]?.stats[innerIndex].exerciseId;
        delete tempData[outerIndex]?.stats[innerIndex].reps;
        setUpdatedExerciseStats(tempData);
        tempData = [];
      }
    }
  };

  const getNotes = async (id) => {
    setNoteTitle("");
    setNoteDescription("");
    const res = await usersService.getWorkoutNotes(id);

    if (res.data.statusCode == 1) {
      setNoteTitle(res?.data?.responseData?.title);
      setNoteDescription(res?.data?.responseData?.notes);
    }
  };
  const getScores = async (id) => {
    //     setNoteTitle('')
    //     setNoteDescription('')
    // const res= await usersService.getWorkoutScores(id)
    // if(res.data.statusCode==1){
    //   setNoteTitle(res?.data?.responseData?.title)
    //   setNoteDescription(res?.data?.responseData?.notes)
    // }
  };
  const onSaveNote = async () => {
    const request = {
      exerciseId: currentExrID,
      title: noteTitle,
      notes: noteDescription,
    };
    const res = await usersService.workoutExecrciseNotes(request);

    if (res?.data?.statusCode === 1) {
      // alert("note added successfully")
      RBSheetRef.current?.close();
      setSubmitScoreModalTxt(res?.data?.error?.responseMessage);
      setshowSubmitScoreModal(true);
    } else {
      // alert(res?.data?.error?.responseMessage)
      setSubmitScoreModalTxt(res?.data?.error?.responseMessage);
      setshowSubmitScoreModal(true);
    }
    RBSheetRef.current?.close();
  };
  const addWorkoutScore = async (
    item,
    index,
    currentId,
    hasRest = false,
    rest,
    stateID,
    stats
  ) => {
    setStartRest(false);

    // return
    if (item?.length < 1) return;
    let tempexx = item;
    const currentex = item[index];
    let tempReps = [];
    let tempWeight = [];
    currentex?.stats?.map((val) => {
      if (val?._id === stateID || val?.completed) {
        tempReps.push(val?.noOfReps || 0);
        tempWeight.push(val?.weight || 0);
      } else {
        tempReps.push(0);
        tempWeight.push(0);
      }
    });

    const request = {
      exerciseId: currentex?.exerciseId,
      reps: tempReps,
      weight: tempWeight,
      sets: currentex?.stats?.length,
    };

    const res = await usersService.addWorkoutScore(request);

    if (res?.data?.statusCode === 1) {
      // alert("scores added successfully")
      setSubmitScoreModalTxt("scores added successfully");
      // setshowSubmitScoreModal(true)
      tempexx[index].workoutScore = res?.data?.responseData?.score;
      for (let val in tempexx[index].stats) {
        if (tempexx[index].stats[val]._id === stateID) {
          tempexx[index].stats[val].completed = true;
        }
      }

      setUpdatedExerciseStats([...tempexx]);

      saveHistory({
        exerId: currentId,
        data: item[index],

        // reps: tempReps.reduce(
        //   (partialSum, a) => Number(partialSum) + Number(a),
        //   0
        // ),
        // weight: tempWeight.reduce(
        //   (partialSum, a) => Number(partialSum) + Number(a),
        //   0
        // ),
        // exerId: currentId,
      });

      if (hasRest) {
        setStartRest(true);
        setRestTime(rest);
      }
    } else {
      // alert(res?.data?.error?.responseMessage)
      setSubmitScoreModalTxt(res?.data?.error?.responseMessage);
      setshowSubmitScoreModal(true);
    }
  };
  const debounceFn = useCallback(_debounce(addWorkoutScore, 1), []);

  //old data reps, weight, exerId
  const saveHistory = async ({ exerId, data }) => {
    var body = [];

    // var _total = 0;
    // usersService
    // .getMilestoneTrackerData(exerId)
    // .then((res) => {
    //   console.log({res})
    //   if( res.data.responseData.result?.tracker2.length > 0){
    //     res.data.responseData.result?.tracker2.map((item,index) =>{
    //      if(item.savedAt == moment(new Date()).format("YYYY-MM-DD")){
    //       item.exerciseData.map((i)=>{
    //         _total += i.weight
    //       })
    //      }
    //     })

    //     var allTotal = 0;
    //     data.stats.map((item) => {
    //       if (item.completed) {
    //         allTotal += item?.weight
    //         body.push({
    //           reps: item.noOfReps,
    //           weight: item?.weight,
    //         });
    //       }
    //     });

    //     console.log(allTotal > _total)
    //     if(allTotal > _total){
    //       let params = {
    //         exerciseId: exerId, // An example exercise ObjectId
    //         exerciseData: body,
    //         date: moment(new Date()).format("YYYY-MM-DD"), //"2023-07-07",
    //       };
    //       let arr = data.stats.filter((item) => item.completed).length;
    //       if (arr == data.stats.length) {
    //         let reps = data.stats.map((item) =>  (item.completed ? item.noOfReps * item.weight : 0 ));

    //         let _total = reps.reduce(
    //           (partialSum, a) => Number(partialSum) + Number(a),
    //           0
    //         )

    //         let score = _total * data.stats.length;
    //         setLatestScore((latestScore)=> (latestScore + score));

    //         usersService.saveMilestoneTrackerData(params).then((res) => {
    //           console.log(res.data);
    //         });
    //       }
    //     }

    //   }else{
    data.stats.map((item) => {
      if (item.completed) {
        body.push({
          reps: item.noOfReps,
          weight: item?.weight,
        });
      }
    });

    let params = {
      exerciseId: exerId, // An example exercise ObjectId
      exerciseData: body,
      date: moment(new Date()).format("YYYY-MM-DD"), //"2023-07-07",
    };
    let arr = data.stats.filter((item) => item.completed).length;
    if (arr == data.stats.length) {
      let reps = data.stats.map((item) =>
        item.completed ? item.noOfReps * item.weight : 0
      );

      let _total = reps.reduce(
        (partialSum, a) => Number(partialSum) + Number(a),
        0
      );

      let score = _total * data.stats.length;
      setLatestScore((latestScore) => latestScore + score);

      usersService.saveMilestoneTrackerData(params).then((res) => {
        console.log(res.data);
      });
    }
    // }
    // })

    // let params = {
    //   exerciseId: exerId,
    //   // category: route.params.category,
    //   weight: weight,
    //   reps: reps,
    // };
    // const result = await usersService.addWorkoutHistory(params);
    // console.log(result.data);
    // let reps = data.stats.map((item) => item.noOfReps);
    // let weight = data.stats.map((item) => item.weight);

    // let newWeight = weight.reduce(
    //   (partialSum, a) => Number(partialSum) + Number(a),
    //   0
    // );

    // let total = reps[0] * newWeight * data.stats.length;
    // setLatestScore((latestScore) => latestScore + total);
  };
  // const keyboardVerticalOffset = Platform.OS === 'ios' ? -150 : 0

  // useEffect(() => {
  //   const timeInterval = BackgroundTimer.setInterval(() => {
  //     timeView();
  //   }, 1000);
  //   return () => BackgroundTimer.clearInterval(timeInterval);
  // }, []);

  useEffect(() => {
    totalLatestScore = latestScore;
    console.log({ latestScore });
  }, [latestScore]);

  const TimeView = () => {
    return (
      <Timer
        style={{ marginLeft: 10 }}
        dependency={workoutStatus}
        onCompleteWorkout={() => {
          setFinishButtonVisibility(true);
        }}
        playVideo={playVideo}
        onChangeTime={setTimeElapses}
      />
    );
  };
  return (
    <MainScreen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        {/* <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        nestedScrollEnabled={true}> */}
        <Loader loading={loading} />
        <View
          style={{
            height: 50,
            alignItems: "center",
            marginHorizontal: 20,
            flexDirection: "row",
          }}
        >
          {radio ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable>
                <Text style={{ marginRight: 10 }}>Rest time</Text>
                {/* <PauseIcon width={40} height={40} /> */}
              </Pressable>
              <RestTimer
                style={{ marginLeft: 0, fontSize: 18 }}
                dependency={restStatus}
                onCompleteWorkout={() => {
                  setFinishButtonVisibility(true);
                }}
                completeRest={() => {
                  {
                    setStartRest(false);
                    setShowModal(true);
                    // Vibration.vibrate()
                    ReactNativeHapticFeedback.trigger("impactLight", options);
                  }
                }}
                playVideo={startRest}
                restMode={true}
                timeout={restTime}
              />
            </View>
          ) : null}
          {!routeStates?.completedDay&&<View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ marginRight: 10 }}>Auto rest timer</Text>
            <Switch
              value={radio}
              onValueChange={setRadio}
              disabled={false}
              activeText={"On"}
              inActiveText={"Off"}
              circleSize={20}
              barHeight={20}
              backgroundActive={"rgba(13, 184, 218, 1)"}
              backgroundInactive={"gray"}
              changeValueImmediately={true}
              renderActiveText={false}
              renderInActiveText={false}
            />
          </View>}
        </View>
        {!routeStates?.completedDay?<View style={{ alignSelf: "center" }}>
          <View style={styles.startButtonContainer}>
            {workoutStatus === 1 ? (
              <Pressable
                onPress={() => {
                  setWorkoutStatus(2);
                  setPlayVideo(false);
                }}
              >
                <PauseIcon />
              </Pressable>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (workoutStatus != 2) {
                      setIsViewFrom(true);
                      setWorkoutStatus(1);
                    }
                  }}
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  {/* <Text style={styles.startTextStyle}>
                    {workoutStatus === 2 ? 'continue' : 'start'}
                  </Text>
                  <Text style={styles.startTextStyle}>
                    {workoutStatus === 2 ? 'working' : 'workout'}
                  </Text> */}
                </TouchableOpacity>

                {viewFrom && (
                  <Pressable
                    onPress={() => onPlay()}
                    style={
                      {
                        // flexDirection: 'row',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // paddingTop: 8,
                      }
                    }
                  >
                    <PlayIcon />
                  </Pressable>
                )}
              </View>
            )}
            <View style={{ width: 100 }}>{viewFrom && TimeView()}</View>
          </View>
        </View>:
        <View style={{alignSelf:"center", }}>
          <Text style={[styles.timerTextStyle,]}>{timeConsumed}</Text>
          </View>}
       {!routeStates?.completedDay&& <GradientButton
          title={"Warm Up"}
          onPress={() => setWarmupGuideVisibility(true)}
          style={{ width: 100, alignSelf: "center", marginBottom: 20 }}
          textStyle={{ fontSize: 13 }}
        />}
        <View style={{ flex: 1 }} nestedScrollEnabled={true}>
          {alertModal ? (
            <AlertModal
              alert={true}
              onResume={() => onResume()}
              headertitle="Cancel Workout?"
              content={alertContent}
              cancel={() => {
                navigation.goBack();
              }}
              cancelBtn="Cancel Workout"
              saveBtn="Resume Workout"
              width={150}
            />
          ) : null}
          {closeWorkoutModal ? (
            <AlertModal
              alert={true}
              cancel={() => setCloseWorkoutModal(false)}
              onResume={() => {
                setWorkoutStatus(2);
                navigation.goBack();
              }}
              headertitle="Cancel Workout?"
              content={"Are you sure you want to end this workout?"}
              cancelBtn="Cancel"
              saveBtn="Yes"
              width={100}
            />
          ) : null}

          <AlertModal
            onResume={() => {
              setSubmitPressed(true);
              setCompleteWorkout(false);
              if (finishButtonVisibility) {
                routeStates?.viewFrom == true
                  ? () => {}
                  : // handleSubmit(
                    //   updatedExerciseStats,
                    //   exerciseArr,
                    //   userInput.kG,
                    //   userInput.repS,
                    //   userInput.resT,
                    //   timeElapses,
                    //   repsScores
                    // )
                    onViewSubmit();
              }
            }}
            alert={completeWorkout}
            headertitle="Workout"
            content={
              "Some of your sets are incomplete. Do you still want to mark this workout as completed?"
            }
            cancel={() => setCompleteWorkout(false)}
            cancelBtn="Not Yet"
            saveBtn="Yes"
            width={100}
          />
          {fieldsValidationModal ? (
            <AlertModal
              alert={fieldsValidationModal}
              onResume={() => setFieldValidationModal(false)}
              headertitle="Workout Incomplete"
              content={"Please fill all fields to complete workout"}
              cancelBtn=""
              saveBtn="Ok"
              width={100}
            />
          ) : null}
          {completeWorkoutResponse ? (
            <AlertModal
              alert={true}
              onResume={() => setCompleteWorkoutResponse("")}
              headertitle="Workout complete"
              content={completeWorkoutResponse}
              cancelBtn=""
              saveBtn="Ok"
              width={100}
            />
          ) : null}

          {/* {route.params.exerciseInfoData.map(item => ( */}

          {true && (
            <FlatList
              bounces={false}
              ListFooterComponent={() => {
                return (
                  <View>
                    {routeStates?.completedDay && (
                      <GradientButton
                        title={"  View Complete Info"}
                        onPress={() => {
                          navigation.navigate("Hiit complete 2", {
                            id: routeStates?.workoutId,
                            exLength: routeStates?.exerciseInfoData, //updatedExerciseStats
                            workoutTitle: routeStates?.workoutTitle,
                            backgroundImage: routeStates?.backgroundImage,
                            day: routeStates?.currentDay,
                            currentWorkoutHistory: currentWorkoutHistory,
                          });
                        }}
                        style={{
                          padding: 6,
                          paddingHorizontal: 10,
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          marginHorizontal: 20,
                          marginVertical: 20,
                        }}
                        textStyle={{ fontSize: 16 }}
                      />
                    )}
                    <View style={{ height: 100 }} />
                  </View>
                );
              }}
              getItemLayout={(data, index) => {
                return {
                  length: routeStates?.exerciseInfoData?.length,
                  index,
                  offset: 600 * routeStates?.index,
                };
              }}
              // initialScrollIndex={}
              // ref={refContainer}
              keyExtractor={(item, index) => index + ""}
              showsVerticalScrollIndicator={false}
              data={routeStates?.exerciseInfoData}
              renderItem={({ item, index }) => {
                const currentWorkout = updatedExerciseStats[index];
                const currentId = item?.exerciseId;
                const newScore = currentWorkout?.workoutScore || 0;
                const oldScore = currentWorkout?.scores || 0;

                const percentage = ((newScore / oldScore) * 100) / 100;
                // res= await usersService.getWorkoutScores(item?.exerciseId)

                return (
                  <View>
                    <>
                      {/* <ExerciseCard 
                        item={item}
                        index={index}
                        ref={videoPlayerRef}
                        infoData={route.params.exerciseInfoData}
                        workId={route?.params?.wId}
                        dayGoal={route.params.dayGoal}
                        dashboardKey={props.route.params.dashboard}
                        workoutid={props?.route?.params?.workoutId}
                        setWorkoutStatus={setWorkoutStatus}
                        onInfoButtonPressed={() =>
                          setExerciseGuideVisibility(true)
                        }
                        viewFrom={viewFrom}
                        currentlyPlayingVideoId={currentlyPlayingVideoId}
                        getCurrentlyPlayingVideoId={id =>
                          setCurrentlyPlayingVideoId(id)
                        }
                        navigationPath={props.navigation}
                      /> */}

                      {/* start of new component ======================== */}

                      <Text
                        style={{
                          alignSelf: "center",
                          fontWeight: "bold",
                          fontSize: 15,
                          marginBottom: 5,
                          marginTop: 25,
                        }}
                      >
                        {item?.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 5,
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          marginRight: 10,
                          marginVertical: 10,
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            RBSheetRef2?.current?.open();
                            setCurrentVideoPath(item?.exerciseVideo);
                          }}
                        >
                          <ImageBackground
                            source={{ uri: cdnPath + item.thumbImage }}
                            style={{
                              height: 60,
                              width: 110,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(0,0,0,0.5)",
                            }}
                          >
                            <PlayIcon />
                          </ImageBackground>
                        </TouchableOpacity>
                        {/* <View style={{ alignItems: "center" }}>
                        <TouchableOpacity style={{ alignItems: 'center' }}
                    
                        >
                          <InfoIconWithBorder />
                          <Text  >
                            Info
                          </Text>
                        </TouchableOpacity>
                      </View> */}
                        <View style={{ alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ alignItems: "center" }}
                            disabled={routeStates?.completedDay}
                            onPress={() =>
                          
                              navigation.navigate("ExerciseType", {
                                handleChange,
                                exerciseId: currentWorkout?.exerciseId,
                                exerciseName: item?.title,
                                currentIndex: index,
                                exerciseInfoData: routeStates?.exerciseInfoData,
                                wId: routeStates?.wId,
                                dashboard: routeStates?.dashboard,
                                workoutId: routeStates?.workoutId,
                                cWId: routeStates?.cWId,
                                cWorkWeek: routeStates?.cWorkWeek,
                                cPhase: routeStates?.cPhase,
                                index: 0,
                                day: routeStates?.day,
                                category: routeStates?.category,
                                viewFrom: true,
                                workoutTitle: routeStates?.workoutTitle,
                                backgroundImage: routeStates?.backgroundImage,
                                updatedExerciseStats,
                              })
                            }
                          >
                            <DoubleArrow />
                            <Text>Switch</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() =>
                              navigation.navigate("TrackDataScreen", {
                                title: item?.title,
                                category: 1 + 1,
                                type: 1,
                                exerciseId: item?.exerciseId,
                              })
                            }
                            // onPress={()=>{
                            //   return alert(JSON.stringify(item))
                            // }}
                          >
                            <Historyicon />
                            <Text>History</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() => {
                              setCurrentExrID(item?.exerciseId);
                              getNotes(item?.exerciseId);
                              RBSheetRef.current.open();
                            }}
                          >
                            {/* <View style={{ alignItems: "center" }}> */}
                            <Bookicon />
                            {/* </View> */}

                            <Text>Notes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                marginLeft: 45,
                                color: "rgba(189, 189, 189, 1)",
                                fontFamily: "Manrope-Regular",
                              }}
                            >
                              Volume
                            </Text>
                            <Text style={{ marginLeft: 10 }}>
                              {currentWorkout?.workoutScore?.toFixed() || 0}
                            </Text>
                            <TouchableOpacity
                              style={{ alignItems: "center", marginLeft: 5 }}
                              onPress={() => setShowModal1(true)}
                            >
                              <InfoIconWithBorder />
                            </TouchableOpacity>
                            <View style={{ flex: 1 }} />

                            <Text
                              style={{
                                marginRight: "10%",
                                marginLeft: 5,
                                color: "rgba(189, 189, 189, 1)",
                                fontFamily: "Manrope-Regular",
                              }}
                              numberOfLines={0}
                            >
                              Your best result{"   "}
                              <Text
                                style={{
                                  color: COLORS.black,
                                  fontFamily: "Manrope-Regular",
                                }}
                              >
                                {currentWorkout?.scores?.toFixed() || 0}
                              </Text>
                            </Text>
                          </View>
                          <View
                            style={{
                              alignSelf: "center",
                              marginTop: 10,
                              marginBottom: 10,
                            }}
                          >
                            <Progress.Bar
                              progress={percentage || 0}
                              width={320}
                              color={"rgba(12, 221, 153, 1)"}
                              height={4}
                              style={{
                                backgroundColor: "#D3D3D3",
                                borderWidth: 0,
                              }}
                            />
                          </View>
                        </View>
                      }
                      {/* end of new component ======================== */}
                      <View style={styles.contentContainer}>
                        <View style={styles.tableHeaderContainer}>
                          <View style={styles.separatorOne}>
                            <Text style={styles.tableColumnTitleTextStyle}>
                              Set
                            </Text>
                          </View>
                          <View style={styles.separatorTwo}>
                            <Text style={styles.tableColumnTitleTextStyle}>
                              {selectedUnit}
                            </Text>
                            <Text style={styles.tableColumnTitleTextStyle}>
                              Reps
                            </Text>
                            <Text style={styles.tableColumnTitleTextStyle}>
                              Rest
                            </Text>
                          </View>
                          <View style={styles.separatorThree}>
                            <Text style={styles.tableColumnTitleTextStyle}>
                              Done
                            </Text>
                          </View>
                        </View>
                        {/* <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}> */}
                        {setsArray(item).map((exer, indexx) => {
                          return (
                            <ExerciseDetailRow
                              key={indexx + 5}
                              setNumber={indexx + 1}
                              onDataUpdate={handleExerciseStats}
                              kG={userInput.kG}
                              repS={userInput.repS}
                              selectedUnit={selectedUnit}
                              resT={userInput.resT}
                              setUserInput={setUserInput}
                              exercise={item}
                              initialData={item.setInfo[exer - 1]}
                              setExerId={setExerId}
                              setInfo={exer}
                              disableCheck={routeStates?.completedDay}
                              onComplete={(state, stateID) => {
                                if (state) {
                                  ReactNativeHapticFeedback.trigger(
                                    "impactMedium",
                                    options
                                  );
                                  // Vibration.vibrate()
                                  debounceFn(
                                    updatedExerciseStats,
                                    index,
                                    currentId,
                                    radio,
                                    state,
                                    stateID,
                                    updatedExerciseStats[index].stats
                                  );
                                }
                              }}
                            />
                          );
                        })}
                        {/* </ScrollView> */}
                      </View>
                      {/* {setsArray(item)?.length ? <TouchableOpacity
                      onPress={() => {
                        addWorkoutScore(item, index, currentId)
                      }}
                      style={{
                        alignItems: "center", marginTop: 20, borderWidth: 1, padding: 12, marginHorizontal: 50, borderRadius: 20, borderColor: "rgba(12, 221, 153, 1)"
                      }}>
                      <Text style={{ fontSize: 15, fontWeight: "600", color: "rgba(12, 221, 153, 1)", }}>
                        Submit
                      </Text>
                    </TouchableOpacity> : null} */}
                    </>
                  </View>
                );
              }}
            />
          )}

          {/* <TouchableOpacity
            onPress={() => {
              if (finishButtonVisibility) {
                props?.route?.params?.viewFrom == true
                  ? handleSubmit(
                    exerciseArr,
                    userInput.kG,
                    userInput.repS,
                    userInput.resT,
                  )
                  : onViewSubmit();
              }
            }}
            style={{
              alignItems: "center", marginTop: 20, borderWidth: 1, padding: 12, marginHorizontal: 50, borderRadius: 20, borderColor: "rgba(12, 221, 153, 1)"
            }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "rgba(12, 221, 153, 1)", }}>
              Complete session
            </Text>
          </TouchableOpacity> */}
        </View>
        {/* </KeyboardAwareScrollView> */}
        <WarmUpGuideModal
          visible={warmupGuideVisibilty}
          close={() => setWarmupGuideVisibility(false)}
        />
        <ScoreInfoGuideModal
          visible={showModal1}
          close={() => setShowModal1(false)}
        />
        <ExerciseGuideModal
          visible={excerciseGuideVisibility}
          close={() => setExerciseGuideVisibility(false)}
        />
        <RBSheet
          ref={RBSheetRef2}
          height={Dimensions.get("window").height}
          openDuration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              // alignItems: "center"
            },
          }}
        >
          <View
            style={[{ flex: 1 }, Platform.OS === "ios" && { marginTop: 40 }]}
          >
            <TouchableOpacity
              onPress={() => RBSheetRef2.current?.close()}
              style={{ alignSelf: "flex-end", zIndex: 100 }}
            >
              <CrossIcon />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <ActivityIndicator
                size="large"
                animating={true}
                color={COLORS.lightGreen}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ height: "100%", width: "100%" }}>
                {currentVideoPath && (
                  <Video
                    source={{ uri: cdnPath + currentVideoPath }} // Can be a URL or a local file.
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                    }}
                    controls
                    // volume={.5}
                    // onLoadStart={()=>alert("load start")}
                    onLoad={({ naturalSize }) => {}}
                    muted={muted}
                    ignoreSilentSwitch={"ignore"}
                  />
                )}
                {/* <TouchableOpacity activeOpacity={0.8}
                  onPress={() => setMuted((prev) => !prev)}
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    flex: 1,
                    position:'absolute',
                    right:10
                    
                  }}
                >
                  <Octicons name={muted ? "mute" : 'unmute'}size={40} color={"#fff"} />
                 
                </TouchableOpacity> */}
              </View>
              <View></View>
            </View>
          </View>
        </RBSheet>
        <RBSheet
          ref={RBSheetRef}
          // height={300}
          height={Dimensions.get("window").height / 2}
          openDuration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              // alignItems: "center"
            },
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 30,
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "rgba(79, 79, 79, 1)",
                fontWeight: "700",
              }}
            ></Text>
            <TouchableOpacity onPress={() => RBSheetRef.current?.close()}>
              <CrossIcon />
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <TextInput
              style={styles.inputFieldTxt}
              placeholderTextColor="grey"
              placeholder="add title"
              onChangeText={setNoteTitle}
              name="confirmPassword"
              autoCapitalize="none"
              value={noteTitle}
            />
            <TextInput
              style={[
                styles.inputFieldTxt,
                {
                  height: 90,
                  marginTop: 10,
                },
              ]}
              placeholderTextColor="grey"
              placeholder="add your note"
              multiline={true}
              value={noteDescription}
              onChangeText={setNoteDescription}
            />
          </View>
          <View style={{ marginTop: "20%", marginHorizontal: 30 }}>
            <GradientButton title="Save " onPress={onSaveNote} />
          </View>
        </RBSheet>
        <ModalTester2 visible={showModal} onClose={() => setShowModal(false)} />
        <SubmitScoreModal
          title={SubmitScoreModalTxt}
          isVisible={showSubmitScoreModal}
          onConfirm={() => setshowSubmitScoreModal(false)}
        />
      </KeyboardAvoidingView>
    </MainScreen>
  );
});

export default ExerciseScreen;
const styles = StyleSheet.create({
  timerTextStyle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: COLORS.lightBlue,
  },
  backgroundVideo: {
    height: 100,
    width: 100,
  },
  startButtonContainer: {
    flexDirection: "row",
    // justifyContent: 'center',
    marginLeft: 20,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    // height: 100,
  },
  startTextStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 20,
    color: COLORS.lightGreen,
    textTransform: "uppercase",
    marginHorizontal: 5,
  },
  tableColumnTitleTextStyle: {
    fontFamily: "Manrope-Regular",
    color: COLORS.grey_4,
    fontSize: 13,
    lineHeight: 15,
    flex: 1,
    marginHorizontal: 5,
    textAlign: "center",
  },
  inputBoxStyle: {
    backgroundColor: "white",
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 5,
    paddingVertical: 10,
    borderColor: COLORS.grey_4,
    color: COLORS.grey_2,
    fontFamily: "Manrope-Regular",
    fontSize: 15,
  },
  inputBoxContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  contentContainer: {
    backgroundColor: COLORS.light_grey,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  tableHeaderContainer: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  submitButtonTextStyle: {
    fontFamily: "Manrope-SemiBold",
    fontSize: 15,
    color: COLORS.lightGreen,
    lineHeight: 20,
    textAlign: "center",
  },
  submitButtonViewStyle: {
    margin: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 35,
  },
  separatorOne: {
    flexDirection: "row",
    width: "15%",
  },
  separatorThree: {
    flexDirection: "row",
    width: "15%",
  },
  separatorTwo: {
    flexDirection: "row",
    width: "70%",
  },
  submitButtonStyle: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  submitButtonGradientStyle: {
    borderRadius: 30,
  },
  videoStyle: {
    width: "100%",
    height: Dimensions.get("window").height * 0.3125,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  inputFieldTxt: {
    borderRadius: 10,
    borderColor: COLORS.grey_5,
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
