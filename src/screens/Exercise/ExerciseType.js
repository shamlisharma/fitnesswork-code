import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { BackArrowIcon, SearchIcon } from "../../Svg";
import ModalTester from "./Modal";
import { usersService } from "../../services/ApiServices";
import settings from "../../config/settings";
import FloatButton from "../../components/FloatButton";
import CategoryModal from "../modal/CategoryModal";
import { COLORS } from "../../common/Constant";
// import { TouchableOpacity } from 'react-native-gesture-handler'

// const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

const Data = [
  {
    id: 1,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 2,
    img: require("../../../assets/Backpush.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 3,
    img: require("../../../assets/Burbe.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 4,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 5,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 6,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 7,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 8,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
  {
    id: 9,
    img: require("../../../assets/Pushup.png"),
    tittle: "Sumo Squat",
    pushup: "40 Reps (20 per side)",
  },
];

let cdnPath = settings.cdnUrl.url;
const ExerciseType = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState();
  const [showCategoryModal, setCategoryShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const exerciseName = route?.params?.exerciseName;
  const exerciseId = route?.params?.exerciseId;
  const updatedExerciseStats = route?.params?.updatedExerciseStats;

  const getWorkouts = async () => {
    setLoader(true);
    const res = await usersService.getAllSimilarExercise(exerciseId);
    console.log("All workoutss==>>>>>>>>>>>>>>>>>>", res.data);
    if (res.data.statusCode == 1) {
      console.log("response workouts", res.data.responseData?.result);
      setExercises([...res.data.responseData?.result[0]?.similarExercises]);
      setLoader(false);
    } else {
      alert(res?.data?.error?.responseMessage);
      setLoader(false);
    }
  };
  useEffect(() => {
    getWorkouts();
  }, []);
  const onConfirmSwitch = () => {
    setShowModal(false);
    let tempexeData = route?.params.exerciseInfoData;
    let tempsetInfo = tempexeData[route?.params?.currentIndex].setInfo;
    // for(let val in tempsetInfo){
    //     tempsetInfo[val].noOfReps = 0
    //     tempsetInfo[val].restTime = 0
    //     tempsetInfo[val].weight = 0

    // }
    console.log({ tempsetInfo });
    tempexeData[route?.params?.currentIndex] = {
      ...currentExercise,
      exerciseId: currentExercise?._id,
      // exerciseVideo: currentExercise.exerciseVideo,
      // thumbImage: currentExercise.thumbImage,
      // title: currentExercise.title,
      setInfo: tempsetInfo,
    };
    let tempex = updatedExerciseStats;
    tempex[route?.params?.currentIndex].exerciseId = currentExercise?._id;
    // navigation.navigate("Excercise", {

    //     exerciseInfoData: tempexeData,
    //     wId: route?.params?.wId,
    //     dashboard: route?.params.dashboard,
    //     workoutId: route?.params?.workoutId,
    //     cWId: route?.params?.cWId,
    //     cWorkWeek: route?.params?.cWorkWeek,
    //     cPhase: route?.params?.cPhase,
    //     index: 0,
    //     day: route?.params?.day,
    //     category: route?.params?.category,
    //     viewFrom: true,
    //     workoutTitle: route?.params?.workoutTitle,
    //     backgroundImage: route?.params.backgroundImage,
    // })
    navigation.goBack();
    route.params.handleChange({
      exerciseInfoData: tempexeData,
      wId: route?.params?.wId,
      dashboard: route?.params.dashboard,
      workoutId: route?.params?.workoutId,
      cWId: route?.params?.cWId,
      cWorkWeek: route?.params?.cWorkWeek,
      cPhase: route?.params?.cPhase,
      index: 0,
      day: route?.params?.day,
      category: route?.params?.category,
      viewFrom: true,
      workoutTitle: route?.params?.workoutTitle,
      backgroundImage: route?.params.backgroundImage,
      updatedExerciseStats: tempex,
    });
  };
  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          setCurrentExercise(item);
          setShowModal(true);
          // alert(JSON.stringify(item)) 
          // log
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          height: 80,
          backgroundColor: "#e6e7e7",
          borderRadius: 10,
          marginHorizontal: 10,
          borderWidth: 1,
          borderColor: "#d6d6d6",
          overflow: "hidden",
        }}
      >
        <View style={{ overflow: "hidden" }}>
          <Image
            source={{ uri: cdnPath + item?.thumbImage }}
            style={{ height: 80, width: 102 }}
          />
        </View>

        <View style={{ paddingLeft: 40 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#4F4F4F" }}>
            {item?.title}
          </Text>
          <Text style={{ color: "grey" }}>{item?.pushup}</Text>
        </View>
      </Pressable>
    );
  };

  const toggleModal = async (e) => {
    setCategoryShowModal(!showCategoryModal);

    if (e.title != undefined) {
      setLoader(true);
      const res = await usersService.getExerciseCategory(e.value);
      console.log(res.data.responseData.result);
      try {
        if (res.data.responseData.result.length > 0) {
          setExercises([...res.data.responseData?.result]);
          setLoader(false);
        } else {
          setExercises([]);
          setLoader(false);
        
        }
      } catch (err) {
        setLoader(false);
        console.log("ERROR", err);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.main}>
        <View style={styles.back}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Sign")}>
            <Text style={styles.Text}>Add exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{ borderWidth: 0.4, borderColor: "#cfcdcd", marginTop: 10 }}
      ></View>
      <View style={styles.search}>
        <View style={{ padding: 12, marginRight: -4 }}>
          <SearchIcon />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Search"
          keyboardType="ascii-capable"
        />
      </View>
      {/* <ScrollView> */}
      <View style={{ flex: 1 }}>
        {exercises.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10 }}
            data={exercises || Data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListFooterComponent={() => <View style={{ height: 70 }} />}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text>No Exercise Found!</Text>
          </View>
        )}
      </View>
      <FloatButton label={"Other muscle groups"} onPress={toggleModal} />
      {/* </ScrollView> */}
      <ModalTester
        prevExercise={exerciseName}
        newExercise={currentExercise?.title}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={onConfirmSwitch}
      />

      <CategoryModal
        visible={showCategoryModal}
        onBack={toggleModal}
        onPress={toggleModal}
      />
      {loader ? (
        <View style={styles.loader}>
          <ActivityIndicator
            size={"large"}
            animating
            color={COLORS.lightGreen}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ExerciseType;

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    fontWeight: "400",
    color: "#333333",
  },
  back: {
    marginLeft: -100,
    alignItems: "center",
  },
  main: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-evenly",
    marginTop: Platform.OS == "android" ? 50 : 20,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: "#cfcdcd",
    marginTop: 15,
    borderRadius: 7,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#FFFFFF99",
  },
});
