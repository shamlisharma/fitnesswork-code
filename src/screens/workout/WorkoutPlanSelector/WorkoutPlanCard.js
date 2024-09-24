import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS } from "../../../common/Constant";
import settings from "../../../config/settings";
import AlertModal from "../../modal/AlertModal";
import Imageb from "react-native-image-progress";

import ProgressBar from "react-native-progress/Bar";
const WorkoutPlanCard = React.memo((props) => {
  const {
    title,
    intensityLoad,
    duration,
    programmeImage,
    status,
    phase,
    createdAt,
    description,
    planName,
    weeks,
    infoPress,
  } = props;
  const navigation = useNavigation();
  const [newTag, setNewTag] = useState(false);
  let mediaPath = settings?.cdnUrl?.url;
  // var tempSec = Number(phase[0]?.time);
  // var hours = Math.floor(tempSec / 3600);
  const food = useSelector(
    (state) => state?.food?.dailyFoodTarget?.caloriesTarget
  );
  const [accesWorkoutTab, setAccessWorkoutTab] = useState(false);
  useEffect(() => {
    console.log("workout props", props);
    if (
      moment(createdAt).format("l") <=
      moment(createdAt).add(5, "days").format("l")
    ) {
      setNewTag(true);
    } else {
      setNewTag(false);
    }
  }, [newTag]);

  const renderAssignedByStatus = () => {
    if (props.workoutAsignedBy != undefined) {
      if (props.workoutAsignedBy === 1) {
        return "Your programme";
      } else if (props.workoutAsignedBy === 2) {
        return "Your customized programme";
      }
    }
  };

  const PlanCard = () => (
    <>
      <View
        style={{
          height: 200,
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Imageb
          source={
            programmeImage
              ? { uri: mediaPath + programmeImage }
              : require("../../../../assets/workoutplan.png")
          }
          indicator={
            <ActivityIndicator size={"large"} color={COLORS.lightGreen} />
          }
          style={{
            width: "100%",
            // minHeight: 162,
            height: 200,
            //flex: 1,
          }}
        />
      </View>
      <View style={{ width: "100%", marginTop: 10, marginLeft: 10 }}>
        {status == false ? null : (
          <Text style={styles.myProgrammeTextStyle}>
            {renderAssignedByStatus()}
          </Text>
        )}
        <Text style={styles.cardTitleTextStyle}>{title}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: COLORS.grey_3 }}>{duration} weeks | </Text>
          <Text style={{ color: COLORS.grey_3 }}>
            A week: {weeks?.length && weeks[0]?.workoutDays} workouts
          </Text>
          {/* <Text style={{color: COLORS.grey_3}}>{description}</Text> */}
        </View>
      </View>
      {status ? null :
      <TouchableOpacity
        style={{ position: "absolute", top: 15, right: 15 }}
        activeOpacity={0.8}
        onPress={props.infoPress}
      >
        <Image
          style={{ height: 30, width: 30 }}
          source={require("../../../../assets/i.png")}
        />
      </TouchableOpacity>}
    </>
    // <View style={[styles.container, {opacity: planName == 'Free' ? 0.3 : 1}]}>
    //   <View style={styles.imageWrapper}>
    //     {/* <ImageBackground
    //       style={{
    //         width: 135,
    //         minHeight: 162,
    //         height: 'auto',
    //         //flex: 1,
    //       }}
    //       // resizeMode="contain"
    //       source={
    //         programmeImage
    //           ? {uri: mediaPath + programmeImage}
    //           : require('../../../../assets/workoutplan.png')
    //       }
    //       cache> */}
    //     <Imageb
    //       source={
    //         programmeImage
    //           ? {uri: mediaPath + programmeImage}
    //           : require('../../../../assets/workoutplan.png')
    //       }
    //       indicator={
    //         <ActivityIndicator size={'large'} color={COLORS.lightGreen} />
    //       }
    //       style={{
    //         width: 135,
    //         minHeight: 162,
    //         height: 'auto',
    //         //flex: 1,
    //       }}
    //     />
    //     <View
    //       style={{
    //         position: 'absolute',
    //         top: 0,
    //         left: 0,
    //         right: 0,
    //         bottom: 0,
    //       }}>
    //       {newTag ? (
    //         <View
    //           style={{
    //             width: '35%',
    //             height: '20%',
    //             backgroundColor: COLORS.blue,
    //           }}>
    //           <Text
    //             style={{
    //               color: COLORS.white,
    //               textAlign: 'center',
    //               paddingTop: 3,
    //               fontFamily: 'Manrope-Semibold',
    //             }}>
    //             New
    //           </Text>
    //         </View>
    //       ) : null}
    //     </View>
    //     {/* </ImageBackground> */}
    //     {(planName == 'Free' ) && (
    //       <Image
    //         source={require('assets/ShadedRectangle.png')}
    //         style={styles.shaddedImageView}
    //       />
    //     )}
    //   </View>
    //   <View
    //     style={{
    //       flex: 1,
    //       alignSelf: 'center',
    //       paddingLeft: 10,
    //       paddingVertical: 10,
    //     }}>
    //     {
    //       //   planName != 'Free'?
    //       //   <View>
    //       //   <Text style={[styles.cardTitleTextStyle,{ marginLeft: 5 }]}>{title}</Text>
    //       //   <View style={styles.lineContainerView} />
    //       //   <View style={styles.lineContainerView} />
    //       //   <View style={styles.lineContainerView} />
    //       // </View>:
    //       <>
    //         {status == false ? null : (
    //           <Text style={styles.myProgrammeTextStyle}>
    //             {renderAssignedByStatus()}
    //           </Text>
    //         )}
    //         <Text style={styles.cardTitleTextStyle}>{title}</Text>
    //         <Text style={styles.cardContentTextStyle}>
    //           Description:
    //           <Text style={{color: COLORS.grey_3}}>{description}</Text>
    //         </Text>
    //         <Text style={styles.cardContentTextStyle}>
    //           Duration:{' '}
    //           <Text style={{color: COLORS.grey_3}}>{duration} weeks</Text>
    //         </Text>
    //         <Text style={styles.cardContentTextStyle}>
    //           A week:{' '}
    //           <Text style={{color: COLORS.grey_3}}>
    //             {weeks?.length && weeks[0]?.workoutDays} workouts
    //           </Text>
    //         </Text>
    //       </>
    //     }
    //   </View>
    // </View>
  );
  useFocusEffect(
    useCallback(() => {
      if (food == 0 || food == "") {
        setAccessWorkoutTab(true);
      }
    }, [food])
  );

  const onGoBack = () => {
    setAccessWorkoutTab(false);
    navigation.navigate("HomeTab");
  };

  const onOkay = () => {
    setAccessWorkoutTab(false);
    navigation.navigate("Questionnaire");
  };

  return (
    <View style={styles.cardView}>
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
      <PlanCard />
    </View>
  );
});

export default WorkoutPlanCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light_grey,
    //backgroundColor:'red',
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
  },
  cardTitleTextStyle: {
    fontFamily: "Manrope-SemiBold",
    paddingVertical: 4,
    fontSize: 16,
    color: COLORS.grey_2,
    //textTransform: 'capitalize',
  },
  myProgrammeTextStyle: {
    fontFamily: "Manrope-SemiBold",
    // paddingBottom: 2,
    fontSize: 13,
    color: "#0CDD99",
    // alignSelf: 'flex-end',
    textTransform: "capitalize",
  },
  cardContentTextStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.grey_4,
  },
  cardView: {
    borderRadius: 6,
    padding: 1,
    marginVertical: 5,
  },
  imageWrapper: {
    // width: '42.5%',
    width: 128,
    minHeight: 162,
    height: "auto",
    overflow: "hidden",
  },
  shaddedImageView: {
    height: "50%",
    width: "100%",
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 5,
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
