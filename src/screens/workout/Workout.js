import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Vibration,
  BackHandler,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { COLORS } from "../../common/Constant";
import { MainScreen } from "../../common/Screen";
import PhaseContainer from "../../components/phaseContainer/PhaseContainer";
import ProgressIndicator from "../../components/ProgressIndicator";
import {
  ActiveWorkOut,
  BellIcon,
  SmallArrowIcon,
  StepsIcon,
  TipsIcon,
  WorkOutIcon,
} from "../../Svg";
import WorkoutCard from "./WorkoutCard";
import WorkoutSubContainer from "./WorkoutSubContainer";
import { getWorkoutProgramme } from "../../_action/WorkoutAction";
import { getProfileAction } from "../../_action/ProfileAction";
import { usersService } from "../../services/ApiServices";
import { getDailyFoodTarget } from "../../_action/FoodAction";
import AlertModal from "../modal/AlertModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RBSheet from "react-native-raw-bottom-sheet";
import GradientButton from "../../components/GradientButton";
import GradientContainer from "../../components/GradientContainer";
import { Switch } from "react-native-switch";
import DayCard from "../../components/DayCard";
import DatePicker from "react-native-date-picker";
import {
  dayNamefromDay,
  fromDayToDayName,
  getCurrentWeek,
} from "../../utils/helper";
import { showMessage } from "react-native-flash-message";
let Workout = React.memo(function Workout({ route }) {
  const { loading, data } = useSelector(
    (state) => state?.workout?.workoutProgramme
  );
  const { workoutLength } = useSelector((state) => state?.workout?.healthData);
  const exerciseGoal = data?.data?.responseData?.exerciseGoal;
  const navigation = useNavigation();
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData?.userProfile
  );
  const allWorkoutPageName = useSelector(
    (state) => state?.commonReducer?.allWorkoutPageName
  );
  const workoutPhase = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData?.result
  );
 
  const goalData = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo
  );

  console.log("goal", goalData);
  const dispatch = useDispatch();
  const RBSheetRef = useRef();
  const [customePhase, setCustomePhase] = useState(goalData?.workoutWeek || 1);
  const [onPhaseClick, setOnPhaseClick] = useState(false);
  const [datee, setDate] = useState(new Date());

  let weekGoals = 0;
  var workoutArr = [];
  // let workout = data?.data?.responseData?.result;
  const [workout, setWorkout] = useState(data?.data?.responseData?.result);
  let [isProgram, setIsProgram] = useState(false);
  const [selectedProgram, setSelectedProgramme] = useState();
  const [loader, setLoader] = useState(false);
  const [planData, setPlanData] = useState({});
  const [accesWorkoutTab, setAccessWorkoutTab] = useState(false);
  const [weekGoalData, setWeekGoalData] = useState();
  const [workoutDataByPhase, setWorkoutDataByPhase] = useState([]);
  const [curWorkId, setCurWorkId] = useState();
  const [currWeek, setCurWeek] = useState();
  const [eventAdded, setEventAdded] = useState(false);
  const [newWorkouts, setNewWorkouts] = useState([]);
  const [newWeeks, setNewWeeks] = useState([]);
  const [profileId, setProfileId] = useState();
  const [radio, setRadio] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [choosedTime, setChoosedTime] = useState([]);
  const [completedDays, setCompletedDays] = useState(0)
  const [workoutProgrammeHistory, setWorkoutProgrammeHistory] = useState([])
  if (data?.data?.statusCode == 1) {
    weekGoals = goalData?.dayGoal % goalData?.weekGoal;
    var day = 1;
    workoutArr = workout?.phase?.map((val) => {
      return { ...val, day: day++, dayGoals: goalData?.dayGoal };
    });
  }
  const isFocused = useIsFocused();
  useEffect(() => {
    if (route?.params?.fromProgramSelection && isFocused) {
      setTimeout(() => {
        RBSheetRef?.current?.open();
      }, 5000);
      showMessage({
        message: "Message",
        description: "Program Changed Successfully.",
        type: "default",
        backgroundColor: COLORS.lightGreen,
        color: COLORS.white,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (goalData?.workoutWeek) {
      setCustomePhase(goalData?.workoutWeek);
    }
  }, [goalData]);

  const food = useSelector(
    (state) => state?.food?.dailyFoodTarget?.caloriesTarget
  );
  const onChangeDay = (day, dayNo) => {
    let tempDays = selectedDays || [];
    let tempDaysCount = choosedTime || [];
    console.log({ tempDays });
    if (day === "Su") dayNo = 1;
    if (tempDays.includes(day)) {
      tempDays = tempDays?.filter((e) => e !== day);
      tempDaysCount = tempDaysCount?.filter((e) => e !== dayNo);
    } else {
      tempDays.push(day);
      tempDaysCount.push(dayNo);
    }
    setSelectedDays([...tempDays]);
    setChoosedTime([...tempDaysCount]);
  };
  const handlePhaseChange = useCallback(
    (phase, id) => {
      // const idData = workout?.phase?.map(item => item?._id);
      // if (idData?.includes(id)) {
      //   setOnPhaseClick(true);
      // } else {
      //   setOnPhaseClick(false);
      // }
      setCustomePhase(phase);
    },
    [customePhase]
  );

  const weekDay =
    getProfileData?.planName === "Free"
      ? 1
      : goalData?.workoutDay % 7 == 0
      ? ~~(goalData?.workoutDay / 7)
      : ~~(goalData?.workoutDay / 7) + 1;
  useEffect(() => {
    getWorkoutProgrammes();

    dispatch(getWorkoutProgramme());

    if (getProfileData?.workoutProgrammeId !== null) {
      setIsProgram(true);
    }
  }, [navigation, isProgram, getProfileData]);

  React.useEffect(() => {
    if (isFocused) {
      dispatch(getProfileAction());
      _getWorkoutProgramHistory()
    }
    // const unsubscribe = navigation.addListener('focus', () => {
    //   dispatch(getProfileAction());

    // });

    // // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribe;
  }, [navigation, isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWorkoutProgramme());
      dispatch(getDailyFoodTarget());
      if (getProfileData?.workoutProgrammeId === null) {
        navigation.replace("Workouts", { programmeId: "null" });
      }
      // workoutLink()
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      workoutLink();
    }, [food])
  );

  const workoutLink = async () => {
    let wId = await AsyncStorage.getItem("remindStatus");
    console.log({ wId });
    if (wId) {
      setRadio(JSON.parse(wId));
    }
  };
console.log({food});
  useFocusEffect(
    useCallback(() => {
      if (food == 0 || food == "") {
        setAccessWorkoutTab(true);
      }
    }, [food])
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              RBSheetRef.current?.open();
            }}
            style={{ marginRight: 10 }}
          >
            <BellIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Workout tips", { title: "Workout tips" })
            }
          >
            <TipsIcon />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (
        selectedProgram?.isChallenge == 1 &&
        workoutPhase?.workoutDay >= workoutPhase?.phaseDays?.phase3EndDay + 1
      ) {
        setLoader(true);
        navigation.navigate("PhaseComplete", { isChallenge: 1 });
      } else if (
        workoutPhase?.workoutDay >=
        workoutPhase?.phaseDays?.phase3EndDay + 1
      ) {
        setLoader(true);
        navigation.navigate("PhaseComplete", { isChallenge: 0 });
      }
    }, [navigation, workoutPhase?.workoutDay])
  );

  const getWorkoutProgrammes = async () => {
    let req = {
      // isChallenge: 1,
      programmeId: getProfileData?.workoutProgrammeId,
    };
    if (!getProfileData) return;
    if (getProfileData?.workoutProgrammeId) {
      setProfileId(getProfileData?.workoutProgrammeId);
      if (getProfileData?.workoutProgrammeId !== profileId) return;

      try {
        // const res = await usersService.getWorkoutProgrammes(req);
        // console.log("getWorkoutProgrammes ", res);
        if (profileId) {
          // const resNew = await usersService.getUserWorkout(req);
          
          const resNew = await usersService.getWorkoutProgrammesNew(req);
          console.log("getWorkoutProgrammesNew ", JSON.stringify(resNew));
          if (resNew?.data?.statusCode === 1) {
            const result = resNew?.data?.responseData?.result[0];
            setPlanData({ ...result });
            setSelectedProgramme({ ...result });
            setWorkout({ ...result });
            _getWorkoutProgramHistory()
          } else setPlanData({});
        }

        setLoader(false);
      } catch (e) {
        setLoader(false);
        console.error("error ", e);
      }
    }
  };

  // const completeWorkout = async () => {
 
  //   const value = await AsyncStorage.getItem("complete");

  //   if(value!=null && value == "true"){
  //     AsyncStorage.removeItem("keys")
  //     AsyncStorage.removeItem('complete')
  //     navigation.navigate("Workouts", { programmeId: "null" });
  //   }
  // }

  

  


  useEffect(() => {
    
    const unsubscribed = navigation.addListener("focus", async () => {

      // completeWorkout()
      if (getProfileData != undefined) {
        if (getProfileData?.workoutProgrammeId) {
          setProfileId(getProfileData?.workoutProgrammeId);
        }
        if (
          getProfileData?.planName == "Free"
          //  && !getProfileData?.workoutProgrammeId
        ) {
          navigation.navigate("Workouts", { programmeId: "null" });
          setTimeout(() => {
            navigation.navigate("All Workouts");
          }, 500);
        } else if (getProfileData?.workoutProgrammeId == null) {
          navigation.navigate("Workouts", { programmeId: "null" });
        } else {
          navigation.navigate("Workout");
        }
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribed;
  }, [navigation, isProgram, getProfileData]);

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var d = new Date();
  var dayName = days[d.getDay()];
  useEffect(() => {
    const workoutsData = workout?.phase?.map((item) => item.workouts);

    return;
    if (customePhase == 1 && workoutsData?.length) {
      const workoutById = workoutsData[0]?.filter((item) => item.workoutId);
      const curerentWorkId = workoutById?.filter(
        (item) => item?.day == dayName
      );
      if (curerentWorkId[0]?.workoutId) {
        setCurWorkId(curerentWorkId[0]?.workoutId);
        setCurWeek(curerentWorkId[0]?.week);
      } else {
        setCurWorkId("Rest day");
      }
      setWeekGoalData(workout?.phase[0]?.workoutPerWeek);
      setWorkoutDataByPhase(workoutById);
    }
    if (customePhase == 2 && workoutsData) {
      const workoutById = workoutsData[1]?.filter((item) => item.workoutId);
      const curerentWorkId = workoutById?.filter(
        (item) => item?.day == dayName
      );
      if (curerentWorkId[0]?.workoutId) {
        setCurWorkId(curerentWorkId[0]?.workoutId);
        setCurWeek(curerentWorkId[0]?.week);
      } else {
        setCurWorkId("Rest day");
      }
      setWeekGoalData(workout?.phase[1]?.workoutPerWeek);
      setWorkoutDataByPhase(workoutById);
    }
    if (customePhase == 3 && workoutsData) {
      const workoutById = workoutsData[2]?.filter((item) => item.workoutId);
      const curerentWorkId = workoutById?.filter(
        (item) => item?.day == dayName
      );
      if (curerentWorkId[0]?.workoutId) {
        setCurWorkId(curerentWorkId[0]?.workoutId);
        setCurWeek(curerentWorkId[0]?.week);
      } else {
        setCurWorkId("Rest day");
      }
      setWeekGoalData(workout?.phase[2]?.workoutPerWeek);
      setWorkoutDataByPhase(workoutById);
    }
  }, [navigation, isProgram]);

  const onGoBack = () => {
    setAccessWorkoutTab(false);
    navigation.navigate("HomeTab");
  };

  const onOkay = () => {
    setAccessWorkoutTab(false);
    navigation.navigate("Questionnaire");
  };
  const onSaveReminder = async () => {
    var todaydate = new Date();
    //find the year of the current date
    var oneJan = new Date(todaydate.getFullYear(), 0, 1);
    // calculating number of days in given year before a given date
    var numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

    // adding 1 since to current date and returns value starting from 0
    var result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);

    let workoutnotifications = [];
    // here we are converting date to utc and send to the api
    var date = new Date();
    console.log({ date, utcDate: date.toISOString() });
    var dateForTime = datee.toISOString();
    let text = dateForTime;
    const curTime = text.split("T")[1];

    const timezoneOffset = new Date().getTimezoneOffset();
    // choosedTime?.map((val,index)=>{
    //   var d = (val + (result - 1) * 7);
    //   console.log("availdate",new Date(new Date().getFullYear(), 0, d));
    //   let finalDate= new Date(new Date().getFullYear(), 0, d).toISOString()
    //   const curDate = finalDate.split("T")[0]
    //   workoutnotifications.push({
    //     "notificationDay": curDate,
    //     "notificationTime": curTime,
    //     "timezoneOffset":timezoneOffset
    //   })
    // })
    const currentWeekDates = getCurrentWeek();
    console.log({ currentWeekDates, choosedTime });
    choosedTime?.map((val, index) => {
      let day = val - 2;
      if (val == 1) day = 6;
      console.log({ day });
      const curDate = currentWeekDates[day].split("T")[0];
      workoutnotifications.push({
        notificationDay: curDate,
        notificationTime: curTime.slice(0, -7) + '00.000Z',
        timezoneOffset: timezoneOffset,
      });
    });
    console.log({ workoutnotifications });
    // return
    let param = {
      workoutNotification: [...workoutnotifications],
    };
    //  selectedDays.map({

    //  })

    const res = await usersService.setUserReminder(param);
    console.log({ res });
    showMessage({
      message: "Message",
      description: "Reminder Set Successfully.",
      type: "default",
      backgroundColor: COLORS.lightGreen,
      color: COLORS.white,
    });
    _getUserReminder();
    RBSheetRef?.current?.close();
  };
  const _getUserReminder = async () => {
    const respoooo = await usersService.getUserReminder();
    console.log({ respoooo });
    if (respoooo?.data?.error) return;

    const {
      data: { responseData },
    } = respoooo;
    console.log({ responseData });
    let tempDays = [];
    console.log({
      responseData,
      date: new Date(
        responseData[0].notificationDay + "T" + responseData[0].notificationTime
      ),
    });
    setDate(
      new Date(
        responseData[0].notificationDay + "T" + responseData[0].notificationTime
      )
    );
    responseData?.map((val, ind) => {
      var date = new Date();
      let d = val?.notificationDay + "T" + val?.notificationTime;
      console.log({ d, dd: new Date(d) });
      console.log("date week", new Date(d).getDay());
      var date = new Date(d);

      date.setDate(date.getDate() + 1);
      tempDays.push(new Date(d).getDay() + 1);
    });
    let unique = [...new Set(tempDays)];
    console.log({ unique });
    let tempdaysName = [];
    unique.map((val) => {
      tempdaysName.push(fromDayToDayName(val));
    });
    let unique1 = [...new Set(tempdaysName)];
    setSelectedDays([...unique1]);
    setChoosedTime([...unique]);
  };
  React.useEffect(() => {
    _getUserReminder();
    
  }, []);
  // alert(workoutProgrammeHistory?.length)
  React.useEffect(() => {
    //workoutId
    var results = workoutProgrammeHistory?.filter(element =>customePhase===element?.workoutWeek);
    console.log({results:results?.length});
    setCompletedDays(results?.length||0)
  }, [workoutProgrammeHistory,customePhase])
  const _getWorkoutProgramHistory=()=>{
    // alert("xx")
    console.log("getProfileData?.workoutProgrammeId",getProfileData?.workoutProgrammeId);
    usersService
    .getWorkoutProgramHistory(getProfileData?.workoutProgrammeId)
    .then((res) => {
      console.log(getProfileData?.workoutProgrammeId,"res?.data?.responseData getWorkoutProgramHistory", res);
      if(res?.data?.responseData){
        setWorkoutProgrammeHistory(res?.data?.responseData?.workoutProgrammeHistory)
      }
    })
    .catch((e) => console.log({ "Error is":e }));
  }
  console.log("===================>>", selectedDays, {planData});
  return (
    <MainScreen>
      <AlertModal
        alert={accesWorkoutTab}
        onResume={() => onOkay()} 
        headertitle="Workout"
        content={
          "To access the workout section, please complete the questionnaire first."
        }
        cancel={() => onGoBack()}
        cancelBtn="Cancel"
        saveBtn="Ok"
        width={100}
        opacity={"#000000cf"}
      />
      <AlertModal
        alert={eventAdded}
        onResume={() => setEventAdded(false)}
        headertitle="Workout"
        content={"Your workout has been added to your phone calendar."}
        cancelBtn=""
        saveBtn="Ok"
        width={80}
      />
      {loading || loader ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            animating={true}
            color={COLORS.lightGreen}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContentStyle}>
          {getProfileData?.workoutProgrammeId === null ? null : (
            <TouchableOpacity
              onPress={() => {
                
                if (allWorkoutPageName == "allprograms") {
                  navigation.push("Workouts");
                } else {
                  navigation.navigate("Workouts", { programmeId: "null" });
                  setTimeout(() => {
                    navigation.navigate("All Workouts");
                  }, 500);
                }
              }}
              style={styles.workoutProgrammeContainer}
            >
              <View>
                <Text style={styles.workoutProgrammeTextStyle}>
                  {workout?.title == null || undefined
                    ? "Select workout programme"
                    : "My workout programme"}
                </Text>
                {workout?.title == null || undefined ? null : (
                  <Text
                    style={[
                      styles.workoutProgrammeTextStyle,
                      {
                        fontFamily: "Manrope-Bold",
                        textTransform: "capitalize",
                      },
                    ]}
                  >
                    {workout?.title}
                  </Text>
                )}
              </View>
              <View style={styles.workoutProgrammeSelectorContainer}>
                <SmallArrowIcon />
              </View>
            </TouchableOpacity>
          )}
          {workout?.title == null || undefined ? null : (
            <>
              <View style={{ height: 10 }} />

              <PhaseContainer
                {...workout}
                weeks={planData?.weeks}
                onPhaseClick={onPhaseClick}
                goal={goalData}
                customePhase={customePhase}
                workoutsData={planData?.workouts
                  ?.filter((e) => e?.weekNo === customePhase)}
                  workoutProgrammeHistory={workoutProgrammeHistory}
                handlePhaseChange={handlePhaseChange}
              />
              {/* {console.log({customePhase,workout})} */}
              <WorkoutSubContainer containerTitle={"Week " + customePhase}>
                <View style={styles.progressIndicatorContainer}>
                  {/* <ProgressIndicator
                    title={"Today's goal"}
                    progressValue={goalData?.dayTarget || 0}
                    targetValue={
                      goalData?.dayGoal == 0 ? 0 : goalData?.dayGoal || 0
                    }
                    gradient
                  /> */}
                  <View style={{ flex: 0.5 }} />
                  <ProgressIndicator
                    title={"Week's goal"}
                    progressValue={
                      completedDays>goalData?.weekGoal?goalData?.weekGoal:completedDays ||
                      0
                    }
                    targetValue={goalData?.weekGoal || 3}
                    icon={<ActiveWorkOut />}
                    gradient
                  />
                  <View style={{ flex: 0.5 }} />
                </View>
              </WorkoutSubContainer>
              {/* {console.log({"planData?.workouts":planData?.workouts})} */}
              {planData?.workouts?.length === 0 ? null : (
                <WorkoutSubContainer containerTitle={"Workouts"}>
                  {planData?.workouts
                    ?.filter((e) => e?.weekNo === customePhase)
                    .map((items, index) => {
                      if (items?.weekNo === customePhase && items?.title) {
                        return (
                          <WorkoutCard
                          workoutProgrammeHistory={workoutProgrammeHistory}
                            {...items}
                            workData={items}
                            key={`${Math.random() * 500}`}
                            workoutPhase={goalData?.workoutPhase}
                            index={index}
                            weekGoal={goalData?.weekGoal}
                            week={goalData?.workoutWeek}
                            curWorkId={curWorkId}
                            selectedWeek={customePhase}
                            setEventAdded={setEventAdded}
                            category={1}
                            weekLength={planData?.weeks?.length}
                            workOut={planData?.workouts
                              ?.filter((e) => e?.weekNo === customePhase)}
                            currentDay={index + 1}
                          />
                        );
                      } else return null;
                      return item?.workouts?.map((items, index) =>
                        item?.weekNo === customePhase && items?.title ? (
                          <WorkoutCard
                            {...items}
                            workData={items}
                            key={`${Math.random() * 500}`}
                            workoutPhase={goalData?.workoutPhase}
                            index={index}
                            weekGoal={goalData?.weekGoal}
                            week={goalData?.workoutWeek}
                            curWorkId={curWorkId}
                            setEventAdded={setEventAdded}
                          />
                        ) : null
                      );
                    })}
                </WorkoutSubContainer>
              )}
            </>
          )}
        </ScrollView>
      )}
      <RBSheet
        ref={RBSheetRef}
        height={Dimensions.get("window").width+150
               }
        openDuration={250}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            // justifyContent: "center",
            // alignItems: "center"
          },
        }}
      >
        <View
          style={[
            { flex: 1, borderTopLeftRadius: 20 },
            Platform.OS === "ios" && { marginBottom: 40 },
          ]}
        >
        
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={styles.row}>
              <Text
                style={{
                  ...styles.titleTextStyle,
                  fontSize: 16,
                  flex: 1,
                  textAlign: "left",
                  color: COLORS.black,
                  fontFamily: "Manrope-Medium",
                }}
              >
                Set Reminder
              </Text>
              <Switch
                value={radio}
                onValueChange={async (status) => {
                  setRadio(status);
                  await AsyncStorage.setItem(
                    "remindStatus",
                    JSON.stringify(status)
                  );
                }}
                disabled={false}
                activeText={"On"}
                inActiveText={"Off"}
                circleSize={20}
                barHeight={20}
                backgroundActive={COLORS.lightGreen}
                backgroundInactive={"gray"}
                changeValueImmediately={true}
                renderActiveText={false}
                renderInActiveText={false}
              />
            </View>
            <Text
              style={{
                ...styles.titleTextStyle,
                fontSize: 14,
                marginTop: 10,
                textAlign: "left",
                color: "#4F4F4F",
                fontFamily: "Manrope-Regular",
              }}
            >
              Remind me to complete my workout goal.
            </Text>
            <View style={{ alignItems: "center" }}>
              <DatePicker
                date={datee}
                theme="light"
                mode="time"
                is24hourSource="locale"
                onDateChange={setDate}
              />
            </View>
            <View style={{}}>
              <Text
                style={{
                  ...styles.titleTextStyle,
                  fontSize: 16,
                  textAlign: "left",
                  color: COLORS.black,
                  fontFamily: "Manrope-Medium",
                }}
              >
                Select days you want to be reminded to work out 💪🏾
              </Text>
              <Text
                style={{
                  ...styles.titleTextStyle,
                  color: "#4F4F4F",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "left",
                  fontFamily: "Manrope-Regular",
                }}
              >
                Remind me on…
              </Text>
              <View style={{ ...styles.row, marginTop: 20 }}>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                  (val, index) => {
                    return (
                      <DayCard
                        key={index}
                        title={val}
                        // subtitle={`Week ${1} to ${props?.phase[0]?.weeks|| 0}`}
                        // phaseArr={props.phase}
                        isActive
                        disabled={false}
                        // phase={props?.goal?.workoutWeek === index+1}
                        phase={selectedDays?.includes(val)}
                        textStyle={{
                          fontSize: 14,
                          fontFamily: "Manrope-Medium",
                        }}
                        // onPress={() => {}}
                        onPress={() => onChangeDay(val, index + 2)}
                      />
                    );
                  }
                )}
              </View>
            </View>
          </View>
       
          <View style={{ flexDirection: "row", marginHorizontal: 20 }}>
            <TouchableOpacity
              onPress={() => RBSheetRef?.current?.close()}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ ...styles.titleTextStyle, color: COLORS.lightGreen }}
              >
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={onSaveReminder}>
              <GradientContainer
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.titleTextStyle}>Save</Text>
              </GradientContainer>
            </TouchableOpacity>
            {/* <GradientButton title={"Save"} containerStyle={{flex:1,backgroundColor:"pink"}}  
          onPress={()=>RBSheetRef?.current?.close()} /> */}
          </View>
        </View>
      </RBSheet>
    </MainScreen>
  );
});
export default Workout;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleTextStyle: {
    fontFamily: "Manrope-Bold",
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  workoutProgrammeContainer: {
    padding: 15,
    paddingRight: 0,
    backgroundColor: COLORS.light_grey,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  workoutProgrammeTextStyle: {
    fontFamily: "Manrope-Light",
    fontSize: 16,
  },
  workoutProgrammeSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  scrollContentStyle: {
    padding: 15,
  },
  progressIndicatorContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    justifyContent: "center",
    // backgroundColor:"red",
    alignItems: "center",
    alignSelf: "center",
  },
});
