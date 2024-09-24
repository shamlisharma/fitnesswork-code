import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
  TouchableNativeFeedback,
  SafeAreaView,
} from "react-native";
import convertToCache from "react-native-video-cache";
import FastImage from "react-native-fast-image";
import GradientContainer from "../../../components/GradientContainer";
import { MainScreen } from "../../../common/Screen";
import { hasNotch } from "react-native-device-info";
import {
  BackArrowIcon,
  CommunityEyeIcon,
  HeartOutlined,
  TipsIcon,
} from "../../../Svg";
import GradientButton from "../../../components/GradientButton";
import ExcerciseCard from "./ExcerciseCard";
import { useDispatch, useSelector } from "react-redux";
import { getExcercisesByWorkoutId } from "../../../_action/WorkoutAction";
import { COLORS, DeviceScreen } from "../../../common/Constant";
import settings from "../../../config/settings";
import { usersService } from "../../../services/ApiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";
import Imageb from "react-native-image-progress";
import { showMessage } from "react-native-flash-message";

const { height, width } = Dimensions.get("window");

const ExercisePatternScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [workoutByIdData, setWorkoutByIdData] = useState("");

  const [dashboardData, setDashboardData] = useState(false);
  const { loading, data, error } = useSelector(
    (state) => state?.workout?.workoutData
  );
  let mediaPath = settings.cdnUrl.url;
  const item = route?.params?.item;
  console.log({ "route?.params":route?.params });

  useEffect(async () => {
    await AsyncStorage.removeItem("wId");
    await AsyncStorage.removeItem("wDay");
    let params = {
      isFilter: 1,
      workoutId: route?.params?.workoutId,
    };

    dispatch(getExcercisesByWorkoutId(route?.params?.workoutId));
    // usersService.getWorkouts(params)
    // usersService.getAllWorkoutsList(params.workoutId).then(res => {
    //   console.log("workout from workout id",res);
    //   setWorkoutByIdData(res?.data?.responseData?.result[0]);
    // });
    usersService.getWorkouts(params).then((res) => {
      console.log(
        "workout from workout id",
        JSON.stringify(res)
      );
      if (res?.data?.responseData?.result.length > 0) {
        let filter = {
          ...res?.data?.responseData?.result[0],
          exercises: res?.data?.responseData?.result[0].exercises.filter(
            (item) => item.title
          ),
        };
        console.log({ filter });
        //olde code res?.data?.responseData?.result[0]
        setWorkoutByIdData(filter);
      }
    });
  }, []);
  // console.log('settings gettomg===',mediaPath)
  // console.log('workby id data===',workoutByIdData)
  // console.log('route oming====',route.params);
  useEffect(() => {
    if (route?.params?.fromDashboard === "true") {
      setDashboardData(true);
    }
  }, [navigation]);

  useEffect(() => {
    //   let params = {
    //     isFilter: 1,
    //     workoutId: props?.workoutId,
    // };
    // let workData = await usersService.getWorkouts(params);
  }, []);

  const onWorkoutHere = () => {
    let dummyData = [];
    dummyData = [...workoutByIdData?.exercises];
    let index = 0;

    console.log("dummyData neeraj-====", dummyData);
    // while (index <= dummyData.length - 1) {
    //   let data = {};
    //   if (dummyData[index]?.exerciseVideo?.includes(mediaPath)) {
    //     data = convertToCache(dummyData[index].exerciseVideo);
    //   } else {
    //     data = convertToCache(mediaPath + dummyData[index].exerciseVideo);
    //   }

    //   dummyData[index].exerciseVideo = data;

    //   index++;
    // }
    // console.log(workoutByIdData?.exercises)
    var data = workoutByIdData?.exercises.map((item, index) => ({
      ...item,
      setInfo: item.setInfo.map((_item) => ({ ..._item, completed: false })),
    }));

    navigation.navigate("Excercise", {
      exerciseInfoData: data, //workoutByIdData?.exercises,
      wId: route?.params?.workoutid,
      dashboard: dashboardData,
      workoutId: route?.params?.workoutId,
      cWId: route?.params?.cWorkId,
      cWorkWeek: route?.params?.cWorkWeek,
      cPhase: route?.params?.cPhase,
      currentDay: route?.params?.currentDay,
      index: 0,
      day: route?.params?.day,
      category: route?.params?.category,
      viewFrom: true,
      workoutTitle: route?.params?.title,
      backgroundImage: mediaPath + workoutByIdData?.workoutImage,
      allCompleteWorkout: route?.params?.allCompleteWorkout,
      selectedWeek:route?.params?.selectedWeek,
      completedDay:route?.params?.completedDay
    });
  };

  const excerciseListHeaderView = () => {
    return (
      <>
        {workoutByIdData?.equipments?.length ? (
          <View style={[styles.hiitCompleteItemView, styles.whatYouNeedView]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.itemTitle}>{"What will you need"}</Text>
            </View>
            <View style={{ flex: 3, alignItems: "flex-end" }}>
              <Text style={styles.itemTitle1}>
                {`${workoutByIdData?.equipments?.length} items`}
              </Text>
            </View>
          </View>
        ) : null}
        {/* <Text style={{ color: 'red'}}>sdff</Text> */}
        {workoutByIdData?.equipments?.length ? (
          <ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row" }}>
              {workoutByIdData?.equipments?.map((item, index) => {
                return (
                  <View style={styles.hiitCompleteItemSubContainer}>
                    <View style={styles.hiitCompleteIImg}>
                      {/* <Image
                        source={{uri: mediaPath + item.equipmentImage}}
                        style={{
                          height: '100%',
                          width: '100%',
                          resizeMode: 'contain',
                        }}
                      /> */}
                      <Imageb
                        source={{ uri: mediaPath + item.equipmentImage }}
                        style={{
                          height: "100%",
                          width: "100%",
                          resizeMode: "contain",
                        }}
                        indicator={
                          <ActivityIndicator
                            size={"large"}
                            color={COLORS.lightGreen}
                          />
                        }
                      />
                    </View>
                    <View style={styles.hiitCompleteTitle}>
                      <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        ) : null}
      </>
    );
  };

  const onAddFav = () => {
    let req = {
      workoutId: route?.params?.workoutId,
    };
    console.log({ req });
    usersService.addWorkoutInFavourite(req).then((res) => {
      console.log({ res });
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MainScreen lightContent statusBarColor={"transparent"} translucent>
        {loading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size={"large"} color={COLORS.lightGreen} />
          </View>
        ) : (
          <>
            {workoutByIdData?.exercises?.length != undefined && (
              <FastImage
                // resizeMode='contain'
                source={{ uri: mediaPath + workoutByIdData?.workoutImage }}
                style={[styles.headerImage, styles.eyeIconContainer]}
              >
                <View>
                  {/* <TouchableOpacity 
                onPress={()=>onWorkoutHere()}
              >
                <CommunityEyeIcon color={COLORS.lightGreen}/>
              </TouchableOpacity> */}
                </View>
                {/* <View style={styles.overlayStyle} /> */}
                <View style={styles.headerContainer}>
                  <View style={styles.blackSheetOverlay} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: -5,
                    }}
                  >
                    <TouchableOpacity
                      hitSlop={{ top: 25, left: 25, right: 25, bottom: 25 }}
                      onPress={() => navigation.goBack()}
                      style={[styles.backButtonStyle, { marginLeft: 10 }]}
                    >
                      <BackArrowIcon color={"white"} />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.headerTextStyle,
                        {
                          textTransform: "capitalize",
                          flex: 1,
                          marginLeft: 30,
                        },
                      ]}
                    >
                      {workoutByIdData?.title}
                    </Text>
                    <View
                      style={{
                        // flex: 0.1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginRight: 10,
                      }}
                    >
                      {/* <TouchableOpacity style={{marginRight:10}} onPress={()=>{
                        onAddFav()
                      }}>
                        <HeartOutlined/>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() => navigation.navigate("WorkoutTips")}
                      >
                        <TipsIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {!loading && workoutByIdData?.exercises?.length ? (
                  <View style={styles.headerTextContainer}>
                    <View style={styles.blackSheetOverlay} />

                    <View>
                      <Text style={styles.excerciseDetailStyle}>{`${
                        workoutByIdData?.exercises?.length == undefined
                          ? null
                          : workoutByIdData?.exercises?.length
                      } ${
                        workoutByIdData?.exercises?.length === 1
                          ? "exercise"
                          : "exercises"
                      }`}</Text>
                    </View>

                    <View>
                      <Text style={styles.excerciseDetailStyle}>
                        {`Est. Time: ${Math.ceil(
                          workoutByIdData?.time ? workoutByIdData?.time : null
                        )} min`}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
              </FastImage>
            )}
            {/* <View style={{right:0,position:"absolute",marginRight:189}}>
          <TouchableOpacity style={{marginTop:Platform.OS == "android" ? DeviceScreen.height * 0.322 : DeviceScreen.height * 0.322,}} onPress={()=>onWorkoutHere()}>
                <CommunityEyeIcon color={COLORS.lightGreen}/>
              </TouchableOpacity>
              </View> */}

            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              LoadingIndicatorComponent={ActivityIndicator}
              style={{
                // position: 'absolute',
                // top: workoutByIdData?.equipments?.length ? Platform.OS == "android" ?height * 0.595:  height * 0.575 : height *0.375,
                padding: 10,
                width: "100%",
                // bottom: 0,
              }}
              ListHeaderComponent={excerciseListHeaderView()}
              data={workoutByIdData?.exercises}
              renderItem={({ item, index }) => (
                <ExcerciseCard
                  item={item}
                  setCount={item?.setInfo?.length}
                  workoutid={route?.params?.workoutId}
                  exerciseInfoData={workoutByIdData?.exercises}
                  exersizeData={item}
                  fromDashboard={route.params.fromDashboard}
                  dashboardData={dashboardData}
                  workoutPhase={route?.params?.workoutPhase}
                  phase={route?.params?.phase}
                  cWorkId={route?.params?.currentWorkId}
                  cWorkWeek={route?.params?.curWeek}
                  cPhase={route?.params?.phase}
                  index={index}
                  dBoard={route?.params?.fromDashboard}
                  day={route?.params?.day}
                  category={route?.params?.category}
                />
              )}
              contentContainerStyle={{ paddingBottom: 45 }}
              ListFooterComponent={<View style={{ marginBottom: 55 }}></View>}
            />
          </>
        )}
        {console.log("==>>", route?.params?.allCompleteWorkout)}
        {console.log(
          "workoutByIdData",
          workoutByIdData,
          "------alert(route.params.allCompleteWorkout)- ",
          route?.params
        )}
        {!loading &&
          (workoutByIdData?.exercises?.length 
          // && route?.params?.curWeek === route?.params?.selectedWeek 
          ? (
            <TouchableOpacity
              onPress={onWorkoutHere}
              style={styles.startWorkoutButtonView}
            >
              <GradientContainer
                disabled={false}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.startButtonTitleLabel}>{route?.params?.completedDay?"View":"Start Workout"}</Text>
              </GradientContainer>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                height: 30,
                backgroundColor: "#fff",
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", color: "red" }}>
                *Workout in future week. you can't start yet
              </Text>
            </View>
          ))}
      </MainScreen>
    </SafeAreaView>
  );
};

export default ExercisePatternScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: hasNotch() ? scale(45) : scale(35),

    position: "absolute",
    top: 0,
    width,
    // paddingBottom: 5
  },
  startWorkoutButtonView: {
    position: "absolute",
    alignSelf: "center",
    height: scale(48),
    width: width - scale(20),
    bottom: scale(10),
    borderRadius: scale(25),

    // backgroundColor: 'red',
    overflow: "hidden",
  },

  startButtonTitleLabel: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: "Manrope-Regular",
  },
  blackSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    opacity: 0.5,
  },
  headerTextStyle: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  excerciseDetailStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
    color: "white",
    // flex: 1,
    textAlign: "center",
  },
  headerImage: {
    height: width,
    width: width,
    //  position: 'absolute'
  },

  eyeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },

  whatYouNeedView: {
    // marginTop: height * 0.375 - 20
  },

  overlayStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backButtonStyle: {
    borderColor: "white",
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingTop:"50%",
    zIndex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: scale(5),
    // marginBottom: 5,
    paddingHorizontal: 20,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hiitCompleteItemSubContainer: {
    height: "100%",
    width: 120,
    marginHorizontal: 8,
  },
  hiitCompleteIImg: {
    height: 75,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#F9F9F9",
  },
  hiitCompleteTitle: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: "Manrope-Bold",
    color: "#4F4F4F",
  },
  itemTitle1: {
    color: "#BDBDBD",
    fontSize: 14,
    fontFamily: "Manrope-Regular",
  },
  itemText: {
    color: "#828282",
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    textTransform: "capitalize",
  },
  hiitCompleteItemView: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // top:Platform.OS == "android" ? height * 0.375 : height * 0.329,
    padding: 10,
  },
});

// title={item.title} subtitle={`${data?.setsPerExercise} Sets`} image={{uri: mediaPath + item.thumbImage}}
