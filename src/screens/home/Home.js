import React, {
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
  Dimensions,
  RefreshControl,
  Alert,
  AppState,
  BackHandler,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as RNIap from "react-native-iap";
import { useDispatch, connect } from "react-redux";
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import moment from "moment";
// import io from 'socket.io-client';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { DaysChallengeModal } from "../../components/DaysChallengeModal/DaysChallengeModal";
import { COLORS } from "../../common/Constant";
import { setWorkoutActivityCount } from "../../_action/WorkoutAction";
import { Loader } from "../../common/Loader";
import ExpiredModal from "./Modal";
import ExistingUsermodal from "./ExistingUsermodal";
import {
  CalenderIcon,
  InfoIcon,
  PenIcon,
  RightArrowIcon,
  ChatIcon,
  CaloriesIcon,
  MoonIcon,
  StepsIcon,
  WorkOutIcon,
  SmallArrowIcon,
  PlayIcon,
  PlayIconVideo,
  CrossIcon,
  DropdownIcon,
} from "../../Svg";
import ProgressIndicator from "../../components/ProgressIndicator";
import GradientButton from "../../components/GradientButton";
import CollapsableContainer from "../../components/CollapsableContainer";
import {
  onToggleCollapsableStatus,
  saveTokenRequest,
} from "../../_action/CommonAction";
import ImageCarousel from "../../components/ImageCarousel";
import { Stats } from "../statics/Stats";
import { getActivityAction } from "../../_action/FitnessAction";
import ProgressBar from "../../components/progress/ProgressBar";
import { getQuestionnaireAction } from "../../_action/QuestionnaireAction";
import CaloriesAndProteinProgress from "../../components/CaloriesAndProteinProgress";
import {
  getDailyFoodPlanAction,
  getDailyFoodTarget,
  getFoodPreferences,
} from "../../_action/FoodAction";
import setting from "../../config/settings";
import { getProfileAction } from "../../_action/ProfileAction";
import { logoutAction } from "../../_action/AuthAction";
import { MainScreen } from "../../common/Screen";
import {} from "react-native-gesture-handler";
import { usersService } from "../../services/ApiServices";
import { getWorkoutProgramme } from "../../_action/WorkoutAction";
import { getChat, getChatHistory } from "../../_action/CommunityAction";
import { Skeleton } from "../../common/Skeleton";
import AlertModal from "../modal/AlertModal";
import ScoreModal from "../statics/ScoreModal";
import { images } from "../../utils/images";
import { getMembershipPlan } from "../../_action/MembershipActions";
import { iapAction } from "../../_action/InappPurchaseAction";
import { BottomToast } from "../../components/toasts//BottomToast";
import settings from "../../config/settings";
import RBSheet from "react-native-raw-bottom-sheet";
import Video from "react-native-video";
import { createThumbnail } from "react-native-create-thumbnail";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const PERSISTENCE_KEY = "NAVIGATION_STATE";
var screen = "";
const Home = React.memo(function Home(props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let dispatch = useDispatch();
  // const socketRef = useRef();
  const appState = useRef(AppState.currentState);
  let mediaPath = setting.cdnUrl.url;
  const [checkForSubscription, setCheckForSubscription] = useState(true);
  const [receiptValid, setreceiptValid] = useState(true);
  const food = useSelector((state) => state?.food);
  const [challengeModalVisibility, setChallengeModalVisibility] = useState();
  const [totalCalories, setTotalCalories] = useState();
  const [totalProtein, setTotalProtein] = useState();
  const [challange, setChallange] = useState();
  const [onStart, setOnStart] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [countDays, setCountDays] = useState();
  const [isLeaderboardContainerOpened, setLeaderboardContainer] =
    useState(true);
  const [customizedAlertModal, setCustomizedAlertModal] = useState({
    headertitle: "",
    alertMessage: "",
    onCancel: () => {},
    onConfirm: () => {},
  });
  const [singinModalVisibility, setSigninModalVisibility] = useState(false);
  const [startChallenge, setStartChallenge] = useState(false);
  const [start, setStart] = useState(false);

  const [getWorkout, setWorkout] = useState();
  const [leaderBoardData, setLeaderBoardData] = useState();
  const [leaderBoardOpen, setLeaderBoardDataOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [count, setCount] = useState(count > 0 ? count : 0);
  const [weekGoalData, setWeekGoalData] = useState();
  const [skeleton, setSkeleton] = useState(false);
  const [progressBaarPercentege, setProgressBarPercentage] = useState();
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [alertCaloriesModal, setAlertCaloriesModal] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [scoreBarPercentage, setScorebarPercentage] = useState();
  const [weeklyData, setWeeklyData] = useState();
  const [weeklyDataInMin, setWeeklyDataInMin] = useState();
  const [dailyContent, setDailyContent] = useState(null);
  // const QuestionnaireData = useSelector(state => state.questReducer.QuestionnaireData?.data?.responseData?.result)
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData?.userProfile
  );

  const getProfileStatus = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData
  );

  const profileStatus = useSelector(
    (state) => state?.profileReducer?.profile?.data?.statusCode
  );
  const getCollapsableData = useSelector(
    (state) => state?.commonReducer?.collapsibleData
  );
  const dailyFoodTarget = useSelector((state) => state.food?.dailyFoodTarget);
  const workoutPhase = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData?.result
  );
  const { loading, data } = useSelector(
    (state) => state?.workout?.workoutProgramme
  );
  const userChat = useSelector((state) => state?.community?.getChat?.result);
  const socketUrl = setting.socketDevUrl.url;
  let cdnPath = settings.cdnUrl.url;
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      userfitnessInfo: "",
      dailySteps: 0,
      googleDailyStep: 0,
      stepsData: 0,
      sleepData: 0,
      workoutData: 0,
      caloriesData: 0,
      googleStepsData: 0,
      googleCaloriesData: 0,
      googleActivityData: 0,
      googleSleepData: 0,
      googleWorkoutData: 0,
      questionnaireData: "",
      startDateStr: "",
      endDateStr: "",
      endDateMonth: "",
      monthlySteps: [],
      graphStepsDate: [],
      recentWeeklySteps: 0,
      weeklySteps: 0,
      recentStepsWeeklyArr: [],
      recentStepsWeeklyDate: [],
      stepsWeeklyArr: [],
      stepsWeeklyDate: [],
      weeklySleepData: [],
      monthlySleepData: [],
      googleStepsWeekData: [],
      googleStepsWeekDate: [],
      googleWeekAvgSteps: 0,
      pre3monthOfStepsData: [],
      avg3MonthofSteps: 0,
      prev3MonthOfSleepData: [],
      monthlyAvgSteps: 0,
      googleWeeklyStepsDate: [],
      googleMonthlyStepsData: [],
      google3MonthOfStepsData: [],
      googleMonthlySleepData: [],
      google3MonthSleepData: [],
      googleWeeklySleepData: [],
      hours: 0,
      minutes: 0,
    }
  );
  const RBSheetRef2 = useRef();
  useEffect(() => {
    getToken();
  }, []);
  useEffect(() => {
    if (isFocused) {
      //  getPurchaseHistory();
    }
  }, [isFocused]);
  console.log("fast", getProfileData?.planName);

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await usersService.getProfile();
      console.log("zakoota", response?.data?.responseData?.userProfile);

      AsyncStorage.setItem(
        "user_id",
        response?.data?.responseData?.userProfile._id + ""
      );
      // if (
      //   response?.data?.responseData?.userProfile?.planName == 'Free' ||
      //   response?.data?.responseData?.userProfile?.planId ==
      //     '6309da0e7de542001b93a996'
      // ) {
      //   console.log('takapaka', response);
      //   setreceiptValid(false);
      // } else {
      //   console.log('takapaka2', response?.data?.responseData?.userProfile);
      // }
    }

    fetchMyAPI();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, [isFocused]);

  const handleBackButtonClick = async () => {
    const focus = navigation.isFocused();
    return !focus;
    // if (focus) {
    //  return false
    // }else{
    //   return true
    // }
  };

  const getToken = async () => {
    try {
      const fcmToken = await messaging().getToken();

      if (fcmToken) {
        saveToken(fcmToken);
        console.log(("neeraj the new token", fcmToken));
      }

      messaging().onTokenRefresh((token) => {
        saveToken(token);
      });
    } catch (error) {
      console.log(error, "neeraj error in token");
    }
  };

  async function getMembership() {
    let req = {
      userId: getProfileData?._id,
    };

    dispatch(getMembershipPlan(req))
      .then((res) => {
        if (res.data.statusCode === 1) {
          let item = res.data.responseData.result.find(
            (item) => item.planName.toLowerCase() == "free"
          );

          downgradeToFreeUser(item._id);
        } else {
        }
      })
      .catch(() => {});
  }
  const validReceiotCallback = () => {
    if (getProfileData?.downgraded) {
      Alert.alert(
        "Alert",
        "Please contact administrator to upgrade your membership!",
        [
          {
            text: "Close",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          // {text: 'Close', onPress: () => onChallange()},
        ],
        {
          cancelable: false,
        }
      );
    } else {
      navigation.navigate("Membership");
      // setreceiptValid(true);
    }
  };

  useEffect(() => {
    // console.log({QuestionnaireData})
    // if (isFocused) {
    //   if (getProfileData?.planName == 'Free') {
    //     setreceiptValid(false);
    //   }
    // }
  }, []);

  const downgradeToFreeUser = (planId) => {
    let req = {
      userId: getProfileData?._id,
      iap_prod_id: "",
      planId: planId,
      transactionId: "",
      startDate: "",
      endDate: "",
      isPremium: 0,
    };

    dispatch(iapAction(req))
      .then((res) => {
        if (res.data.statusCode === 1) {
          setCheckForSubscription(false);
          dispatch(getProfileAction());
        }
      })
      .catch((err) => {
        alert(err);
        props.setLoader(false);
      });
  };

  const saveToken = (token) => {
    usersService
      .saveFcmToken({
        deviceToken: token,
      })
      .then((response) => {})
      .catch((err) => {});
  };

  useEffect(async () => {
    getData();
    dispatch(getWorkoutProgramme());

    if (getProfileData?.planName !== "Free") {
      getWorkoutProgrammes();

      // socketRef.current.on('message', data => {
      //   setCount(count + 1);
      // });
    }
  }, [profileStatus, count, dailyFoodTarget?.caloriesTarget, navigation]);

  useEffect(() => {
    if (props?.route?.params?.navigateTo) {
      navigationToStepsScreen();
    }
  }, [props?.route?.params]);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500); // 6000
  }, []);

  useEffect(() => {
    return () => {
      RNIap.endConnection();
    };
  }, []);

  //   useEffect(() => {
  //     console.log
  // dispatch(getProfileAction());
  //   }, []);
  useEffect(() => {
    console.log("bros", getProfileData?.isFreeUser);

    RNIap.initConnection()
      .catch(() => {})
      .then(() => {
        //   if (getProfileData?.isFreeUser == true) {
        //     setreceiptValid(false);
        //   }
        // else if (getProfileData?.isActivePaidUser == false) {
        //     setreceiptValid(false);
        //   }
      });
  }, [getProfileData]);

  useEffect(() => {
    //  if (getProfileData?.isFreeUser == true) {
    //    setreceiptValid(false);
    //  } else if (getProfileData?.isActivePaidUser == false) {
    //    setreceiptValid(false);
    //  }
  }, []);
  useEffect(async () => {
    let accessToken = await AsyncStorage.getItem("accessToken");
    // socketRef.current = io(socketUrl, {
    //   query: {accessToken: accessToken},
    //   transports: ['websocket'],
    // });
  }, []);
  let workout = data?.data?.responseData?.result;
  const goalData = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo
  );
  const [refreshing, setRefreshing] = React.useState(false);
  let workoutArr = [];
  if (data?.data?.statusCode == 1) {
    var day = 1;
    workoutArr = workout.phase.map((val) => {
      return { ...val, day: day++, dayGoals: goalData?.dayGoal };
    });
  }

  useEffect(() => {
    if (goalData?.workoutPhase == 1) {
      setWeekGoalData(workout?.phase[0]?.workoutPerWeek);
    }
    if (goalData?.workoutPhase == 2) {
      setWeekGoalData(workout?.phase[0]?.workoutPerWeek);
    }
    if (goalData?.workoutPhase == 3) {
      setWeekGoalData(workout?.phase[0]?.workoutPerWeek);
    }
  }, [navigation, goalData?.workoutPhase]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setToken();
    getData();
    wait(2000).then(() => setRefreshing(false));
  }, [
    userInput?.stepsData,
    userInput?.sleepData,
    userInput?.workoutData,
    userInput?.googleWorkoutData,
    userInput?.userfitnessInfo?.calories,
    userInput?.caloriesData,
    userInput?.googleStepsData,
    userInput?.googleSleepData,
    userInput?.googleCaloriesData,
    userInput?.dailySteps,
    userInput?.googleDailyStep,
    dailyFoodTarget?.caloriesTarget,
  ]);

  // useEffect(() => {
  //   let {
  //     stepsData,
  //     sleepData,
  //     userfitnessInfo,
  //     googleStepsData,
  //     googleSleepData,
  //     stepsWeeklyDate,
  //     googleWeeklyStepsDate,
  //   } = userInput;

  //   if (Platform.OS === 'ios') {
  //     let weekStart =
  //       stepsWeeklyDate?.length !== 0
  //         ? moment(stepsWeeklyDate[0]?.startDate).format('D MMM')
  //         : moment().subtract(6, 'days').startOf('day').format('D MMM');
  //     let weekEnd =
  //       stepsWeeklyDate?.length !== 0
  //         ? moment(
  //             stepsWeeklyDate[stepsWeeklyDate?.length - 1]?.startDate,
  //           ).format('D MMM')
  //         : moment().endOf('week').format('D MMM');
  //     setUserInput({startDateStr: weekStart});
  //     setUserInput({endDateStr: weekEnd});
  //     setUserInput({endDateMonth: moment().year()});
  //   } else {
  //     let weekStartGoogle =
  //       googleWeeklyStepsDate.length !== 0
  //         ? moment(googleWeeklyStepsDate[0]?.startDate).format('D MMM')
  //         : moment().subtract(6, 'days').startOf('day').format('D MMM');
  //     let weekEndGoogle = moment().endOf('week').format('D MMM');
  //     setUserInput({startDateStr: weekStartGoogle});
  //     setUserInput({endDateStr: weekEndGoogle});
  //     setUserInput({endDateMonth: moment().year()});
  //   }
  // }, [
  //   userInput?.stepsData,
  //   userInput?.sleepData,
  //   userInput?.workoutData,
  //   userInput?.googleWorkoutData,
  //   userInput?.userfitnessInfo?.calories,
  //   userInput?.caloriesData,
  //   userInput?.googleStepsData,
  //   userInput?.googleSleepData,
  //   userInput?.googleCaloriesData,
  //   dailyFoodTarget?.caloriesTarget,
  // ]);

  useEffect(() => {
    dispatch(setWorkoutActivityCount(userInput?.workoutData));
  }, [userInput?.workoutData]);

  useEffect(() => {
    var current = new Date(); // get current date
    var weekstart = current.getDate() - current.getDay() + 1;
    var weekend = weekstart + 6; // end day is the first day + 6
    var monday = new Date(current.setDate(weekstart));
    var sunday = new Date(current.setDate(weekend));
    var startDate = moment(monday).format("D MMM");
    var endDate = moment(sunday).format("D MMM");
    setUserInput({ startDateStr: startDate });
    setUserInput({ endDateStr: endDate });
    setUserInput({ endDateMonth: moment().year() });
    // console.log("start bdate",startDate);
  }, []);

  const resetAction = CommonActions.reset({
    routes: [{ name: "SignIn" }],
  });

  async function setToken() {
    const token = await AsyncStorage.getItem("accessToken");
    axios.defaults.headers.common.AccessToken = token;
    dispatch(getProfileAction());
  }

  async function getData() {
    if (profileStatus === 1) {
      getActivityinfo();
      getQuestionnaireData();
      dispatch(getDailyFoodTarget());
      dispatch(getFoodPreferences());
      dispatch(getDailyFoodPlanAction());
      getLeaderBoardData();
    }
    if (profileStatus === 0) {
      setTimeout(() => {
        setCustomizedAlertModal({
          headertitle: "Something went wrong",
          alertMessage: "Please sign in again",
          onCancel: () => onCancelCustomizedAlert(),
          onConfirm: () => {
            dispatch(logoutAction());
            onCancelCustomizedAlert();
          },
          allowConfirmButton: false,
          cancelBtn: "Cancel",
          saveBtn: "Sign In",
        });
      }, 9000);
    }
  }
  useEffect(async () => {
    const responseDaily = await usersService.getDailyContentToday();
    console.log("responseDaily", responseDaily?.data?.responseData);
    if (responseDaily?.data?.responseData.result != null) {
      // setDailyContent({
      //   ...responseDaily?.data?.responseData?.result,
      //   image:cdnPath + responseDaily?.data?.responseData?.result.video,
      // });
      createThumbnail({
        url: cdnPath + responseDaily?.data?.responseData?.result.video,
        timeStamp: 10000,
      })
        .then((response) => {
          setDailyContent({
            ...responseDaily?.data?.responseData?.result,
            image: response.path,
          });
        })
        .catch((err) => console.log({ err }));
    }
    //
  }, []);

  const getWorkoutProgrammes = async () => {
    let req = {
      isChallenge: 1,
    };
    try {
      const res = await usersService.getWorkoutProgrammes(req);

      console.log("60 days challenge here", res.data);
      setChallange(res?.data?.responseData?.result[0]);
      setWorkout(res?.data?.responseData?.myWorkoutProgramme);
    } catch (e) {
      console.error("error ", e);
    }
  };

  function getActivityinfo() {
    let req = {
      deviceName: Platform.OS === "ios" ? "apple" : "fitbit",
      day: "1",
    };
    dispatch(getActivityAction(req)).then((res) => {
      console.log("res.data.responseData.fitbitData", JSON.stringify(res.data));
      if (res.data.statusCode === 1) {
        setUserInput({ userfitnessInfo: res.data.responseData.fitbitData });
      } else {
      }
    });
  }

  function getQuestionnaireData() {
    dispatch(getQuestionnaireAction());
  }

  let { googleSleepData, hours, minutes } = userInput;

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getChat());
      getLeaderBoardData();
    }, [profileStatus])
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getDailyFoodTarget());
      if (!userInput?.dailySteps || !getProfileData) {
        // setSkeleton(true);
      } else {
        // setSkeleton(false);
      }
    }, [profileStatus, dailyFoodTarget?.caloriesTarget])
  );

  useEffect(() => {
    let canAndProtein = food?.dailyFoodPlan?.mealsInfo?.filter(
      (e) => e.foodType !== ""
    );
    var totalCal = canAndProtein?.reduce((total, cal) => {
      return total + cal?.calories;
    }, 0);

    setTotalCalories(totalCal || 0);
    var totalPro = canAndProtein?.reduce((total, cal) => {
      return total + cal?.proteins;
    }, 0);
    setTotalProtein(totalPro || 0);
  }, [profileStatus, food?.dailyFoodPlan]);
  //console.log('bigger', getProfileData);
  useEffect(() => {
    if (challange != undefined && getProfileData?.isChallenge === 1) {
      let c = moment(challange?.startDate);
      let d = moment().format("l");
      let date = c.diff(d, "days");
      let momentDate = moment().format("YYYY/MM/DD");
      let startDate = moment(challange?.startDate).format("YYYY/MM/DD");
      let endDate = moment(challange?.endDate).format("YYYY/MM/DD");

      // console.log('start date cominggx===',startDate);

      // if (date <= 14 && date > 0) {
      //   setOnStart(true);
      //   setCountDays(date);
      // }

      //     console.log('moment CHALLENGE COMING========',challange);
      //     console.log('moment comingg=====',moment().format('DD/MM/YYYY'));
      //     console.log(' moment start dat=====',moment(challange?.startDate).format('YYYY-MM-DD'))
      if (
        moment(momentDate).isBefore(moment(endDate)) ||
        moment(momentDate).isSame(moment(endDate))
      ) {
        if (moment(momentDate).isBefore(moment(startDate))) {
          if (date <= 14 && date > 0) {
            setChallengeStarted(false);
            setOnStart(true);
            setCountDays(date);
          }
        } else if (
          moment(startDate).isSame(momentDate) ||
          moment(startDate).isBefore(momentDate)
        ) {
          setChallengeStarted(true);
          setOnStart(true);
          setCountDays(moment().diff(c, "days"));
        } else {
        }
      }
    }
  }, [navigation, profileStatus, challange]);

  useEffect(() => {
    let a = moment(challange?.startDate).format("L");
    let b = moment().format("L");
    // let c = moment(challange?.endDate).format('L');
    // console.log('a neeraj===',a);
    // console.log('b neeraj===',b);

    if (a === b || b > a) {
      setStartChallenge(true);
      setOnStart(false);
    } else if (a !== b) {
      setStartChallenge(false);
    }
  }, [navigation, challange, profileStatus]);

  const onChallange = async () => {
    try {
      var param = {
        isChallenge: "1",
        programmeId: challange?._id,
      };
      const res = await usersService.setMyWorkoutProgrammes(param);
      if (res.data.statusCode === 1) {
        dispatch(getWorkoutProgramme());
        dispatch(getProfileAction());
        getWorkoutProgrammes();
        setStartChallenge(true);
        setStart(true);
        setChallengeModalVisibility(false);

        setCustomizedAlertModal({
          headertitle: "Success",
          alertMessage:
            "Congrats! You have joined the next 60 Day Challenge 🎉",
          onCancel: () => onCancelCustomizedAlert(),
          onConfirm: () => {
            onCancelCustomizedAlert();
          },
          allowConfirmButton: false,
          cancelBtn: "",
          saveBtn: "Ok",
        });
      }
    } catch (error) {
      console.error("error ", error);
    }
  };

  useEffect(() => {
    if (userChat) {
      if (
        String(userChat[0]?.userId?._id) === String(userChat[0]?.unreadUserId)
      ) {
        setCount(userChat[0]?.count);
      }
    }
  }, []);

  const onInbox = async () => {
    let req = {
      groupId: userChat[0]?._id,
    };

    dispatch(getChatHistory(req));
    navigation.navigate("Chat with Coach", {
      fromHome: true,
      planName: "Premium",
    });
    let response = await usersService.chatHistory(req);
    if (response?.data?.statusCode === 1) {
      await AsyncStorage.setItem(
        "Image",
        mediaPath + getProfileData?.profileImage
      );
      setCount(0);
    }
  };

  const onChatFeature = () => {
    // setCustomizedAlertModal({
    //   headertitle: 'Chat feature',
    //   alertMessage:
    //     'To access the trainer chat feature, please upgrade your membership plan to premuim.',
    //   onCancel: () => onCancelCustomizedAlert(),
    //   onConfirm: () => {
    //     onCancelCustomizedAlert();
    //     navigation.navigate('Membership');
    //   },
    //   cancelBtn: 'Cancel',
    //   saveBtn: 'Yes',
    // });

    navigation.navigate("Chat with Coach", {
      fromHome: true,
      planName: "Free",
    });
  };

  // const onChatFeature = async() => {
  //   let req = {
  //     groupId: userChat[0]?._id,
  //   };

  //   dispatch(getChatHistory(req));
  //   navigation.navigate('Chat with Coach', {fromHome: true,planName:'Free'});
  //   let response = await usersService.chatHistory(req);
  //   if (response?.data?.statusCode === 1) {
  //     await AsyncStorage.setItem(
  //       'Image',
  //       mediaPath + getProfileData?.profileImage,
  //     );
  //     setCount(0);
  //   }
  // };

  // console.log('challenge neeraj comingg===',challange);
  // console.log('ischallenge neeraj comingg===',getProfileData?.isChallenge);
  // console.log('challenge started neeraj comingg===',startChallenge);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        getProfileData?.planName === "Premium" ? (
          <TouchableOpacity style={{ padding: 5 }} onPress={() => onInbox()}>
            <ChatIcon />
            <Text
              style={{
                position: "absolute",
                fontSize: 11,
                color: COLORS.white,
                marginLeft: 24,
                marginTop: 5,
                fontFamily: "Manrope-ExtraBold",
              }}
            >
              {count == 0 ? null : count}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => onChatFeature()}
          >
            <ChatIcon />
            <Text
              style={{
                position: "absolute",
                fontSize: 11,
                color: COLORS.white,
                marginLeft: 24,
                marginTop: 5,
                fontFamily: "Manrope-ExtraBold",
              }}
            >
              {count == 0 ? null : count}
            </Text>
          </TouchableOpacity>
        ),
    });
  });

  function getLeaderBoardData() {
    // setSkeleton(true);
    usersService.getLeaderBoardData().then((res) => {
      if (res?.data?.statusCode === 1) {
        // setSkeleton(false);
        setLeaderBoardData(res?.data?.responseData?.result);
      }
    });
  }

  // handle progress bar value calculation and updates
  const [progressBarValue, setProgressBarValue] = useState(0);
  useEffect(() => {
    if (!getProfileData) return;
    const {
      dailySteps,
      googleDailyStep,
      sleepData,
      weeklySteps,
      googleStepsData,
      weeklySleepData,
      googleWeeklySleepData,
    } = userInput;
    const { stepsGoal, sleepGoal, myDiet } = getProfileData;
    var calAvg = myDiet > 4 ? 4 * 6.25 : myDiet * 6.25;
    calAvg = calAvg ? calAvg : 0;

    // console.log('calavg gettingg====',calAvg)
    // console.log('workout current data comong=====',(getProfileData?.totalWorkout + userInput?.workoutData));
    // console.log('getProfileData.workoutGoal data comong=====',getProfileData.workoutGoal);

    if (
      getProfileData?.totalWorkout + (userInput?.workoutData || 0) <=
      getProfileData.workoutGoal
    ) {
      var workoutAvg =
        ((getProfileData?.totalWorkout + (userInput?.workoutData || 0)) * 25) /
        getProfileData.workoutGoal;
      workoutAvg = workoutAvg ? workoutAvg : 0;
    } else {
      var workoutAvg =
        (getProfileData?.workoutGoal * 25) / getProfileData.workoutGoal;
      workoutAvg = workoutAvg ? workoutAvg : 0;
    }

    // console.log('workout avg coming===',workoutAvg);

    var stepAvg;
    var sleepAvg;
    if (Platform.OS === "ios") {
      if (weeklySteps <= stepsGoal) {
        stepAvg = (weeklySteps * 25) / stepsGoal;
      } else {
        stepAvg = (stepsGoal * 25) / stepsGoal;
      }

      // console.log('weekly data coming==',weeklyData);
      // console.log('sleep goal data coming==',sleepGoal);
      if (weeklyData <= sleepGoal) {
        sleepAvg = (weeklyData ? weeklyData?.toFixed(2) * 25 : 0) / sleepGoal;
      } else {
        sleepAvg = (sleepGoal?.toFixed(2) * 25) / sleepGoal;
      }
    } else {
      // console.log('googleStepsData===',googleStepsData);
      // console.log('steps goal===',stepsGoal);
      // console.log('googleSleepData===',hours);
      // console.log('sleepGoal goal===',sleepGoal);
      if (googleStepsData <= stepsGoal) {
        stepAvg = (googleStepsData * 25) / stepsGoal;
      } else {
        stepAvg = (stepsGoal * 25) / stepsGoal;
      }
      if (hours <= sleepGoal) {
        sleepAvg = (hours * 25) / sleepGoal;
      } else {
        sleepAvg = (sleepGoal * 25) / sleepGoal;
      }
    }
    stepAvg = stepAvg ? stepAvg : 0;
    sleepAvg = sleepAvg ? sleepAvg : 0;
    // console.log('step avg coming==',stepAvg)
    // console.log('sleep avg coming==',sleepAvg);
    // console.log('progress va;ue====',calAvg + workoutAvg + stepAvg + sleepAvg)
    setProgressBarValue((calAvg + workoutAvg + stepAvg + sleepAvg) / 100);
    let barPercentage = calAvg + workoutAvg + stepAvg + sleepAvg;
    let scorePercentage = parseInt(barPercentage) / 10;
    // console.log('bar percentage coming====',barPercentage);

    if (scorePercentage) setScorebarPercentage(Math.round(scorePercentage));
    let scoreBarpercentage;
    setProgressBarPercentage(barPercentage);
    console.log("every time");
  }, [getProfileData?.stepsGoal, dailyFoodTarget?.caloriesTarget, weekGoalData, getProfileData?.sleepGoal, userInput?.dailySteps, userInput?.googleDailyStep, totalCalories, goalData?.weekGoal, userInput?.sleepData, googleSleepData]);

  // duration in hours

  useEffect(() => {
    if (Platform.OS == "android") {
      if (userInput?.googleSleepData) {
        // var hour = parseInt(userInput?.googleSleepData.asHours());
        setUserInput({ hours: Math.floor(userInput?.googleSleepData / 60) });
        // duration in minutes
        // var minute = parseInt(userInput?.googleSleepData.asMinutes()) % 60;
        setUserInput({ minutes: Math.floor(userInput?.googleSleepData % 60) });
      }
    } else {
      if (userInput?.sleepData) {
        var hour = parseInt(userInput?.sleepData / 60);

        setUserInput({ hours: hour });
        // duration in minutes
        var minute = parseInt(userInput?.sleepData % 60);
        setUserInput({ minutes: minute });
      }
    }
  }, [userInput?.googleSleepData, userInput?.sleepData]);

  const onTargetGoal = (id) => {
 
    // return
    if (id === 1) {
      setAlertContent(
        "To access the food section, please complete the questionnaire first."
      );
      setAlertCaloriesModal(true);
    } else {
      setAlertContent(
        "To access the workout section, please complete the questionnaire first."
      );
      setAlertCaloriesModal(true);
    }
  };
  const onDiet = async () => {
    await AsyncStorage.setItem("fromHomeTab", "true");
    navigation.navigate("FoodTab");
  };

  const onGoBack = () => {
    setAlertCaloriesModal(false);
    // navigation.navigate("HomeTab")
  };

  const onOkay = () => {
    setAlertCaloriesModal(false);
    navigation.navigate("Questionnaire");
  };

  const onCancelCustomizedAlert = () => {
    setChallengeModalVisibility(false);
    setCustomizedAlertModal({
      headertitle: "",
      alertMessage: "",
      onCancel: () => {},
      onConfirm: () => {},
      cancelBtn: "",
      saveBtn: "",
    });
  };

  const onJoinButtonPressed = () => {
    setCustomizedAlertModal({
      headertitle: "Workout programme",
      alertMessage:
        "Would you like to change your workout programme and follow the 60 Day Challenge one I've created?",
      onCancel: () => onCancelCustomizedAlert(),
      onConfirm: () => {
        onChallange();
        onCancelCustomizedAlert();
      },
      cancelBtn: "No",
      saveBtn: "Yes",
    });

    // Alert.alert(
    //   'Alert',
    //   'Would you like to change your workout programme and follow the 60 Day Challenge one I\'ve created?',
    //   [
    //     {
    //       text: 'No',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'Yes', onPress: () => onChallange()},
    //   ],
    //   {
    //     cancelable: false,
    //   },
    // );
  };

  const onScore = () => {
    navigation.navigate("Score", {
      dailySteps:
        Platform.OS == "ios"
          ? userInput?.weeklySteps
          : userInput?.googleStepsData,
      totalCalories:
        dailyFoodTarget?.caloriesTarget == undefined
          ? 0
          : dailyFoodTarget?.caloriesTarget,
      sleepData: weeklyData,
      minute: weeklyDataInMin,
      startDate: userInput?.startDateStr,
      endDate: userInput?.endDateStr,
      progressBarValue: progressBarValue,
      progressBaarPercentege: progressBaarPercentege,
      workout: userInput?.workoutData,
      scoreBarPercentage: scoreBarPercentage,
      workoutGoal: getProfileData?.workoutGoal,
      workoutData: userInput?.workoutData,
    });
  };

  useEffect(() => {
    let weeklysleep =
      Platform.OS == "ios"
        ? userInput?.weeklySleepData
        : userInput?.googleWeeklySleepData;
    if (weeklysleep?.length !== 0) {
      let minuteSum = 0;
      weeklysleep?.map((item, index) => {
        let endDate = moment(item.endDate);
        let startDate = moment(item.startDate);

        var minutesDuration = parseFloat(
          moment.duration(endDate.diff(startDate)).asMinutes()
        );
        minuteSum = minuteSum + minutesDuration;
      });
      let devidedBy;
      if (new Date().getDay() === 0) {
        devidedBy = 7;
      } else {
        devidedBy = new Date().getDay();
      }
      // let devidedBy = weeklysleep?.length < new Date().getDay()?new Date().getDay(): weeklysleep?.length;
      setWeeklyData(Math.floor(minuteSum / devidedBy / 60));
      setWeeklyDataInMin(Math.round((minuteSum / devidedBy) % 60));
    }
  }, [userInput?.weeklySleepData, userInput?.googleWeeklySleepData]);

  const renderChallengeTime = () => {
    if (challengeStarted) {
      return (
        <View style={styles.challengeContainerStyle}>
          <Text style={styles.challengeText}>
            {`Day ${countDays + 1} of ${challange?.title}`}
          </Text>
        </View>
      );
    } else if (onStart) {
      return (
        <View style={styles.challengeContainerStyle}>
          <Text style={styles.challengeText}>
            {countDays == 1
              ? countDays + " Day before the " + challange?.title + " begins"
              : countDays + " Days before the " + challange?.title + " begins"}
          </Text>
        </View>
      );
    }
  };

  const calculateWorkoutPercentage = () => {
    if (getProfileData?.totalWorkout && getProfileData?.workoutGoal) {
      return (
        ((getProfileData?.totalWorkout + (userInput?.workoutData || 0)) /
          getProfileData?.workoutGoal) *
        100
      );
    } else {
      return 0;
    }
  };

  const renderProgressBarColor = (value) => {
    if (value >= 80 && value <= 120) {
      return "#00FF00";
    } else if (value < 80) {
      return "orange";
    } else {
      return "orange";
    }
  };

  const navigationToStepsScreen = () => {
    navigation.navigate("Steps", {
      steps:
        Platform.OS == "ios"
          ? userInput?.dailySteps || 8880
          : userInput?.googleDailyStep || 0,
      avgSteps: userInput?.monthlyAvgSteps || 0,
      monthSteps: userInput?.monthlySteps || [],
      weekAvgData: userInput?.recentWeeklySteps || [],
      weekStepsDate: userInput?.recentStepsWeeklyDate || [],
      weeklyValue: userInput?.recentStepsWeeklyArr || [],
      monthOf3AvgSteps: userInput?.avg3MonthofSteps || 0,
      on3MonthStepsDataArr: userInput?.pre3monthOfStepsData || [],
      googleMonthlyStepsData: userInput?.googleMonthlyStepsData || [],
      google3MonthOfStepsData: userInput?.google3MonthOfStepsData || [],
    });
  };

  const changeMemershipModal = () => {
    setCustomizedAlertModal({
      headertitle: "Upgrade Plan",
      alertMessage: "To access this feature, please upgrade your account",
      onConfirm: () => {
        props.navigation.navigate("Membership");
        onCancelCustomizedAlert();
      },
      cancelBtn: "Cancel",
      saveBtn: "Ok",
    });

    // Alert.alert(
    //   'Upgrade Plan',
    //   'To access this feature, please upgrade to premium',
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'OK', onPress: () => props.navigation.navigate('Membership')},
    //   ],
    //   {
    //     cancelable: false,
    //   },
    // );
  };

  const onUserLogout = () => {
    setCustomizedAlertModal({ headertitle: "session_timeout" });
  };

  useEffect(() => {
    console.log(
      "customizedAlertModal.headertitle",
      customizedAlertModal.headertitle
    );
    //customizedAlertModal.headertitle === 'session_timeout' && dispatch(logoutAction());
    customizedAlertModal.onConfirm();
    onCancelCustomizedAlert();
  }, [customizedAlertModal.headertitle]);

  return (
    <MainScreen>
      <AlertModal
        alert={alertCaloriesModal}
        onResume={() => onOkay()}
        headertitle="Food"
        content={alertContent}
        cancel={() => onGoBack()}
        cancelBtn="Cancel"
        saveBtn="Ok"
        width={100}
        opacity={"#000000cf"}
      />
      {/* //check from here */}
      {/* {!receiptValid && getProfileData?.downgraded === true && (
        <ExpiredModal

          onClick={validReceiotCallback}
          type={getProfileData?.planName}
        />
      )} */}
      {/* {(!receiptValid &&
        getProfileData?.downgraded &&
        moment(getProfileData?.subscriptionEnd).isBefore(moment()))
          &&
        (
          <ExpiredModal onClick={validReceiotCallback} type={'notfree'} />
        )} */}

      {infoModal ? (
        <ScoreModal
          visible={infoModal}
          close={() => setInfoModal(false)}
          onPerformanceLinkedPressed={() => {
            onScore();
            setInfoModal(false);
          }}
        />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loader && <Loader loading={loader} />}
        <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 20 }}>
          <Stats
            stepsData={userInput?.stepsData}
            sleepData={userInput?.sleepData}
            workoutData={userInput?.workoutData}
            caloriesData={userInput?.caloriesData}
            dailySteps={userInput?.dailySteps}
            googleStepsData={userInput?.googleStepsData}
            googleSleepData={userInput?.googleSleepData}
            googleCaloriesData={userInput?.googleCaloriesData}
            googleActivityData={userInput?.googleActivityData}
            googleWorkoutData={userInput?.googleWorkoutData}
            setUserInput={setUserInput}
            refreshing={refreshing}
            monthlySteps={userInput?.monthlySteps}
            graphStepsDate={userInput?.graphStepsDate}
            recentWeeklySteps={userInput?.recentWeeklySteps}
            recentStepsWeeklyArr={userInput?.recentStepsWeeklyArr}
            recentStepsWeeklyDate={userInput?.recentStepsWeeklyDate}
            weeklySteps={userInput?.weeklySteps}
            stepsWeeklyDate={userInput?.stepsWeeklyDate}
            weeklySleepData={userInput?.weeklySleepData}
            recentSevenDaysSleepData={userInput?.recentSevenDaysSleepData}
            monthlySleepData={userInput?.monthlySleepData}
            googleStepsWeekData={userInput?.googleStepsWeekData}
            googleStepsWeekDate={userInput?.googleStepsWeekDate}
            googleWeekAvgSteps={userInput?.googleWeekAvgSteps}
            pre3monthOfStepsData={userInput?.pre3monthOfStepsData}
            avg3MonthofSteps={userInput?.avg3MonthofSteps}
            prev3MonthOfSleepData={userInput?.prev3MonthOfSleepData}
            monthlyAvgSteps={userInput?.monthlyAvgSteps}
            googleWeeklyStepsDate={userInput?.googleWeeklyStepsDate}
            googleMonthlyStepsData={userInput?.googleMonthlyStepsData}
            google3MonthOfStepsData={userInput?.google3MonthOfStepsData}
            googleMonthlySleepData={userInput?.googleMonthlySleepData}
            google3MonthSleepData={userInput?.google3MonthSleepData}
            googleWeeklySleepData={userInput?.googleWeeklySleepData}
            googleDailyStep={userInput?.googleDailyStep}
          />
          {getProfileData?.planName !== "Free" &&
          getProfileData?.isChallenge == 1 ? (
            <>{renderChallengeTime()}</>
          ) : null}
          <View style={styles.titleContainerStyle}>
            <Text style={styles.userNameTextStyle}>
              Welcome, {getProfileData ? getProfileData.fullName : ""}
            </Text>
          </View>
          {props?.getQuestionnaireData?.goal ? (
            <TouchableOpacity
              style={styles.goalContainer}
              onPress={() => navigation.navigate("Questionnaire")}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    padding: 13,
                    fontSize: 16,
                    fontFamily: "Manrope-Regular",
                    color: "white",
                  }}
                >
                  My goal
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 13,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Manrope-Bold",
                      color: "white",
                    }}
                  >
                    {props?.getQuestionnaireData?.goal}
                  </Text>
                  <RightArrowIcon color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.goalContainer}
              onPress={() => navigation.navigate("Questionnaire")}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <ActivityIndicator size={'small'} color={'#fff'} style={{marginLeft:20,marginTop:5}}/> */}
                <Text
                  style={{
                    padding: 13,
                    fontSize: 16,
                    fontFamily: "Manrope-Regular",
                    color: "white",
                  }}
                >
                  Please select your goal
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 13,
                    alignItems: "center",
                  }}
                >
                  <RightArrowIcon color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          <View>
            <View style={styles.performanceScoreTitleContainer}>
              <TouchableOpacity
                style={[
                  styles.performanceScoreTextContainer,
                  { borderBottomWidth: 1, borderBottomColor: COLORS.grey_5 },
                ]}
                onPress={() => onScore()}
              >
                <View style={{ flexDirection: "row", paddingBottom: 15 }}>
                  <Text style={styles.scoreTitleTextStyle}>
                    Performance score
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ padding: 4 }}
                  onPress={() => onScore()}
                >
                  <SmallArrowIcon />
                </TouchableOpacity>
              </TouchableOpacity>

              <View
                style={[
                  styles.performanceScoreTextContainer,
                  { paddingTop: 10 },
                ]}
              >
                <View style={{ flexDirection: "row", paddingTop: 5 }}>
                  <View>
                    <Text style={styles.performanceScoreTitleTextStyle}>
                      This week's score
                    </Text>
                    <Text style={styles.performanceSubTextStyle}>
                      {userInput?.startDateStr} - {userInput?.endDateStr}{" "}
                      {userInput?.endDateMonth}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setInfoModal(true)}>
                    <View style={styles.infoIconStyle}>
                      <InfoIcon />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 24, fontFamily: "Manrope-Bold" }}>
                    {" "}
                    {scoreBarPercentage || 0}/10
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => onScore()}>
                <View style={styles.performanceScoreBarContainer}>
                  <ProgressBar
                    width={Dimensions.get("window").width - 50}
                    progress={progressBarValue || 0}
                    color1={
                      progressBaarPercentege < 60
                        ? "#f27030"
                        : COLORS.lightGreen
                    }
                    color2={progressBaarPercentege < 60 ? "#db5615" : "#06a572"}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.performanceSubContainer}>
              {/* <View style={styles.performanceSubTextContainer}>
                <Text style={styles.performanceSubTextStyle}>
                  This week: {userInput?.startDateStr} - {userInput?.endDateStr}{' '}
                  {userInput?.endDateMonth}
                </Text>
              </View> */}
              <View style={styles.performanceProgressCircleContainer}>
                <View style={{ flexDirection: "row" }}>
                  <ProgressIndicator
                    percent={getProfileData?.stepsGoal || 0}
                    color={"#76c72e"}
                    title={"Steps"}
                    targetValue={getProfileData?.stepsGoal || 0}
                    progressValue={
                      Platform.OS === "ios"
                        ? userInput?.weeklySteps
                          ? userInput?.weeklySteps.toFixed(0)
                          : 0
                        : userInput?.googleStepsData !== undefined
                        ? userInput?.googleStepsData
                          ? userInput?.googleStepsData
                          : 0
                        : "0"
                    }
                    icon={<StepsIcon color={"#76c72e"} />}
                    onPress={navigationToStepsScreen}
                    indicator
                    workoutFromHome={true}
                  />
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
                    color={"#f27030"}
                    getPercentValueDirectly
                    title={"Diet"}
                    targetValue={
                      dailyFoodTarget?.caloriesTarget == undefined
                        ? 0
                        : dailyFoodTarget?.caloriesTarget
                    }
                    progressValue={
                      dailyFoodTarget?.caloriesTarget == undefined
                        ? 0
                        : dailyFoodTarget?.caloriesTarget
                    }
                    indicator
                    icon={<CaloriesIcon color={"#f27030"} />}
                    workoutFromHome={true}
                    onPress={() =>
                      dailyFoodTarget?.caloriesTarget == 0
                        ? onTargetGoal(1)
                        : onDiet()
                    }
                  />
                </View>
                <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                  <ProgressIndicator
                    percent={calculateWorkoutPercentage()}
                    targetValue={getProfileData?.workoutGoal}
                    color={"#3db1eb"}
                    title={"Workouts"}
                    // getPercentValueDirectly
                    icon={<WorkOutIcon color={"#3db1eb"} />}
                    progressValue={
                      getProfileData?.totalWorkout + userInput?.workoutData || 0
                    }
                    // progressValue={userInput?.workoutData? (goalData?.weekTarget+userInput?.workoutData)||0:goalData?.weekTarget || 0}
                    indicator
                    onPress={() =>
                      dailyFoodTarget?.caloriesTarget == 0
                        ? onTargetGoal(2)
                        : navigation.navigate("WorkoutTab")
                    }
                    workoutFromHome={true}
                  />
                  <ProgressIndicator
                    percent={getProfileData?.sleepGoal || 0}
                    color={"#6839ef"}
                    targetValue={getProfileData?.sleepGoal || 0}
                    title={"Sleep"}
                    progressValue={
                      Platform.OS === "ios" ? weeklyData || 0 : hours || 0
                    }
                    minute={
                      Platform.OS == "android" ? minutes : weeklyDataInMin || 0
                    }
                    indicator
                    icon={<MoonIcon color={"#6839ef"} />}
                    onPress={() =>
                      navigation.navigate("Sleep", {
                        weeklysleep:
                          Platform.OS == "ios"
                            ? userInput?.recentSevenDaysSleepData || []
                            : userInput?.googleWeeklySleepData || [],
                        sleepGoal: getProfileData?.sleepGoal,
                        monthlySleep:
                          Platform.OS == "ios"
                            ? userInput?.monthlySleepData || []
                            : userInput?.googleMonthlySleepData || [],
                        todaySleep:
                          Platform.OS == "ios"
                            ? hours + "h" + " " + minutes + "m"
                            : Math.round(userInput?.sleepData / 60) +
                              "h" +
                              " " +
                              ((userInput?.sleepData % 60) + "m"),
                        prev3MonthOfSleepData:
                          Platform.OS == "ios"
                            ? userInput?.prev3MonthOfSleepData || []
                            : userInput?.google3MonthSleepData || [],
                      })
                    }
                    dataFromSleep={true}
                    workoutFromHome={true}
                  />
                </View>
              </View>
            </View>
          </View>
          {
            // getProfileData?.planName !== 'Free' ?
            <>
              {getProfileData?.isChallenge == 1 ||
              challange == undefined ||
              startChallenge == true ? null : (
                <TouchableOpacity
                  onPress={() => {
                    if (getProfileData.planName == "Free") {
                      changeMemershipModal();
                    } else {
                      setChallengeModalVisibility(true);
                    }
                  }}
                  activeOpacity={0.99}
                >
                  <ImageBackground
                    source={
                      { uri: mediaPath + challange?.programmeImage } ||
                      require("../../../assets/challange.png")
                    }
                    style={[styles.challengeImageContainer]}
                  >
                    <View style={styles.maskViewStyle} />
                    {getProfileData?.planName == "Free" && (
                      <View style={styles.whiteSheetOverlay} />
                    )}
                    {getProfileData?.planName == "Free" ? (
                      <View
                        style={[
                          styles.challengeContentContainer,
                          {
                            flexDirection: "row",
                            marginVertical: 15,
                            justifyContent: "center",
                          },
                        ]}
                      >
                        <Text
                          style={[styles.challengeTextStyle, { width: null }]}
                        >
                          {challange?.title}
                        </Text>

                        <Image
                          source={images.lockIcon}
                          style={{
                            tintColor: "white",
                            transform: [{ scale: 0.7 }],
                          }}
                        />
                      </View>
                    ) : (
                      <>
                        <View style={styles.challengeContentContainer}>
                          <Text style={styles.challengeTextStyle}>
                            {challange?.title}
                          </Text>
                          <View>
                            <TouchableOpacity
                              onPress={onJoinButtonPressed}
                              activeOpacity={0.7}
                              style={{ zIndex: 12 }}
                            >
                              <GradientButton
                                title="Join now"
                                style={styles.gradientButtonStyle}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}
                  </ImageBackground>
                  {getProfileData?.planName == "Free" && (
                    <Image
                      source={require("assets/ShadedRectangle.png")}
                      style={styles.shaddedImageView}
                    />
                  )}
                </TouchableOpacity>
              )}
            </>
            // : null
          }

          {dailyContent && (
            <View>
              <Text
                style={{
                  color: "#828282",
                  fontSize: 15,
                  marginHorizontal: 15,
                  marginTop: 20,
                  fontFamily: "Manrope-Medium",
                }}
              >
                Content of the day
              </Text>
              <Text
                style={{
                  color: "#161616",
                  fontSize: 16,
                  marginHorizontal: 15,
                  marginVertical: 2,
                  fontFamily: "Manrope-Bold",
                }}
              >
                {dailyContent?.heading}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  RBSheetRef2?.current?.open();
                  // setCurrentVideoPath(item?.exerciseVideo)
                }}
              >
                <ImageBackground
                  source={{ uri: dailyContent.image }} //cdnPath + dailyContent.image
                  style={{
                    borderRadius: 5,
                    height: 200,
                    // width: 110,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    overflow: "hidden",
                  }}
                >
                  <PlayIconVideo color={"#fff"} />
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )}

          {food.dailyFoodPlan ? (
            <View style={styles.gapBetweenContainers}>
              <CollapsableContainer
                title={"Today's plan"}
                onToggle={(value) =>
                  dispatch(
                    onToggleCollapsableStatus("todaysPlanContainer", value)
                  )
                }
                titleLeft={<CalenderIcon />}
                titleRight={<PenIcon />}
                expanded={getCollapsableData.todaysPlanContainer}
              >
                <View>
                  <CaloriesAndProteinProgress
                    totalCalories={totalCalories}
                    totalProtein={totalProtein}
                  />
                  <ImageCarousel
                    data={food?.dailyFoodPlan?.mealsInfo}
                    height={150}
                    cardComponent={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("FoodDetailsScreen", {
                            mealId: item._id,
                            itemById: item,
                          })
                        }
                        style={styles.cardContainerStyle}
                      >
                        <View style={styles.cardContainerStyle}>
                          <Image
                            source={{ uri: mediaPath + item.mealImage }}
                            style={styles.cardImageStyle}
                          />
                          <Text style={styles.cardTitleTextStyle}>
                            {item.mealType === 1
                              ? "Breakfast"
                              : item.mealType === 2
                              ? "Lunch"
                              : item.mealType === 3
                              ? "Snack"
                              : item?.mealType === 4
                              ? "Dinner"
                              : ""}
                          </Text>
                          <Text style={styles.cardSubtitleTextStyle}>
                            {item.mealName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </CollapsableContainer>
            </View>
          ) : null}

          <View style={styles.gapBetweenContainers}>
            <CollapsableContainer
              title={"Steps leaderboard"}
              expanded={isLeaderboardContainerOpened}
              onToggle={(value) => setLeaderboardContainer(value)}
            >
              <View style={{ backgroundColor: COLORS.inputTxtColor }}>
                <View style={{ paddingBottom: 10 }}>
                  <View style={styles.leaderboardTableHeaderContainer}>
                    <Text
                      style={[
                        styles.leaderboardTableHeaderTextStyle,
                        { width: "15%" },
                      ]}
                    >
                      №
                    </Text>
                    <Text
                      style={[
                        styles.leaderboardTableHeaderTextStyle,
                        { width: "45%", textAlign: "left" },
                      ]}
                    >
                      Name
                    </Text>

                    <Text
                      style={[
                        styles.leaderboardTableHeaderTextStyle,
                        { width: "20%" },
                      ]}
                    >
                      Count
                    </Text>
                  </View>
                  {leaderBoardData?.length === 0 ? null : (
                    <>
                      {leaderBoardData
                        ?.filter(
                          (_, i) =>
                            i <= (leaderBoardOpen ? leaderBoardData?.length : 2)
                        )
                        .map((item, index) => (
                          <View style={styles.leaderboardTableBodyContainer}>
                            <View style={styles.leaderboardPositionContainer}>
                              <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.leaderboardPositionGradientStyle}
                                colors={[COLORS.lightGreen, COLORS.lightBlue]}
                              >
                                <Text
                                  style={styles.leaderboardPositionTextStyle}
                                >
                                  {index + 1}
                                </Text>
                              </LinearGradient>
                            </View>
                            <View
                              style={styles.leaderboardProfileNameTextStyle}
                            >
                              <Image
                                source={
                                  item?.userId?.profileImage
                                    ? {
                                        uri:
                                          mediaPath +
                                          item?.userId?.profileImage,
                                      }
                                    : require("../../../assets/Avatar.png")
                                }
                                style={styles.leaderboardProfileImageStyle}
                              />
                              <Text
                                style={[styles.leaderboardTableBodyTextStyle]}
                              >
                                {item?.userId?.fname}
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.leaderboardTableBodyTextStyle,
                                { width: "20%" },
                              ]}
                            >
                              {Math.ceil(item.steps)}
                            </Text>
                          </View>
                        ))}
                    </>
                  )}
                </View>
                {leaderBoardData?.length > 0 ? (
                  <View style={{ borderTopWidth: 2, borderColor: "white" }}>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        // if (getProfileData.planName == 'Free') {
                        //   changeMemershipModal();
                        // } else {
                        navigation.navigate("Steps", {
                          steps:
                            Platform.OS == "ios"
                              ? userInput?.dailySteps
                              : userInput?.googleDailyStep,
                          avgSteps: userInput?.monthlyAvgSteps,
                          monthSteps: userInput?.monthlySteps,
                          dateForGraph: userInput?.graphStepsDate,
                          weekAvgData:
                            Platform.OS == "ios"
                              ? userInput?.recentWeeklySteps
                              : userInput?.recentWeeklySteps,
                          weekStepsDate:
                            Platform.OS == "ios"
                              ? userInput?.recentStepsWeeklyDate
                              : userInput?.recentStepsWeeklyDate,
                          weeklyValue:
                            Platform.OS == "ios"
                              ? userInput?.recentStepsWeeklyArr
                              : userInput?.recentStepsWeeklyArr,
                          monthOf3AvgSteps: userInput?.avg3MonthofSteps,
                          on3MonthStepsDataArr: userInput?.pre3monthOfStepsData,
                          googleMonthlyStepsData:
                            userInput?.googleMonthlyStepsData,
                          google3MonthOfStepsData:
                            userInput?.google3MonthOfStepsData,
                          fromLeaderboard: true,
                        });
                        // }
                      }}
                    >
                      {/* <CollapsableContainer */}
                      {/* title={ */}
                      <Text style={styles.fullLeaderBoardTitleStyle}>
                        Open the whole leaderboard
                      </Text>
                      <DropdownIcon />
                      {/* }
                        expanded
                        blueDropDown
                        onPress 
                      /> */}
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </CollapsableContainer>
          </View>
          <View style={{ padding: 5 }} />
        </View>
      </ScrollView>
      {challengeModalVisibility && customizedAlertModal.headertitle == "" ? (
        <DaysChallengeModal
          challange={challange}
          onClose={() => setChallengeModalVisibility(false)}
          mediaPath={mediaPath}
          onJoin={onJoinButtonPressed}
        />
      ) : null}
      {/* )} */}
      <AlertModal
        //alert={(customizedAlertModal.headertitle != '' && customizedAlertModal.headertitle != 'session_timeout' ) ? true : false}
        alert={customizedAlertModal.headertitle != "" ? true : false}
        onResume={() => {
          customizedAlertModal.onConfirm();
          onCancelCustomizedAlert();
          //onUserLogout();
        }}
        headertitle={customizedAlertModal.headertitle}
        content={customizedAlertModal.alertMessage}
        cancel={() => onCancelCustomizedAlert()}
        cancelBtn={customizedAlertModal.cancelBtn}
        saveBtn={
          customizedAlertModal.cancelBtn == ""
            ? "Ok"
            : customizedAlertModal.saveBtn || "Confirm"
        }
        width={100}
        opacity={""}
      />
      <RBSheet
        ref={RBSheetRef2}
        height={Dimensions.get("screen").height}
        openDuration={250}
        customStyles={{
          container: {
            // backgroundColor: "red",
            marginTop: 0,
            // justifyContent: "center",
            // alignItems: "center"
          },
        }}
      >
        <View
          style={[
            { flex: 1, marginTop: 0 },
            Platform.OS === "ios" && { marginTop: 40 },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              // alert("cc")
              RBSheetRef2.current?.close();
            }}
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
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ height: "100%", width: "100%" }}>
              {dailyContent?.video && (
                <Video
                
                  source={{ uri: cdnPath + dailyContent.video }} // Can be a URL or a local file.
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                  }}
                  controls
                  ignoreSilentSwitch={"ignore"}
                  fullscreen={true}
                  resizeMode="cover"
                  // volume={.5}
                  // onLoadStart={()=>alert("load start")}
                  onLoad={({ naturalSize }) => {}}
                  // muted={muted}
                />
              )}
              {/* <TouchableOpacity onPress={() => setMuted(prev => !prev)} style={{ justifyContent: "flex-start", alignItems: "flex-end", flex: 1 }}>
                {muted ? <Octicons name='mute' size={40} color={"#fff"} /> : <Octicons name='unmute' size={40} color={"#fff"} />}
              </TouchableOpacity> */}
            </View>
            <View></View>
          </View>
        </View>
      </RBSheet>
    </MainScreen>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  progressView: {
    flexDirection: "row",
  },
  steps: {
    fontSize: 14,
    color: COLORS.grey_3,
  },
  num: {
    fontSize: 22,
    color: COLORS.grey_2,
    fontFamily: "Manrope-ExtraBold",
  },
  progressView2: {
    left: 40,
  },
  progressView3: {
    left: 15,
  },
  titleContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: "5%",
  },
  challengeContainerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "5%",
  },
  userNameTextStyle: {
    textAlign: "center",
    color: COLORS.grey_2,
    fontSize: 15,
    textTransform: "capitalize",
    fontFamily: "Manrope-Regular",
  },
  leaderboardTableHeaderTextStyle: {
    fontSize: 13,
    color: COLORS.grey_4,
    textAlign: "center",
  },
  leaderboardTableBodyTextStyle: {
    textAlign: "center",
    color: COLORS.grey_2,
    fontFamily: "Manrope",
    fontSize: 15,
    alignSelf: "center",
  },
  gapBetweenContainers: {
    marginTop: 10,
  },
  goalContainer: {
    marginTop: 10,
    backgroundColor: COLORS.blue,
    height: 50,
  },
  stepsToCompleteContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.inputTxtColor,
  },
  performanceScoreTitleContainer: {
    backgroundColor: COLORS.inputTxtColor,
    marginTop: 10,
    // padding: 15,
  },
  performanceScoreTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignSelf: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  scoreTitleTextStyle: {
    fontSize: 14,
    fontFamily: "Manrope-Semibold",
    // textAlign: 'center',
    color: COLORS.grey_3,
    textTransform: "uppercase",
  },
  performanceScoreTitleTextStyle: {
    fontSize: 20,
    fontWeight: "bold",
    // textAlign: 'center',
    color: COLORS.black,
  },
  infoIconStyle: {
    top: 0,
    left: 5,
  },
  performanceScoreBarContainer: {
    alignSelf: "center",
    paddingTop: 10,
    paddingVertical: 15,
  },
  performanceSubContainer: {
    backgroundColor: COLORS.inputTxtColor,
    // marginTop: 2,
  },
  performanceSubTextContainer: {
    flexDirection: "row",
    alignSelf: "center",
    padding: 15,
  },
  performanceSubTextStyle: {
    fontSize: 14,
    fontWeight: "400",
    // textAlign: 'center',
    paddingHorizontal: 3,
    paddingVertical: 5,
    color: COLORS.grey_3,
  },
  performanceProgressCircleContainer: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  challengeImageContainer: {
    width: "100%",
    // height: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  maskViewStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.5,
    position: "absolute",
  },
  challengeContentContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 25,
    paddingBottom: 30,
  },
  challengeTextStyle: {
    color: "white",
    fontFamily: "Manrope-Medium",
    fontSize: 16,
    width: 250,
    textAlign: "center",
  },
  gradientButtonStyle: {
    paddingHorizontal: 95,
    marginTop: 15,
  },
  shaddedImageView: {
    height: "50%",
    width: "100%",
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  todaysPlanProgressContainer: {
    backgroundColor: COLORS.inputTxtColor,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  leaderboardTableHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  leaderboardTableBodyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
  },
  leaderboardProfileImageStyle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 5,
  },
  fullLeaderBoardTitleStyle: {
    fontSize: 15,
    color: COLORS.lightBlue,
    textDecorationLine: "underline",
  },
  leaderboardPositionContainer: {
    width: "15%",
    justifyContent: "center",
  },
  leaderboardPositionGradientStyle: {
    width: 20,
    height: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  leaderboardPositionTextStyle: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  leaderboardProfileNameTextStyle: {
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
  },
  cardContainerStyle: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
  },
  whiteSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    opacity: 0.4,
  },
  cardImageStyle: {
    width: 180,
    height: 150,
    borderRadius: 5,
  },
  cardTitleTextStyle: {
    color: COLORS.blue,
    fontFamily: "Manrope",
    fontSize: 14,
    marginTop: 5,
  },
  cardSubtitleTextStyle: {
    color: COLORS.grey_2,
    fontFamily: "Manrope-Bold",
    fontSize: 15,
    textTransform: "capitalize",
    width: 180,
  },
  challengeText: {
    color: COLORS.blue,
    fontSize: 14,
    fontFamily: "Manrope-Semibold",
  },
  subContainer: {
    backgroundColor: COLORS.inputTxtColor,
    padding: 15,
    marginTop: 10,
  },
  progressView: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    justifyContent: "center",
  },
  steps: {
    fontSize: 14,
    color: COLORS.grey_3,
    fontFamily: "Manrope-Regular",
  },
  num: {
    fontSize: 22,
    fontFamily: "Manrope-ExtraBold",
    color: COLORS.grey_2,
    marginLeft: 10,
  },
  progressNum: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.grey_2,
    height: 40,
  },
});
const mapStateToProps = (state) => {
  return {
    getQuestionnaireData:
      state?.questReducer?.QuestionnaireData?.data?.responseData?.result,
  };
};
export default connect(mapStateToProps)(Home);
