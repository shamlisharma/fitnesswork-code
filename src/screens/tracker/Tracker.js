import React, { useEffect, useReducer, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { act } from "react-test-renderer";
import { COLORS } from "../../common/Constant";
import { MainScreen } from "../../common/Screen";
import GradientButton from "../../components/GradientButton";
import TabHeader from "../../components/header/TabHeader";
import { RightArrowIcon } from "../../Svg";
import { usersService } from "../../services/ApiServices";
import MyProgress from "../myProgress";

let Tracker = React.memo(function Tracker(props) {
  const { currentWeek, style, navigation } = props;
  const [arrayOfWeeks, setArrayOfWeeks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [tab, tabChange] = useState("Tracker");
  const [workout, setWorkout] = useState();
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData?.userProfile
  );
  const { data } = useSelector((state) => state?.workout?.workoutProgramme);
  // let workout = data?.data?.responseData?.result;
  console.log({ workout });
  const goalData = useSelector(
    (state) =>
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo
  );
  let req = {
    // isChallenge: 1,
    programmeId: getProfileData?.workoutProgrammeId,
  };

  useEffect(async () => {
    const resNew = await usersService.getWorkoutProgrammesNew(req);
    if (resNew?.data?.statusCode === 1) {
      const result = resNew?.data?.responseData?.result[0];
      // setPlanData({ ...result });
      // setSelectedProgramme({...result});
      setWorkout({ ...result });
    }
  }, []);

  // getProfileData?.planName === 'Free'?
  // 1:
  //   getProfileData?.workoutDay % 7 == 0
  //     ? ~~(getProfileData?.workoutDay / 7)
  //     : ~~(getProfileData?.workoutDay / 7) + 1;

  const noOfWeeks =
    workout?.weeks?.reduce((accumulator, object) => {
      console.log({ accumulator, object });
      // return accumulator + object.weeks
    }, 0) || 0;
  console.log({ noOfWeeks, workout });

  useEffect(() => {
    setActiveIndex(goalData?.workoutWeek || 1);
  }, [goalData?.workoutWeek]);

  useEffect(() => {
    let array = [];
    for (let i = 0; i < noOfWeeks; i++) {
      array.push({});
    }
    setArrayOfWeeks(array);
  }, [noOfWeeks]);

  useEffect(() => {
    // const unsubscribed = props.navigation.addListener('focus', () => {
    if (getProfileData?.planName == "Free") {
      console.log("routes neeraj====", navigation.getState()?.routes);
      changeMemershipModal();
    }

    // });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    // return unsubscribed;
  }, [getProfileData]);

  // useEffect(() => {
  //   const onFocus = navigation.addListener('focus', () => {
  //     if(getProfileData?.planName == 'Free') {
  //       console.log('routes neeraj====',navigation.getState()?.routes);
  //       changeMemershipModal()

  //     }
  //   });

  //   return onFocus;
  // }, [getProfileData]);

  const changeMemershipModal = () => {
    Alert.alert(
      "Upgrade Plan",
      "To access and track your progress please upgrade your account.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            props.navigation.navigate("Membership", { filter: "planSelector" }),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const { width } = useWindowDimensions();

  const onCheckIn = (index) => {
    if (index == 1 && getProfileData?.planName === "Free") {
      navigation.navigate("Check In", { weekValue: index });
    } else if (index == activeIndex && getProfileData?.planName === "Free") {
      Alert.alert(
        "Alert",
        "Do you want to ?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Membership", { setPlan: "changePlan" }),
          },
        ],
        {
          cancelable: false,
        }
      );
    } else if (index <= activeIndex && getProfileData.planName !== "Free") {
      navigation.navigate("Check In", {
        weekValue: index,
        programmeId: workout._id,
      });
    }
  };

  const WeekCard = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        // onPress={()=> navigation.navigate('Lift')}
        onPress={() => onCheckIn(index + 1)}
        style={[
          styles.cardContainer,
          {
            alignItems: index % 2 === 0 ? "flex-start" : "flex-end",
            width: width - 20,
          },
        ]}
      >
        <View
          style={[
            styles.cardStyle,
            {
              backgroundColor:
                activeIndex === index + 1
                  ? COLORS.lightGreen
                  : COLORS.light_grey,
            },
          ]}
        >
          <Text
            style={[
              styles.weekTextStyle,
              {
                color:
                  index + 1 > activeIndex
                    ? COLORS.grey_4
                    : index + 1 === activeIndex
                    ? "white"
                    : "black",
              },
            ]}
          >{`Week ${index + 1}`}</Text>
          {index + 1 <= activeIndex ? (
            <>
              <Text
                style={[
                  styles.weekTypeTextStyle,
                  {
                    color:
                      index + 1 < activeIndex ? COLORS.lightGreen : "white",
                  },
                ]}
              >
                {getProfileData?.planName}
              </Text>
              <View style={{ marginTop: 1 }}>
                <RightArrowIcon
                  white={index + 1 === activeIndex ? true : false}
                />
              </View>
            </>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const fetchDay = (day) => {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  };

  const getDay = () => {
    const d = new Date();
    return fetchDay(d.getDay());
  };

  const HeaderComponent = () => (
    <>
      {noOfWeeks === 0 ? null : (
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>Phase: {goalData?.workoutPhase}</Text>
          <Text style={styles.textStyle}>Day: {getDay()}</Text>
          <Text style={styles.textStyle}>Week: {goalData?.workoutWeek}</Text>
        </View>
      )}
    </>
  );

  const FooterComponent = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <GradientButton
        title="Measurements"
        onPress={() => {
         
          navigation.navigate("Measurements Tracker", { type: 2 })
        }}
        width={"48%"}
      />
      <GradientButton
        title="Milestone"
        onPress={() => navigation.navigate("Milestones Tracker", { type: 1 })}
        width={"48%"}
      />
    </View>
  );

  return getProfileData?.planName != "Free" ? (
    <MainScreen>
      {/* <View style={styles.tabView}>
        {["Tracker", "My Progress", "Progress Photos"].map((e,i) => (
          <TopBar onPress={()=>{
            if(i == 1){
              tabChange(e)
            }else if(i == 2){
              tabChange(e)
              navigation.navigate("Progress");
            }else{
              tabChange(e)
            }
          }}
            text={e}
            color={tab == e ? COLORS.lightGreen : COLORS.black}
            lineColor={tab == e ? COLORS.lightGreen : COLORS.white}
          />
        ))}
      </View> */}
      {tab == "My Progress" ? <MyProgress naviagtion={navigation}/> :
      <View>
        {/* <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",}}>
<Text style={styles.title}>Phase: 1</Text>
<Text style={styles.title}>Day: 16 </Text>
<Text style={styles.title}>Week: 3</Text>
        </View> */}
        <FlatList
        contentContainerStyle={styles.scrollContainerStyle}
        ListHeaderComponent={HeaderComponent}
        ListFooterComponent={FooterComponent}
        ListFooterComponentStyle={{ paddingVertical: 15 }}
        // data={arrayOfWeeks}
        data={workout?.weeks || []}
        renderItem={(item, index) => WeekCard(item, index)}
        style={style}
      />
      </View>
      } 
    </MainScreen> 
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ textAlign: "center" }}>
        To access and track your progress please upgrade your account.
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Membership", { setPlan: "changePlan" })
        }
        style={{
          marginTop: 15,
          height: 30,
          width: 100,
          backgroundColor: "green",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white" }}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
});
export default Tracker;

const TopBar = ({ text, onPress, color, lineColor }) => {
  return (
    <Pressable style={styles.itemView} onPress={onPress}>
      <Text style={[styles.text, { color: color }]}>{text}</Text>
      <Line color={lineColor} />
    </Pressable>
  );
};

const Line = ({ color }) => {
  return <View style={[styles.line, { backgroundColor: color }]} />;
};
const styles = StyleSheet.create({
  title:{
    fontFamily: "Manrope-SemiBold",
    fontSize:15,
    color:COLORS.grey_2,
    marginHorizontal:10
  },
  textStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    marginHorizontal: 10,
    textAlign: "center",
  },
  scrollContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  trackerStyle: {
    marginBottom: 20,
  },
  cardContainer: {
    marginVertical: 3,
  },
  cardStyle: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
    width: "65%",
    borderRadius: 5,
  },
  weekTextStyle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Manrope-Bold",
    fontSize: 15,
  },
  weekTypeTextStyle: {
    flex: 2,
    textAlign: "center",
    fontFamily: "Manrope-Regular",
    fontSize: 14,
  },
  line: {
    height: 2,
    width: "100%",
    backgroundColor: COLORS.lightGreen,
    borderRadius: 1,
  },
  itemView: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  text: {
    fontSize: 17,
    fontFamily: "Manrope-Medium",
    color: COLORS.lightGreen,
  },
  tabView: { flexDirection: "row", width: "90%", alignSelf: "center" ,marginVertical:15},
});
