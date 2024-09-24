import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { color } from "react-native-reanimated";
import { BackArrowIcon } from "../../../Svg";
import { usersService } from "../../../services/ApiServices";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  }, {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  }, {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  }, {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Chest",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Back",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Shoulders",
  },
];

const Item = ({ item, onPress, backgroundColor,  }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title]}>{item.title}</Text>
  </TouchableOpacity>
);

const Category = ({navigation,route}) => {
  const [selectedId, setSelectedId] = useState(null);

  const getWorkouts = async() => { 
const res = await usersService.getAllSimilarExercise()
console.log("response workouts",res.data.responseData?.result);
   }
  useEffect(() => {
    getWorkouts()
  }, [])
  
  const renderItem = ({ item }) => {
    // const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    // const color = item.id === selectedId ? 'white' : 'black';

    
    return (
      <Item
        item={item}
        onPress={() => navigation.navigate("ExerciseType")}
        // backgroundColor={{ backgroundColor }}
        
        textColor={{ color }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={{marginLeft:15,flexDirection:"row",alignItems:"center" }}>
      <TouchableOpacity  onPress={() => navigation.goBack()}>
      <BackArrowIcon/>
      </TouchableOpacity>
  
    <View>
      <Text style={{fontSize:20,fontWeight:"400",color:"#333333",padding:15,textAlign:"center",marginLeft:55}}>
       Choose the category
        </Text> 
    </View>
    </View>
<TouchableOpacity  >
<FlatList 
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />

</TouchableOpacity>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    marginTop:10,

  },
  item: {
    padding: 5,
    marginVertical:-2,
    marginHorizontal: 16,
 

  },
  title: {
    fontSize:15 ,
    marginTop:15,
    // backgroundColor:"red",
    color:"#4F4F4F"
  


  },
});

export default Category;