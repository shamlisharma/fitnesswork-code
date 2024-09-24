import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import { COLORS } from "../../common/Constant";

const SectionList = ({ data, bottom = 65,scrollEnabled = true }) => {
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <View style={styles.imageContainer}>
          <Image
            style={{ height: "auto", width: "100%", aspectRatio: 1 }}
            source={{ uri: item.uri }}
          />
        </View>
        <Text style={[styles.text]}>Front</Text>
      </View>
    );
  };
  return (
    <FlatList 
    scrollEnabled={scrollEnabled}
      ListFooterComponent={() => <View style={{ marginBottom: bottom }} />}
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        return (
          <View style={styles.listContainer}>
            <View style={styles.dateView}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.dateText,
                    { fontFamily: "Manrope-Regular", color: COLORS.black },
                  ]}
                >
                  {"Weight (KG)"}
                </Text>
                <Text
                  style={[styles.dateText, { marginLeft: 15, marginRight: 15 }]}
                >
                  {item.weight}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={item.data}
                renderItem={renderItem}
              />
            </View>
          </View>
        );
      }}
    />
  );
};

export default SectionList;

const styles = StyleSheet.create({
  listContainer: {
    // height: 150,
    alignSelf: "center",
    width: "100%",
    margin: 10,
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    width: "100%",
  },
  dateText: {
    fontSize: 17,
    fontFamily: "Manrope-Bold",
    color: COLORS.lightGreen,
    marginLeft: 15,
  },
  imageContainer: {
    width: 150,
    backgroundColor: "red",
    height: 120,
    marginHorizontal: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  text: {
    textAlign: "center",
    color: COLORS.black,
    fontSize: 17,
    fontFamily: "Manrope-Medium",
    marginTop: 5,
  },
});
