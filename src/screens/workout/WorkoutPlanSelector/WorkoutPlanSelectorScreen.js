import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  Dimensions,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InlineModal from "../../../common/InlineModal";
import { Loader } from "../../../common/Loader";
import { updateAllWorkoutPageName } from "../../../_action/CommonAction";
import { MainScreen, Screen } from "../../../common/Screen";
import { usersService } from "../../../services/ApiServices";
import { getDailyFoodTarget } from "../../../_action/FoodAction";
import { getProfileAction } from "../../../_action/ProfileAction";
import { getWorkoutProgramme } from "../../../_action/WorkoutAction";
import { COLORS } from "../../../common/Constant";
import AlertModal from "../../modal/AlertModal";
import WorkoutPlanCard from "./WorkoutPlanCard";
import { showMessage } from "react-native-flash-message";
import InformationModal from "../../../components/InformationModal";
import CustomSearch from "../../../components/CustomSearch";
import { filter } from "bluebird";

let height = Dimensions.get("window").height;

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const WorkoutPlanSelectorScreen = React.memo((props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [planData, setPlanData] = useState([]);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterData, setFilter] = useState([]);
  const [infoData, setInfoData] = useState(null);
  const [clickInfo, setClickInfo] = useState(false);
  const workoutPlan = useSelector(
    (state) =>
      state?.profileReducer?.profile?.data?.responseData?.userProfile.planName
  );
  const food = useSelector(
    (state) => state?.food?.dailyFoodTarget?.caloriesTarget
  );
  const workoutProgrammeId = useSelector(
    (state) =>
      state?.profileReducer?.profile?.data?.responseData?.userProfile
        .workoutProgrammeId
  );
  const [loader, setLoader] = useState(true);
  const [selectrdProgrrame, setSelectedProgramme] = useState([]);
  const [workoutSuccess, setWorkoutSuccess] = useState(false);
  const [changeProgram, setChangeProgram] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const profileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData?.userProfile
  );

  useEffect(() => {
    const unsubscribed = props.navigation.addListener("focus", async () => {
      await AsyncStorage.setItem("workoutPage", "allprograms");
      // getWorkoutProgrammes();
      //setLoader(true);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribed;
  }, [props.navigation]);

  // console.log("workrout programs coming===", planData);
  // console.log('profile data===', profileData);
  useEffect(() => {
    getWorkoutProgrammes();
    dispatch(getDailyFoodTarget());
  }, []);
  // console.log('food target', food);

  const getWorkoutProgrammes = async () => {
    let req = {
      isChallenge: 0,
      isReviewed:1
    };
    try {
      const res1 = await usersService.getWorkoutProgrammes(req);
      const res = await usersService.getWorkoutProgrammesNew(req);
    //  console.log({res1,res});
      setLoader(false);
      if (res?.data?.statusCode === 1) {
        let result = res?.data?.responseData?.result;

        // result = result.filter(
        //   (item, index) => profileData?.workoutProgrammeId != item?._id,
        // );

        // console.log(data.length ,"data.length")
        let data = res?.data?.responseData?.result.filter(
          (item) => item.isReviewed == 1
        );
        // console.log("workoutDataRefresh", data);

        setPlanData(data);
        setFilter(data);
        setSelectedProgramme(res1?.data?.responseData?.myWorkoutProgramme);

        if (res1?.data?.responseData?.myWorkoutProgramme.length > 0) {
          const value = await AsyncStorage.getItem("keys");

          if (value != null && value != "") {
            if (value === res1?.data?.responseData?.myWorkoutProgramme[0]._id) {
              console.log(
                "changedValue",
                value === res1?.data?.responseData?.myWorkoutProgramme[0]._id
              );
            } else {
              console.log(
                "changedValue",
                value === res1?.data?.responseData?.myWorkoutProgramme[0]._id
              );
              setTimeout(() => {
                navigation.navigate("exerciseFilter", {
                  handleBack: handleBack,
                  index: selectIndex,
                });
                AsyncStorage.setItem(
                  "keys",
                  res1?.data?.responseData?.myWorkoutProgramme[0]._id + ""
                );
              }, 500);
            }
          } else {
            setTimeout(() => {
              navigation.navigate("exerciseFilter", {
                handleBack: handleBack,
                index: selectIndex,
              });
              AsyncStorage.setItem(
                "keys",
                res1?.data?.responseData?.myWorkoutProgramme[0]?._id + ""
              );
            }, 500);
          }
        } else {
          setTimeout(() => {
            navigation.navigate("exerciseFilter", {
              handleBack: handleBack,
              index: selectIndex,
            });
          }, 500);
        }
        // console.log("data for programme 3377777", res1?.data?.responseData?.myWorkoutProgramme.length);
      }
    } catch (e) {
      setLoader(false);
      console.error("error ", e);
    }
  };

  useEffect(() => {
    if (selectrdProgrrame.length) {
      let data = planData.filter(
        (item, index) => item._id != selectrdProgrrame[0]._id
      );
      // console.log("data for programme 33", data);
      setPlanData(data);
    }
  }, [selectrdProgrrame]);

  const onChangeProgram = () => {
    setChangeProgram(true);
  };

  const _selectWorkoutPlan = async (id) => {
    if (workoutPlan == "Free") {
      props.navigation.navigate("Membership", {
        filter: "planSelector",
        programmeId: id,
      });
    } else {
      setLoader(true);
      try {
        var param = {
          programmeId: id,
        };
        let data = {
          workoutProgrammeId: id,
          workoutProgrammeHistory:[{}]
      }
        const res = await usersService.setMyWorkoutProgrammes(param);
        const res1 = await usersService.createWorkoutProgramHistory(data)
        console.log('res workout program', res1);
        setLoader(false);
        if (res.data.statusCode === 1) {
          setWorkoutSuccess(true);
          dispatch(getWorkoutProgramme());
          // getWorkoutProgrammes();
          dispatch(getProfileAction());

          navigation.navigate("Workout", { fromProgramSelection: true });
        }
      } catch (error) {
        setLoader(false);
        console.error("error ", error);
      }
    }
  };

  const headerComponent = () => {
    return (
      <>
        {selectIndex != -1 && planData.length == 0
          ? null
          : selectrdProgrrame?.map((item) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log(item);
                    navigation.replace("Workout");
                  }}
                >
                  <WorkoutPlanCard {...item} status={true} />
                </TouchableOpacity>
              );
            })}
      </>
    );
  };

  // const workoutPlanSelection = () => {
  //   Alert.alert(
  //     'Upgrade Plan',
  //     'To access workout programmes please upgrade your account.',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {text: 'OK', onPress: () => navigation.navigate('Membership')},
  //     ],
  //     {
  //       cancelable: false,
  //     },
  //   );
  // };

  // console.log('planData===',planData)
  // const footerView = () => {
  //   return (
  //     <>
  //       {profileData?.planName == 'Free' ? (
  //         <TouchableOpacity
  //         onPress={workoutPlanSelection}
  //         activeOpacity={0.7}
  //         style={styles.containerView}>
  //           <View style={styles.imageWholeContainerView}>
  //             <Image
  //               source={require('../../../../assets/workoutplan.png')}
  //               style={styles.imageView}
  //             />
  //           </View>
  //           <Image
  //             source={require('assets/ShadedRectangle.png')}
  //             style={styles.shaddedImageView}
  //           />
  //           <View>
  //             <Text style={styles.titleLabel}>Customized program</Text>
  //             <View style={styles.lineContainerView} />
  //             <View style={styles.lineContainerView} />
  //           </View>
  //         </TouchableOpacity>
  //       ) : (
  //         <View />
  //       )}
  //     </>
  //   );
  // };

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);

  //  if(selectIndex == -1 ){
  //   getWorkoutProgrammes()
  //  }else{

  //   handleBack(filterTitle,selectIndex)
  //  }

  //   wait(2000).then(() => setRefreshing(false));
  // }, []);

  const onRefresh = () => {
    if (selectIndex == -1) {
      getWorkoutProgrammes();
    } else {
      handleBack(filterTitle, selectIndex);
    }

    wait(2000).then(() => setRefreshing(false));
  };

  const handleFilter = (text) => {
    let filterList = filterData.filter((item) =>
      item?.title.toLowerCase().includes(text.toLowerCase())
    );
    setPlanData(filterList);
  };

  const handleBack = async (filter, index) => {
    // console.log("selectIndex", index)
    setSelectIndex(index);
    setFilterTitle(filter);
    console.log({filter});
    const res = await usersService.getExerciseFilter(filter+"&isReviewed=1");
    console.log({ "response from filter":res });
    let data = res?.data?.responseData?.result.filter(
      (item) => item.isReviewed == 1
    );
    setPlanData(data);
  };
  return (
    <MainScreen>
      {loader ? <Loader loading={true} /> : null}
      {workoutSuccess ? (
        <AlertModal
          alert={workoutSuccess}
          onResume={() => {
            setWorkoutSuccess(false);
          }}
          headertitle="Workout"
          content={"Workout programme added successfully."}
          cancelBtn=""
          saveBtn="Ok"
          width={80}
        />
      ) : null}
      <View style={{ flex: 1, height: height }}>
        <CustomSearch
          onChangeText={handleFilter}
          onPress={() =>
            navigation.navigate("exerciseFilter", {
              handleBack: handleBack,
              index: selectIndex,
            })
          }
        />
        <FlatList
          style={{ padding: 10, paddingTop: 20 }}
          data={planData || []}
          extraData={[planData, selectrdProgrrame]}
          // bounces={false}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          contentContainerStyle={{ paddingBottom: 25 }}
          ListHeaderComponent={
            selectrdProgrrame.length == 0 || profileData?.planName == "Free"
              ? null
              : headerComponent()
          }
          // ListFooterComponent={footerView()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={async () => {
                setClickInfo(false);
                setVisible(true);
                setInfoData(item);

                // workoutPlan == "Free"
                //   ? Alert.alert(
                //       "Upgrade Plan",
                //       "To access workout programmes please upgrade your account.",
                //       [
                //         {
                //           text: "Cancel",
                //           onPress: () => console.log("Cancel Pressed"),
                //           style: "cancel",
                //         },
                //         {
                //           text: "OK",
                //           onPress: () => _selectWorkoutPlan(infoData?._id),
                //         },
                //       ],
                //       {
                //         cancelable: false,
                //       }
                //     )
                //   : workoutPlan !== "Free" && workoutProgrammeId == null
                //   ? Alert.alert(
                //       "Alert",
                //       "Do you want to select workout programme?",
                //       [
                //         {
                //           text: "Cancel",
                //           onPress: () => console.log("Cancel Pressed"),
                //           style: "cancel",
                //         },
                //         {
                //           text: "OK",
                //           onPress: () => _selectWorkoutPlan(infoData?._id),
                //         },
                //       ],
                //       {
                //         cancelable: false,
                //       }
                //     ):
                //    Alert.alert(
                //       "Alert",
                //       "Would you like to switch workout programme? ",
                //       [
                //         {
                //           text: "Cancel",
                //           onPress: () => console.log("Cancel Pressed"),
                //           style: "cancel",
                //         },
                //         {
                //           text: "OK",
                //           onPress: () => {
                //             setInfoData(null);
                //             _selectWorkoutPlan(infoData?._id);
                //           },
                //         },
                //       ],
                //       {
                //         cancelable: false,
                //       }
                //     );
              }}
              activeOpacity={0.7}
            >
              <WorkoutPlanCard
                {...item}
                status={false}
                planName={profileData?.planName}
                infoPress={() => {
                  setClickInfo(true);
                  setVisible(true);
                  setInfoData(item);
                }}
              />
            </TouchableOpacity>
          )}
        />
        <InformationModal
          visible={visible}
          label={clickInfo ? "" : infoData?.title}
          onClose={() => {
            setClickInfo(false);
            setVisible(false);
            setInfoData(null);
          }}
          onDismiss={() => {
            if (infoData != null) {
              console.log({ infoData });
              workoutPlan == "Free"
                ? Alert.alert(
                    "Upgrade Plan",
                    "To access workout programmes please upgrade your account.",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => _selectWorkoutPlan(infoData?._id),
                      },
                    ],
                    {
                      cancelable: false,
                    }
                  )
                : workoutPlan !== "Free" && workoutProgrammeId == null
                ? Alert.alert(
                    "Alert",
                    "Do you want to select workout programme?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => _selectWorkoutPlan(infoData?._id),
                      },
                    ],
                    {
                      cancelable: false,
                    }
                  )
                : Alert.alert(
                    "Alert",
                    "Would you like to switch workout programme? ",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          setInfoData(null);
                          _selectWorkoutPlan(infoData?._id);
                        },
                      },
                    ],
                    {
                      cancelable: false,
                    }
                  );
            }
          }}
          onChoose={() => {
            setVisible(false);
            if (Platform.OS == "android") {
              setTimeout(() => {
                if (infoData != null) {
                  console.log({ infoData });
                  workoutPlan == "Free"
                    ? Alert.alert(
                        "Upgrade Plan",
                        "To access workout programmes please upgrade your account.",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => _selectWorkoutPlan(infoData?._id),
                          },
                        ],
                        {
                          cancelable: false,
                        }
                      )
                    : workoutPlan !== "Free" && workoutProgrammeId == null
                    ? Alert.alert(
                        "Alert",
                        "Do you want to select workout programme?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => _selectWorkoutPlan(infoData?._id),
                          },
                        ],
                        {
                          cancelable: false,
                        }
                      )
                    : Alert.alert(
                        "Alert",
                        "Would you like to switch workout programme? ",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              setInfoData(null);
                              _selectWorkoutPlan(infoData?._id);
                            },
                          },
                        ],
                        {
                          cancelable: false,
                        }
                      );
                }
              }, 2000);
            }
          }}
          info={clickInfo}
          description={
            clickInfo
              ? infoData?.description == ""
                ? "No Description Added!"
                : infoData?.description
              : ""
          }
        />
      </View>
    </MainScreen>
  );
});

const styles = StyleSheet.create({
  containerView: {
    height: 120,
    width: "100%",
    borderRadius: 3,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: COLORS.light_grey,
  },

  imageWholeContainerView: {
    height: "100%",
    width: "42.5%",
  },

  imageView: {
    width: "100%",
    height: "100%",
    // opacity: 0.3,
  },

  shaddedImageView: {
    height: "50%",
    width: "42.5%",
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  titleLabel: {
    fontSize: 15,
    color: COLORS.grey_2,
    marginLeft: 12,
    marginTop: 15,
    marginBottom: 10,
    fontFamily: "Manrope-SemiBold",
  },

  lineContainerView: {
    height: 8,
    width: "80%",
    borderRadius: 5,
    marginBottom: 15,
    marginLeft: 12,
    backgroundColor: COLORS.grey_4,
  },
});

export default WorkoutPlanSelectorScreen;
