import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useMemo } from "react";
import { MainScreen } from "../../common/Screen";

import { COLORS } from "../../common/Constant";
import GradientButton from "../../components/GradientButton";
import { usersService } from "../../services/ApiServices";

const ExerciseFilter = ({route,navigation}) => {
  const [selectIndex, setSelectIndex] = React.useState(route.params.index);
  var week = [
    { id: 1, title: 2 },
    { id: 2, title: 3 },
    { id: 3, title: 4 },
    { id: 4, title: 5  },
    { id: 5, title: 6 },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.8}
      onPress={()=> {
        setSelectIndex(index)
      
      }}
        style={[ 
          styles.listView,
          {
            backgroundColor:
              selectIndex === index ? COLORS.lightGreen : COLORS.white,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              padding: 0,
              color: selectIndex === index ? COLORS.white : COLORS.lightGreen,
              fontFamily: "Manrope-Regular",
            },
          ]}
        >
          {`${item.title} days per a week`}
        </Text>
      </TouchableOpacity>
    );
  };


  
  return (
    <MainScreen>
      <Text style={styles.text}>
        {
          "Frequency doesn’t dedicate outcome. \n Pick the frequency you can stick to the most"
        }
      </Text>

      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={week}
          renderItem={renderItem}
        />
      </View>
      <GradientButton title={"Show the results"} style={styles.buttonView} onPress={()=>{
     
        if(selectIndex != -1){
          // console.log(selectIndex, filter[selectIndex].title)
          route.params.handleBack( week[selectIndex].title,selectIndex)
          navigation.goBack()
        }
       
      }} />
    </MainScreen>
  );
};

export default ExerciseFilter;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: COLORS.grey,
    padding: 25,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Manrope-SemiBold",
  },
  listView: {
    height: 40,
    width: "80%",
    alignSelf: "center",
    borderColor: COLORS.lightGreen,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView:{
    width:"80%",
    alignSelf:"center",
    marginBottom:20
  }
});
