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
  TouchableOpacity,
} from "react-native";
// import {  } from "react-native-gesture-handler";
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
import { secondsToTime } from "../../../utils/helper";

const HiitComplete2 = React.memo((props) => {
  const [exp, setExp] = useState("Amazing");
  const [newScores, setNewScores] = useState(0);
  const {
    backgroundImage,
    workoutTitle,
    currentWorkoutHistory,
  } = props.route.params;
  const  {
    completed,
    createdAt,
    duration,
    reps,
    score,
    sets,
  }=currentWorkoutHistory
    console.log({ currentWorkoutHistory });
    console.log(currentWorkoutHistory?.workoutData[0]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData?.userProfile
  );
  let totalSets = 0;
  let totalReps = 0;
  let totalCount = 0;
  let total = 0;
  let oldAllScores = 0;
  currentWorkoutHistory?.workoutData?.map((val, index) => {
    val?.reps?.map(e=>totalReps+=Number(e||0))
    totalSets+=val?.sets?.length||0
  });
  useEffect(async () => {
    let index1 = 0,
      oldscoress = 0;
    const exerciseInfoData = currentWorkoutHistory?.workoutData;
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
  const onCompleteWorkout = () => {
    // alert("cc");
    props.navigation.goBack(); //replace("Excercise");
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
  const ref = useRef();
  if (!false)
    return (
      <ViewShot
        ref={ref}
        options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}
        style={{ flex: 1 }}
      >
        <MainScreen lightContent statusBarColor={"transparent"} translucent>
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
              <TouchableOpacity onPress={onCompleteWorkout}>
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
                  {moment(new Date(createdAt)).format("MMM D,yy")})
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
                      {currentWorkoutHistory?.workoutData?.length||0}
                    </Text>
                    {/* <Text style={styles.upnextTitle}>
                      /{completed?.split("/")[1]}
                    </Text> */}
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
                      {secondsToTime(duration) }
                    </Text>
                    {/* <Text style={styles.upnextTitle}>60</Text> */}
                  </View>
                </View>

                <View style={style.rowView}>
                  <Text style={styles.upnextTitle}>Score</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[styles.upnextTitle, { color: COLORS.lightGreen }]}
                    >
                      {newScores}
                      {/* {(repsScores.scores).toFixed()} */}
                    </Text>
                    {/* <Text style={styles.upnextTitle}>
                      /{score?.split("/")[1]}
                    </Text> */}
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
                    {/* <Text style={styles.upnextTitle}>
                      /{sets?.split("/")[1]}
                    </Text> */}
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
                    {/* <Text style={styles.upnextTitle}>
                      /{reps?.split("/")[1]}
                    </Text> */}
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
                        isActive
                        disabled={false}
                        phase={exp === val}
                        textStyle={{
                          fontSize: 14,
                          fontFamily: "Manrope-Regular",
                        }}
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
export default HiitComplete2;
