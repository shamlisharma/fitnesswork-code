import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useReducer } from "react";
import { COLORS } from "../../../common/Constant";
import Upload from "../../../components/Upload";
import SectionList from "../SectionList";
import ImagePicker from "../../../components/ImagePicker";
var type="";
export default function Compare() {
 
  const [visible, toggle] = useReducer((e) => !e, false);
  const [select, setSelect] = React.useState("All");
  const [front, setPic] = React.useState("");
  const [back, setBack] = React.useState("");
  const DATA = [
    {
      id: 1,
      date: "13 Aug 2023",
      weight: "100",
      data: [
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
      ],
    },
    {
      id: 2,
      date: "14 Aug 2023",
      weight: "110",
      data: [
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
      ],
    },
    {
      id: 3,
      date: "15 Aug 2023",
      weight: "115",
      data: [
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
      ],
    },
  ];

  const selectImage = (e) => {
    const uri = e.assets[0].uri;
    console.log(type);
    type == "front" ? setPic(uri) : setBack(uri);
    toggle();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ScrollView
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.uploadView}>
            <Upload
              label={"Before"}
              onPress={() => {
                type = "front";
                toggle();
              }}
              image={front}
            />
            <Spacer />
            <Upload
              label={"After"}
              onPress={() => {
                type = "back";
                toggle();
              }}
              image={back}
            />
          </View>
          <View style={styles.topBarView}>
            {["All", "Front", "Side", "Back"].map((item) => (
              <TopBar
                onPress={() => setSelect(item)}
                text={item}
                color={select == item ? COLORS.lightGreen : COLORS.black}
                lineColor={select == item ? COLORS.lightGreen : COLORS.white}
              />
            ))}
            <TopBar />
          </View>

          <SectionList data={DATA} bottom={10} scrollEnabled={false} />
        </ScrollView>
      </View>
      <ImagePicker
        visible={visible}
        onCancel={toggle}
        onCameraClick={selectImage}
        onPhotoClick={selectImage}
      />
    </SafeAreaView>
  );
}

const Spacer = () => {
  return <View style={{ width: 15 }} />;
};

const Line = ({ color }) => {
  return <View style={[styles.line, { backgroundColor: color }]} />;
};

const TopBar = ({ text, onPress, color, lineColor }) => {
  return (
    <Pressable style={styles.itemView} onPress={onPress}>
      <Text style={[styles.text, { color: color }]}>{text}</Text>
      <Line color={lineColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  uploadView: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
  },
  line: {
    height: 2,
    width: "100%",
    backgroundColor: COLORS.lightGreen,
    borderRadius: 1,
  },
  topBarView: {
    flexDirection: "row",
    width: "92%",
    alignSelf: "center",
    marginTop: 20,
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
});
