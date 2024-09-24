import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { MainScreen } from "../../../common/Screen";
import { Button } from "../../../components/Button";
import GradientButton from "../../../components/GradientButton";
import ProgressIndicatorWhite from "../../../components/ProgressIndicatorWhite";
import { usersService } from "../../../services/ApiServices";
import { updateAllWorkoutPageName } from "../../../_action/CommonAction";
import {
  BackArrowIcon,
  CloseFoodIcon,
  PlayIcon,
  StarFavIcon,
  StarIcon,
  TipsIcon,
} from "../../../Svg";
import { getWorkoutProgramme } from "../../../_action/WorkoutAction";
import WorkoutSubContainer from "../WorkoutSubContainer";
import { styles } from "./WorkoutHiitStyle";
import { showMessage, hideMessage } from "react-native-flash-message";
import { COLORS } from "../../../common/Constant";
const { width, height } = Dimensions.get("window");
import { BackHandler } from "react-native";
import { Loader } from "../../../common/Loader";
import { Colors } from "react-native/Libraries/NewAppScreen";
import GradientContainer from "../../../components/GradientContainer";
import { color } from "react-native-reanimated";
import PhaseContainer from "../../../components/phaseContainer/PhaseContainer";
import PhaseCard from "../../../components/phaseContainer/PhaseCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
const HiitComplete = React.memo((props) => {
  console.log("props", props);
  console.log({ data });
  const { loading, data } = useSelector(
    (state) => state?.workout?.workoutProgramme
  );
  const [exp, setExp] = useState("Amazing");
  const [isShared, setIsShared] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("KG");
  const {
    fromDashboard,
    workoutFromHome,
    dashboard,
    backgroundImage,
    workoutTitle,
    timeElapses,
  } = props.route.params;
  console.log("props meraj===", props);
  const goalData = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo
  );
  const { workoutLength } = useSelector((state) => state?.workout?.healthData);
  const navigation = useNavigation();
  const [weekGoalData, setWeekGoalData] = useState();
  const [onCompleted, setOnCompleted] = useState(true);
  const [isLoader, setLoader] = useState(false);
  const [newScores, setNewScores] = useState(0);
  const [disableClose, setDisableClose] = useState(false);
  const dispatch = useDispatch();
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData?.userProfile
  );
  const workoutActivityCount = useSelector(
    (state) => state?.workout?.workoutActivityCount
  );
  let workout = data?.data?.responseData?.result;
  let workoutId = props?.route?.params;
  let repsScores = props?.route?.params?.repsScores;
  let exerciseLength = props?.route?.params?.exLength;
  let cir = props?.route?.params?.cir;
  let exer = props?.route?.params?.exer;
  let dataById = props?.route?.params?.dataById;
  const exerciseGoal = data?.data?.responseData?.exerciseGoal;
  let weekGoals = 0;
  let workoutArr = [];
  if (data?.data?.statusCode == 1) {
    weekGoals = goalData.dayGoal % goalData.weekGoal;
    var day = 1;
    workoutArr = workout.phase.map((val) => {
      return { ...val, day: day++, dayGoals: goalData.dayGoal };
    });
  }

  let totalSets = 0;
  let totalReps = 0;
  let totalCount = 0;
  let total = 0;
  let oldAllScores = 0;
  exerciseLength?.map((val, index) => {
    val?.setInfo?.map((value) => {
      totalReps =
        totalReps + (value.weight == -1 ? 0 : Number(value?.noOfReps) || 0);
      totalCount =
        totalCount +
        (value.weight == -1
          ? value?.noOfReps * 0 * val.setInfo.length
          : value?.weight * value?.noOfReps * val.setInfo.length);
    });
    // totalSets = totalSets + (val?.setInfo?.length || 0);
    total = total + (val?.setInfo?.length || 0);
    totalSets =
      totalSets + val.setInfo?.filter((item) => item.weight != -1).length;
  });
  // useEffect(() => {
  //   setTimeout(() => {
  //     _saveWorkoutHistory();
  //   }, 6000);
  // }, []);

  const _saveWorkoutHistory = () => {
    let wID = props.route.params?.id;
    let data = {
      workoutId: wID,
      completed: `${exerciseLength?.length || 0}/${
        exerciseLength?.length || 0
      }`,
      duration: `${formattedTime(timeElapses)}m/60`,
      score: `${totalCount}/${oldAllScores}`,
      sets: `${totalSets}/${total}`,
      reps: `${totalReps}/${repsScores?.reps}`,
    };

    usersService
      .setWorkoutHistoryByWorkoutId(data)
      .then((res) => {
        console.log("res from workout is", wID, res?.data);
        setDisableClose(false);
      })
      .catch((e) => {
        console.log({ e });
        setDisableClose(false);
      });
  };
  console.log({ total });
  useEffect(async () => {
    let index1 = 0,
      oldscoress = 0;
    const exerciseInfoData = exerciseLength;
    // console.log({exerciseInfoData});
    while (index1 <= exerciseInfoData.length - 1) {
      let oldScores = 0;
      const res = await usersService.getWorkoutScores(
        exerciseInfoData[index1].exerciseId
      );
      console.log({ res });
      if (res?.data?.statusCode == 1) {
        oldScores = res?.data?.responseData?.score;
        console.log({ newScores: oldScores });
        oldscoress = oldscoress + (oldScores || 0);
      }
      index1++;
    }
    console.log({ newScoress: oldscoress });
    setNewScores(oldscoress);
    oldAllScores = oldscoress.toFixed();
  }, []);
  useEffect(async () => {
    const unitt = await AsyncStorage.getItem("selectedUnit");

    if (unitt) {
      setSelectedUnit(JSON.parse(unitt));
    }
  }, []);

  const formattedTime = (time) => {
    let minutes = parseInt(time / 60);
    let seconds = time % 60;
    return `${minutes.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    })}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
  };

  const onAddFav = () => {
    let req = {
      workoutId: workoutId?.id,
    };
    usersService.addWorkoutInFavourite(req).then((res) => {
      if (res?.data?.statusCode === 1) {
        showMessage({
          message: "Message",
          description: "Added to favourite workouts successfully.",
          type: "default",
          backgroundColor: COLORS.lightGreen,
          color: COLORS.white,
        });
      }
    });
  };

  const onShareCommunity = async () => {
    let req = {
      created: new Date(),
      description: props?.route?.params?.workoutTitle,
    };

    const response = await usersService.feedShare(req);
    if (response?.data?.statusCode === 1) {
      setIsShared(true);
      showMessage({
        message: "Message",
        description: "Your post has been successfuly shared with the community",
        type: "default",
        backgroundColor: COLORS.lightGreen,
        color: COLORS.white,
      });
    }
  };
  useEffect(() => {
    dispatch(getWorkoutProgramme());
  }, [navigation]);

  useEffect(() => {
    const workoutsData = workout?.phase?.map((item) => item.workouts);
    if (goalData?.workoutPhase == 1) {
      const workoutById =
        workoutsData && workoutsData[0]?.filter((item) => item.workoutId);
      setWeekGoalData(workout?.phase[0]?.workoutPerWeek);
    }
    if (goalData?.workoutPhase == 2) {
      const workoutById =
        workoutsData && workoutsData[1]?.filter((item) => item.workoutId);
      setWeekGoalData(workout?.phase[1]?.workoutPerWeek);
    }
    if (goalData?.workoutPhase == 3) {
      const workoutById =
        workoutsData && workoutsData[2]?.filter((item) => item.workoutId);
      setWeekGoalData(workout?.phase[2]?.workoutPerWeek);
    }
  }, []);

  // const  handleBackButtonClick = () => {
  //   navigation.goBack();
  //   return true;
  // }

  // useEffect(() => {
  //   // console.log("{allComplete: props.route.params.allComplete}", props.route.params.allComplete)
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       "hardwareBackPress",
  //       handleBackButtonClick
  //     );
  //   };
  // }, []);
console.log("props.route.params.allComplete",props.route.params.allComplete);
  const onCompleteWorkout = () => {
    // AsyncStorage.setItem('complete', +"");
    // alert(props.route.params.allComplete)
    if (props.route.params.allComplete) {
      AsyncStorage.removeItem("keys");
      props.navigation.navigate("Workouts", { programmeId: "null" });
    } else if (workout === undefined) {
      if (dashboard == true || dashboard == "true") {
        setOnCompleted(false);
        // showMessage({
        //   message: "Message",
        //   description: "Congrats! Workout completed successfully.",
        //   type: "default",
        //   backgroundColor: COLORS.lightGreen,
        //   color: COLORS.white,
        // });
        props.navigation.navigate("Workout", {
          allComplete: props.route.params.allComplete,
        });
      } else {
        setOnCompleted(false);
        // showMessage({
        //   message: "Message",
        //   description: "Congrats! Workout completed successfully.",
        //   type: "default",
        //   backgroundColor: COLORS.lightGreen,
        //   color: COLORS.white,
        // });
        props.navigation.navigate("Workouts", {
          allComplete: props.route.params.allComplete,
        });
      }
    } else {
      let weekTarget = goalData?.weekTarget;
      let workoutPerWeek =
        workout?.phase[workout.phase.length - 1]?.workoutPerWeek;
      let compareWeek =
        weekTarget > workoutPerWeek ? workoutPerWeek : weekTarget;
      var lastPhaseWorkouts =
        workout?.phase[workout?.phase?.length - 1]?.workouts;

      // if (lastPhaseWorkouts?.length) {
      if (true) {
        // lastPhaseWorkouts = lastPhaseWorkouts?.filter(item => item?. workoutId )

        // const { id } = props?.route?.params;

        if (
          // (id === lastPhaseWorkouts[lastPhaseWorkouts.length -1].workoutId ) &&
          // workout?.phase?.length == goalData?.workoutPhase &&
          // compareWeek == (goalData?.weekGoal || 0)
          false
        ) {
          props.navigation.navigate("Phase complete");
        } else {
          if (dashboard == true || dashboard == "true") {
            setOnCompleted(false);
            // showMessage({
            //   message: "Message",
            //   description: "Congrats! Workout completed successfully.",
            //   type: "default",
            //   backgroundColor: COLORS.lightGreen,
            //   color: COLORS.white,
            // });
            props.navigation.navigate("Workout", {
              allComplete: props.route.params.allComplete,
            });
          } else {
            setOnCompleted(false);
            // showMessage({
            //   message: "Message",
            //   description: "Congrats! Workout completed successfully.",
            //   type: "default",
            //   backgroundColor: COLORS.lightGreen,
            //   color: COLORS.white,
            // });
            props.navigation.navigate("Workouts", {
              allComplete: props.route.params.allComplete,
            });
          }
        }
      }
    }
  };

  const onBack = () => {
    if (dashboard === "true" || dashboard) {
      props.navigation.navigate("Workout", {
        allComplete: props.route.params.allComplete,
      });
    } else {
      props.navigation.navigate("Workouts", {
        allComplete: props.route.params.allComplete,
      });
    }
    // if(exerciseLength?.length>1 || exer>1){
    //   props.navigation.navigate("Workout")
    // }else{
    //   props.navigation.navigate("Workouts")
    // }
  };

  useEffect(() => {
    if (props?.route?.params?.onLoaderTrue == true) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
      }, 1500);
    } else {
      setLoader(false);
    }
  }, []);

  const renderWeekGoal = () => {
    if (dashboard === "true" || dashboard) {
      return (
        <ProgressIndicatorWhite
          title={"Week's goal"}
          progressValue={
            goalData?.weekTarget > weekGoalData
              ? weekGoalData
              : goalData?.weekTarget || goalData?.weekGoal
          }
          targetValue={goalData?.weekGoal}
          gradient
        />
      );
    } else {
      return (
        <ProgressIndicatorWhite
          title={"Week's goal"}
          progressValue={
            getProfileData?.totalWorkout + workoutActivityCount || 0
          }
          targetValue={getProfileData?.workoutGoal || 0}
          gradient
        />
      );
    }
  };
  const onShare = () => {
    ref.current.capture().then((uri) => {
      console.log("do something with ", uri);
      Share.open({ url: uri })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    });
  };
  console.log({ getProfileData });
  const ref = useRef();
  if (!false)
    return (
      <ViewShot
        ref={ref}
        options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}
        style={{ flex: 1 }}
      >
        <MainScreen lightContent statusBarColor={"transparent"} translucent>
          {isLoader ? <Loader loading={true} /> : null}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: Platform.OS == "android" ? 30 : 0,
              }}
            >
              <Text
                style={[styles.headerTextStyle, { flex: 1, textAlign: "left" }]}
              >
                {getProfileData?.fname}
              </Text>
              <TouchableOpacity
                onPress={onCompleteWorkout}
                disabled={disableClose}
              >
                <CloseFoodIcon color={COLORS.grey_3} width={40} height={40} />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <GradientContainer
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 120 / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: backgroundImage }}
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                  }}
                />
              </GradientContainer>
              <Text
                style={[
                  styles.headerTextStyle,
                  { fontFamily: "Manrope-Bold", marginTop: 10 },
                ]}
              >
                {workoutTitle}
              </Text>
              <Text
                style={[
                  styles.headerTextStyle,
                  {
                    fontFamily: "Manrope-Medium",
                    marginBottom: 10,
                    fontSize: 16,
                    color: COLORS.lightGreen,
                  },
                ]}
              >
                {"workout completed"}
              </Text>
              {/* <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{backgroundColor:COLORS.light_grey,paddingHorizontal:15,paddingVertical:10,borderColor:COLORS.grey_3,borderWidth:0.5,borderRadius:20,marginVertical:10,flexDirection:"row",alignItems:"center"}}>
          <Ionicons name='ios-reload' size={18}/>
          <Text style={{...styles.headerTextStyle,fontSize:14,marginLeft:5}}>
            Try it again
          </Text>
        </TouchableOpacity> */}
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: COLORS.light_grey,
                  paddingVertical: 10,
                  marginHorizontal: 20,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={styles.titleTxt}>Summary</Text>
                <Text style={styles.upnextTitle}>
                  Day {props.route.params.day} (
                  {moment(new Date()).format("MMM D,yy")})
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: COLORS.light_grey,
                  paddingVertical: 10,
                  marginHorizontal: 20,
                  paddingHorizontal: 10,
                  marginTop: 5,
                }}
              >
                <View style={style.rowView}>
                  <Text style={styles.upnextTitle}>Completed</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[styles.upnextTitle, { color: COLORS.lightGreen }]}
                    >
                      {exerciseLength?.length || 0}
                    </Text>
                    <Text style={styles.upnextTitle}>
                      /{exerciseLength?.length || 0}
                    </Text>
                  </View>
                </View>

                <View style={style.rowView}>
                  <Text style={styles.upnextTitle}>Duration</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        styles.upnextTitle,
                        { color: COLORS.lightGreen, textTransform: "none" },
                      ]}
                    >
                      {formattedTime(timeElapses)}m/
                    </Text>
                    <Text style={styles.upnextTitle}>60</Text>
                  </View>
                </View>

                <View style={style.rowView}>
                  <Text style={styles.upnextTitle}>Score</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[styles.upnextTitle, { color: COLORS.lightGreen }]}
                    >
                      {totalCount.toFixed()}
                      {/* {(repsScores.scores).toFixed()} */}
                    </Text>
                    <Text style={styles.upnextTitle}>
                      /{newScores.toFixed()}
                    </Text>
                  </View>
                </View>

                <View style={style.rowView}>
                  <Text style={styles.upnextTitle}>Sets</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[styles.upnextTitle, { color: COLORS.lightGreen }]}
                    >
                      {totalSets}
                    </Text>
                    <Text style={styles.upnextTitle}>/{total}</Text>
                  </View>
                </View>

                <View style={style.rowView}>
                  <Text style={styles.upnextTitle}>Reps</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[styles.upnextTitle, { color: COLORS.lightGreen }]}
                    >
                      {totalReps}
                    </Text>
                    <Text style={styles.upnextTitle}>/{repsScores?.reps}</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text style={{ marginHorizontal: 20, marginTop: 10 }}>
                  How was your session?
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 15,
                    marginVertical: 20,
                  }}
                >
                  {["Amazing", "Good", "Hmm ok", "Awful"]?.map((val, index) => {
                    return (
                      <PhaseCard
                        key={index}
                        title={val}
                        // subtitle={`Week ${1} to ${props?.phase[0]?.weeks|| 0}`}
                        // phaseArr={props.phase}
                        isActive
                        disabled={false}
                        // phase={props?.goal?.workoutWeek === index+1}
                        phase={exp === val}
                        textStyle={{
                          fontSize: 14,
                          fontFamily: "Manrope-Regular",
                        }}
                        // onPress={() => {}}
                        onPress={() => setExp(val)}
                      />
                    );
                  })}
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: 20,
                  flex: 1,
                  marginBottom: 20,
                  justifyContent: "flex-end",
                }}
              >
                <GradientButton
                  title={"  Share Achievement"}
                  onPress={onShare}
                  style={{
                    padding: 6,
                    paddingHorizontal: 10,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  textStyle={{ fontSize: 16 }}
                  leftIcon={
                    <Ionicons
                      name="md-share-social-outline"
                      color={COLORS.white}
                      size={20}
                    />
                  }
                />
              </View>
            </View>
          </ScrollView>
        </MainScreen>
      </ViewShot>
    );
  return (
    <MainScreen lightContent statusBarColor={"transparent"} translucent>
      {isLoader ? <Loader loading={true} /> : null}
      <View
        // source={{
        //   uri: backgroundImage || require('../../../../assets/Excercise.png'),
        // }}
        style={styles.imgContainer}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onBack()}
            style={{ borderColor: "white", paddingVertical: 5, left: 10 }}
          >
            <BackArrowIcon color={"white"} />
          </TouchableOpacity>
          <Text style={[styles.headerTextStyle, { textAlign: "center" }]}>
            {workoutTitle}
          </Text>
          <TouchableOpacity activeOpacity={0.5}></TouchableOpacity>
        </View>
        <View style={styles.playcontainer}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Manrope-Regular",
              color: "black",
              fontWeight: "500",
            }}
          >
            Wel done, {getProfileData?.fname} !
          </Text>
          <View style={styles.flexDirection}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Manrope-Bold",
                color: "#0DB8DA",
                // fontWeight: '500',
              }}
            >
              Workout is completed
            </Text>
          </View>
          <View style={{ marginTop: 25 }}></View>
          <View
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              // flex:1,
              width: "90%",

              height: 80,
              // margin: 10,
            }}
          >
            <View
              style={[
                styles.progressIndicatorContainer,
                {
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center",
                  marginTop: 20,
                },
              ]}
            >
              {/* {(dashboard === 'true' || dashboard === true) && (
                <ProgressIndicatorWhite
                  title={"Today's goal"}
                  progressValue={goalData?.dayTarget || 0}
                  targetValue={goalData?.dayGoal || 0}
                  gradient
                />
              )} */}
              {
                <View
                  style={
                    dashboard === "true" || dashboard
                      ? { flex: 1, marginLeft: "30%" }
                      : {
                          marginLeft: "30%",
                          flex: 1,
                          height: 50,
                        }
                  }
                >
                  {renderWeekGoal()}
                </View>
              }
            </View>
          </View>
        </View>

        {/* <View style={styles.excercsieContainer}>
          {cir ? (
            <Text style={styles.excerciseDetailStyle}>
              {cir + ' ' + 'circuits'}
            </Text>
          ) : null}
          {exer !== undefined ? (
            <Text style={styles.excerciseDetailStyle}>
              {exer + ' ' + 'exercises'}
            </Text>
          ) : null}
          {exerciseLength?.length !== undefined ? (
            <Text style={styles.excerciseDetailStyle}>
              {exerciseLength?.length + ' ' + 'exercises'}
            </Text>
          ) : null}
          <Text style={styles.excerciseDetailStyle}>
            {`${Math.ceil((dataById?.time ? dataById?.time : 1080) / 60)} min`}
          </Text>
        </View> */}
      </View>

      <View
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          position: "absolute",
          top: height * 0.375,
          padding: 10,
          width: "100%",
          bottom: 0,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.light_grey,
            width: "100%",
            // margin: 10,
            flexDirection: "row",
            borderRadius: 10,
            padding: 5,
          }}
        >
          <Image
            source={{ uri: backgroundImage }}
            style={{
              width: 80,
              height: 80,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            }}
          />
          <View style={{ paddingLeft: 10, justifyContent: "center" }}>
            <Text style={styles.excerciseDetailStyle}>{workoutTitle}</Text>
            <Text style={styles.excerciseDetailStyle2}>
              {`${Math.ceil(
                (dataById?.time ? dataById?.time : 1080) / 60
              )} min`}
            </Text>
          </View>
        </View>
        <View style={{ opacity: isShared ? 0.4 : 1 }}>
          <Button
            btnStyle={[styles.btnStyle]}
            textStyle={styles.titleTextStyle}
            title="Share via community"
            share={true}
            // onPress={onShare}
            onPress={() => !isShared && onShareCommunity()}
          />
        </View>

        <Button
          btnStyle={[styles.btnStyle]}
          textStyle={styles.titleTextStyle}
          title={"Add to favourite workouts"}
          onPress={onAddFav}
        />
        {onCompleted ? (
          <View style={{ height: 50, marginTop: 25 }}>
            <GradientButton
              title="Complete Workout"
              disabled={false}
              onPress={() => onCompleteWorkout()}
            />
          </View>
        ) : null}
      </View>
    </MainScreen>
  );
});
const style = StyleSheet.create({
  GooglePlusStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc4e41",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.light_grey,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  FacebookStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#485a96",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 40,
    borderRadius: 5,
    margin: 5,
  },

  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
  },

  TextStyle: {
    color: "#fff",
    marginBottom: 4,
    marginRight: 20,
  },

  SeparatorLine: {
    backgroundColor: "#fff",
    width: 1,
    height: 40,
  },
  subHiitContainer: {
    top: height * 0.1275,
    padding: 10,
    width: "100%",
    bottom: 0,
    // position:'absolute',top:height*0.75, padding:10, width:'100%',
  },
});
export default HiitComplete;
