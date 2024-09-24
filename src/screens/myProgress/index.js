import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../common/Constant";
import GradientButton from "../../components/GradientButton";
import GradientContainer from "../../components/GradientContainer";
import { Image } from "react-native";
import { LineChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};



const MyProgress = ({ naviagtion }) => {
  const [change, setChange] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  let gradient = [COLORS.lightGreen, COLORS.lightBlue];
  let white = [COLORS.white, COLORS.white];

  const DATA = [
    {
      id: 1,
      uri: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f28261f0564880c9086a57ee87a68887&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      uri: "https://images.unsplash.com/photo-1535576434247-e0f50b766399?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=232f6dbab45b3f3a6f97e638c27fded2&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      uri: "https://images.unsplash.com/photo-1535565454739-863432ea3c0e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7edfb9bc7d214dbf2c920723cb0ffce2&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      uri: "https://images.unsplash.com/photo-1535546204504-586398ee6677?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7320b162b147a94d4c41377d9035e665&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 5,
      uri: "https://images.unsplash.com/photo-1535531298052-7457bcdae809?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f15acb2aedb30131bb287589399185a2&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 6,
      uri: "https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ebe64b284c0ccffbac6a0d7ce2c8d15a&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 7,
      uri: "https://images.unsplash.com/photo-1535540707939-6b4813adb681?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ce3177d04728f7d1811e342b47d1e391&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 8,
      uri: "https://images.unsplash.com/photo-1535486509975-18366f9825df?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ea59f63a657824d02872bb907fe85e76&auto=format&fit=crop&w=500&q=60",
    },
  ];
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Rainy Days"] // optional
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.imageContainer} source={{ uri: item.uri }} />
        <View style={styles.textView}>
          <WeightView date={"21/09/2023"} weight={"110"} />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.progressText}>Your Progress</Text>
          <Weight label={100} unit={"KG"} />
          <Text style={styles.weightText}>Current Weight</Text>
          <UpgardeButton label={"Upgrade Progress"} />
          <View style={styles.graphView}>
            <View style={styles.buttonView}>
              {["Week", "Month", "All"].map((e, i) => (
                <TopButton
                  label={e}
                  onPress={() => setChange(i)}
                  textColor={change == i ? COLORS.white : COLORS.black}
                  colors={change == i ? gradient : white}
                />
              ))}
            </View>

            <LineChart
              data={data}
              width={screenWidth}
              height={300}
              // verticalLabelRotation={30}
              chartConfig={{
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                strokeWidth: 2,
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => COLORS.lightGreen,
                labelColor: (opacity = 1) => 'rgb(189, 189, 189)',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '5',
                  strokeWidth: '3',
                  stroke: COLORS.lightGreen,
                  fill: 'white',
                },
                propsForBackgroundLines: {
                  strokeWidth: '1',
                  stroke: COLORS.lightGrey,
                  strokeDasharray: '10',
                },
                propsForLabels: {
                  fontFamily: 'Manrope-Regular',
                  fontSize: 13,
                },
              }}
              bezier
            />
           
          </View>
          <View style={styles.listView}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={DATA}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyProgress;

const Weight = ({ label, unit }) => {
  return (
    <Text
      style={[styles.progressText, { color: COLORS.lightGreen, marginTop: 3 }]}
    >
      {label}
      <Text style={{ fontSize: 14, fontFamily: "Manrope-Regular" }}>
        {unit}
      </Text>
    </Text>
  );
};

const UpgardeButton = ({ onPress, label }) => {
  return (
    <Pressable style={styles.upgradeButton} onPress={onPress}>
      <Text
        style={[
          styles.progressText,
          { fontSize: 18, color: COLORS.lightGreen, marginTop: 0 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const TopButton = ({ colors, label, textColor, onPress }) => {
  return (
    <Pressable
      style={{
        height: 40,
        flex: 1,
        borderRadius: 20,
        justifyContent: "center",
        backgroundColor: COLORS.white,
      }}
      onPress={onPress}
    >
      <GradientContainer style={[styles.topView]} colors={colors}>
        <Text
          style={[
            styles.progressText,
            {
              fontSize: 15,
              fontFamily: "Manrope-Bold",
              color: textColor,
              marginTop: 0,
            },
          ]}
        >
          {label}
        </Text>
      </GradientContainer>
    </Pressable>
  );
};

const WeightView = ({ weight, date }) => {
  return (
    <View style={{ width: "100%", alignItems: "flex-end", marginBottom: 15 }}>
      <Text style={styles.text}>
        100{"  "}
        <Text style={styles.subText}>Kg</Text>
      </Text>
      <Text style={[styles.subText, { color: COLORS.white, marginRight: 15 }]}>
        25/09/2023
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressText: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Manrope-ExtraBold",
  },
  weightText: {
    fontSize: 14,
    color: COLORS.lightGreen,
    marginTop: 3,
    textAlign: "center",
    fontFamily: "Manrope-Regular",
  },
  upgradeButton: {
    height: 48,
    width: "60%",
    borderColor: COLORS.lightGreen,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    marginTop: 15,
    alignSelf: "center",
  },
  graphView: {
  
    width: "92%",
    backgroundColor: COLORS.grey_6,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    width: "80%",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    marginTop: 12,
    borderRadius: 45 / 2,
  },
  topView: {
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
  },
  listView: {
    height: 170,
    flex: 1,
    marginBottom: 10,
    marginTop: 20,
    margin: 5,
  },
  imageContainer: {
    height: 170,
    width: 120,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    height: undefined,
    width: "100%",
    aspectRatio: 1,
  },
  textView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "flex-end",
  },
  text: {
    fontSize: 15,
    fontFamily: "Manrope-ExtraBold",
    color: COLORS.white,
    marginRight: 15,
  },
  subText: {
    fontSize: 11,
    fontFamily: "Manrope-Regular",
    marginLeft: 10,
  },
});
