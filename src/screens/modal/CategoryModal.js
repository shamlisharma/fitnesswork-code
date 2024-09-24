import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { BackArrowIcon } from "../../Svg";
import { FlatList } from "react-native";
import { COLORS } from "../../common/Constant";
import FloatButton from "../../components/FloatButton";

const CategoryModal = ({ visible = false, onBack, onPress }) => {
  const [category, setCategory] = React.useState(null);
  const DATA = [
   
    { id: 1, title: "Abs",value:"ABS" },
    { id: 2, title: "Hamstrings",value:"HAMSTRINGS" },
    { id: 3, title: "Gluteus",value:"GLUTES" },
    { id: 4, title: "Chest",value:"CHEST" },
    { id: 5, title: "Calves",value:"CALVES" },
    { id: 6, title: "Back",value:"BACK" },
    { id: 7, title: "Quads",value:"QUADS" },
    { id: 8, title: "Biceps",value:"BICEPS" },
    { id: 9, title: "Triceps",value:"TRICEPS" },
    { id: 10, title: "Shoulders",value:"SHOULDERS" },
    { id: 11, title: "Traps",value:"TRAPS" },
    { id: 12, title: "Full Body",value:"FULL-BODY" },
  ];
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.listView,
          {
            backgroundColor:
              category != null
                ? category.title === item.title
                  ? COLORS.lightGreen
                  : COLORS.grey_6
                : COLORS.grey_6,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          setCategory(item);
        }}
      >
        <Text
          style={[
            styles.Text,
            {
              textAlign: "left",
              marginLeft: 20,
              color:
                category != null
                  ? category.title === item.title
                    ? COLORS.white
                    : COLORS.black
                  : COLORS.black,
            },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.main}>
            <TouchableOpacity
              style={styles.back}
              onPress={() => {
                setCategory(null);
                onBack();
              }}
            >
              <BackArrowIcon />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.Text}>Category</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 10 }}
              ListFooterComponent={() => {
                return <View style={{ height: 80 }} />;
              }}
              data={DATA}
              renderItem={renderItem}
            />
          </View>
          <FloatButton
            label={"View exercises"}
            // width={150}
            onPress={() => {
              if (category != null) {
                onPress(category);
              }
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  main: {
    width: "90%",
    alignSelf: "center",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  Text: {
    fontSize: 20,
    fontWeight: "400",
    color: "#333333",
    textAlign: "center",
    marginRight: 30,
  },
  line: { height: 1, width: "100%", backgroundColor: "#33333311" },
  listView: {
    height: 60,
    width: "92%",
    backgroundColor: COLORS.grey_6,
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 5,
    justifyContent: "center",
    
  },
});
