import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, Component, useRef } from "react";
import {
  Bookicon,
  Clickicon,
  CrossIcon,
  DoubleArrow,
  Historyicon,
  PauseIcon,
  Tickicon,
  VideoPlayIcon,
} from "../../Svg";
import { Switch } from "react-native-switch";
import Video from "react-native-video";
import * as Progress from "react-native-progress";
// import React, { Component } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import GradientButton from "../../components/GradientButton";
import ModalTester2 from "../Exercise/Modal2";

const HardWork = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [radio, setRadio] = useState(false);
  const [close, onclose] = useState(false);
  const RBSheetRef = useRef();
  const item = {
    _id: "6316e28c0e5df60012d0685a",
    title: "Dumbbell Bench Assisted Rows",
  };
  return (
    <View>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CrossIcon />
        </TouchableOpacity>
        <Text style={styles.Text}>Hard Workout</Text>
      </View>
      <View style={styles.icon}>
        <Pressable onPress={() => setShowModal(true)}>
          <PauseIcon />
        </Pressable>

        <Text style={styles.Text2}>04.37</Text>
        <Text style={styles.Text3}>Rest timer</Text>
        <View style={{ marginLeft: 10 }}>
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
        </View>
      </View>
      <View>
        <Text style={styles.Text4}>Barbell Push-ups</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          margin: 5,
          justifyContent: "space-evenly",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Video
          source={{
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          }} // Can be a URL or a local file.
          style={styles.backgroundVideo}
          controls
          ignoreSilentSwitch={"ignore"}
        />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Category")}>
            <DoubleArrow />
            <Text>Switch</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TrackDataScreen", {
                title: item?.title,
                category: 1 + 1,
                type: 1,
                exerciseId: item?._id,
                screen:"hard"
              })
            }
          >
            <Historyicon />
            <Text>History</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => RBSheetRef.current.open()}>
            <View style={{ alignItems: "center" }}>
              <Bookicon />
            </View>

            <Text>Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginLeft: 45, color: "rgba(189, 189, 189, 1)" }}>
          Score
        </Text>
        <Text style={{ marginLeft: 10 }}>1600</Text>
        <Text style={{ marginLeft: "47%" }}>1400</Text>
      </View>
      <View style={{ marginLeft: 45, marginTop: 10 }}>
        <Progress.Bar
          progress={0.7}
          width={300}
          color={"rgba(12, 221, 153, 1)"}
          height={3}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 15,
        }}
      >
        <Text style={{ color: "rgba(189, 189, 189, 1)" }}>Done</Text>
        <Text style={{ color: "rgba(189, 189, 189, 1)" }}>Set</Text>
        <Text style={{ color: "rgba(189, 189, 189, 1)" }}>KG</Text>
        <Text style={{ color: "rgba(189, 189, 189, 1)" }}>Reps</Text>
        <Text style={{ color: "rgba(189, 189, 189, 1)" }}>RIR</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 15,
        }}
      >
        <Clickicon />
        <Text style={{ color: "rgba(79, 79, 79, 1)" }}>1</Text>
        <Text style={{ color: "rgba(79, 79, 79, 1)" }}>120</Text>
        <Text style={{ color: "rgba(79, 79, 79, 1)" }}>6</Text>
        <Text style={{ color: "rgba(79, 79, 79, 1)" }}>20</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: "10%" }}
      >
        <View style={{ marginLeft: "15%", marginTop: 10, height: 15 }}>
          <Tickicon />
        </View>
        <View>
          <Text
            style={{
              marginLeft: "20%",
              textAlign: "center",
              color: "rgba(79, 79, 79, 1)",
            }}
          >
            2
          </Text>
        </View>
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View style={{ marginLeft: "15%", marginTop: 10, height: 15 }}>
            <Tickicon />
          </View>
          <View>
            <Text
              style={{
                marginLeft: "20%",
                textAlign: "center",
                color: "rgba(79, 79, 79, 1)",
              }}
            >
              3
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          marginTop: "20%",
          borderWidth: 1,
          padding: 12,
          marginHorizontal: 50,
          borderRadius: 20,
          borderColor: "rgba(12, 221, 153, 1)",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "rgba(12, 221, 153, 1)",
          }}
        >
          Submit
        </Text>
      </View>
      <View style={{}}>
        {/* <Button title="OPEN BOTTOM SHEET" onPress={() => this.RBSheet.open()} /> */}

        <RBSheet
          ref={RBSheetRef}
          height={300}
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
            >
              Add a note
            </Text>
            <TouchableOpacity onPress={() => RBSheetRef.current?.close()}>
              <CrossIcon />
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: 25 }}>
            <TextInput
              style={styles.inputFieldTxt}
              placeholderTextColor="grey"
              placeholder="Need more time to rest"
              multiline={true}
              // secureTextEntry={hidePass ? true : false}
              // value={confirmPassword}
              // minLength={6}
              // maxLength={50}
              // onChangeText={value => setUserInput({ confirmPassword: value })}
              name="confirmPassword"
              autoCapitalize="none"
              // onChange={handleChange}
              // selectionColor={COLORS.blue}
            />
          </View>
          <View style={{ marginTop: "30%", marginHorizontal: 30 }}>
            <GradientButton title="Save " />
          </View>
        </RBSheet>
      </View>
      <ModalTester2 visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
};

export default HardWork;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: 100,
    width: 100,
  },
  Text: {
    paddingRight: "35%",
    fontSize: 20,
    color: "rgba(51, 51, 51, 1)",
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 15,
    // backgroundColor:"green"
  },
  icon: {
    paddingLeft: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  Text2: {
    fontSize: 24,
    marginLeft: "5%",
    fontWeight: "700",
    color: "rgba(13, 184, 218, 1)",
  },
  Text3: {
    marginLeft: "25%",
  },
  Text4: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(79, 79, 79, 1)",
    textAlign: "center",
    marginTop: 25,
  },
});
