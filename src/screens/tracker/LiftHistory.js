import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MainScreen } from "../../common/Screen";
import { FlatList } from "react-native-gesture-handler";
import { COLORS } from "../../common/Constant";
import Header from "../../components/header/Header";

const LiftHistory = () => {
  const weightList = (i) => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3, 4].map((item, index) => (
          <View
            style={{
              borderColor: i == 0 ? COLORS.white : COLORS.black,
              borderWidth: 1,
              marginRight: 10,
              marginTop: 10,
              justifyContent: "center",
              borderRadius: 5,
              flexDirection:"row",
              alignItems:"center"
            }}
          >
            <Text style={[
                styles.weightText,
                { color: i == 0 ? COLORS.white : COLORS.black },
              ]}>5</Text>
              <View style={{height:15, backgroundColor:i == 0 ? COLORS.white : COLORS.grey, width:1}}/>
              <Text style={[
                styles.weightText,
                { color: i == 0 ? COLORS.white : COLORS.black },
              ]}>12 KG</Text>
           
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={[
          styles.listView,
          {
            backgroundColor: index == 0 ? COLORS.lightGreen : COLORS.grey_6,
            borderTopLeftRadius: index == 0 ? 5 : 0,
            borderTopRightRadius: index == 0 ? 5 : 0,
            borderBottomLeftRadius: index == 3 ? 5 : 0,
            borderBottomRightRadius: index == 3 ? 5 : 0,
          },
        ]}
      >
        <View style={styles.textView}>
          <Text
            style={[
              styles.listText,
              { color: index == 0 ? COLORS.white : COLORS.black },
            ]}
          >
            27 Sep, 2020 10:38
          </Text>
          
          <Text
            style={[
              styles.listText,
              { flex: 0, color: index == 0 ? COLORS.white : COLORS.black },
            ]}
          >
            Personal best
          </Text>
        </View>
        <View style={{ width: "90%", alignSelf: "center" }}>
          {weightList(index)}
        </View>
      </View>
    );
  };
  return (
    <MainScreen>
      <Header title="Lift History" status="drawer" />
      <View style={{ flex: 1, marginTop: 10 }}>
        <FlatList data={[1, 2, 3, 4]} renderItem={renderItem} />
      </View>
    </MainScreen>
  );
};

export default LiftHistory;

const styles = StyleSheet.create({
  listView: {
    height: 100,
    width: "90%",
    backgroundColor: COLORS.grey_5,
    alignSelf: "center",
    marginBottom: 5,
  },
  textView: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  listText: { fontSize: 15, flex: 1, fontFamily: "Manrope-Regular" },
  weightText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    marginHorizontal:5,
    marginVertical: 5,
  },
});

// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { MainScreen } from "../../common/Screen";
// import { FlatList } from "react-native-gesture-handler";
// import { COLORS } from "../../common/Constant";
// import Header from "../../components/header/Header";
// import moment from 'moment'
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { usersService } from "../../services/ApiServices";
// const TrackDataScreen = ({navigation, route}) => {
//   const [loader, setLoader] = useState(false);
//     const [input, setInput] = useState('');
//     const [saved, setSaved] = useState(false);
//     const [data, setData] = useState([]);
//     const [chartData, setChartData] = useState([]);
//     const [month, setMonth] = useState('');
//     const [dropDownItem, setDropDownItem] = useState('');
//     const [date, setDate] = useState(new Date());
//     const [open, setOpen] = useState(false);
//     const [reps, setReps] = useState('');
//     const [exerciseStats, setExerciseStats] = useState([]);
//     const [selectedUnit, setSelectedUnit] = useState("KG")



//       useEffect(() => {
//     getMilestoneData();
//   }, []);
//   useEffect(async() => {
//     const unitt = await AsyncStorage.getItem("selectedUnit")
    
//     if(unitt){
//       setSelectedUnit(JSON.parse(unitt))
//     }
//   }, [])
//   const getConvertedValue = value => {
//     if (dropDownItem === 'IN' && value) {
//       return (value / 2.54)?.toFixed(1);
//     } else if (dropDownItem === 'LBS' && value) {
//       return (value * 2.20462)?.toFixed(1);
//     } else {
//       return value;
//     }
//   };

//   const convertValueForQuery = value => {
//     if (dropDownItem === 'IN') return (value * 2.54).toFixed(1);
//     else if (dropDownItem === 'LBS') return (value * 0.4535).toFixed(1);
//     else return value;
//   };

//   useEffect(() => {
//     const obj = {
//       weight: input,
//       reps: reps,
//     };
//     setExerciseStats(obj);
//   }, [input, reps]);

//   const onSaveMeasurment = () => {
//     let params = {
//       category: route.params.category,
//       value:
//         convertValueForQuery(parseInt(input)) == NaN
//           ? ''
//           : convertValueForQuery(parseInt(input)),
//       unit: 1,
//     };
//     setLoader(true);
//     usersService
//       .saveMesurementTrackerData(params)
//       .then(res => {
//         getMilestoneData();
//         setSaved(true);
//         setInput('');
//       })
//       .catch(err => {});
//   };

//   const onSave = () => {
//     let params = {
//       exerciseId: route.params.exerciseId,
//       // category: route.params.category,
//       weight: input,
//       reps: reps,
//     };
//     setLoader(true);
//     usersService.saveMilestoneTrackerData(params).then(res => {
//       getMilestoneData();
//       setSaved(true);
//       setInput('');
//       setReps('');
//     });
//   };

//   const getMilestoneData = () => {
//     setLoader(true);
//     if (route?.params?.type == 2 || route?.params?.title == 'My Weight') {
//       let query = {
//         category:
//           route?.params?.type == 2 || route?.params?.title == 'My Weight'
//             ? route?.params?.category
//             : route?.params?.title,
//         startDate: `${moment().startOf('month').format('YYYY-MM-DD')}`,
//         endDate: `${moment().endOf('month').format('YYYY-MM-DD')}`,
//         type: route.params.title == 'My Weight' ? 2 : route.params.type,
//       };
//       usersService.getMilestoneTrackerData(query).then(res => {
//         console.log("ifResult", res.data.responseData.result)
//         // setChartData(res.data.responseData.result?.tracker1);
//         setData(res.data.responseData.result?.tracker2);
//         // setLoader(false);
//       });
//     } else {
//       let query = {
//         exerciseId: route?.params?.exerciseId,
//         startDate: `${moment().startOf('month').format('YYYY-MM-DD')}`,
//         endDate: `${moment().endOf('month').format('YYYY-MM-DD')}`,
//         type: route?.params?.title == 'My Weight' ? 2 : route?.params?.type,
//       };
//       usersService.getMilestoneTrackerData(query).then(res => {
//         console.log("elseResult", res.data.responseData.result)
//         // setChartData(res.data.responseData.result?.tracker1);
//         setData(res.data.responseData.result?.tracker2);
//         // setLoader(false);
//       });
//     }
//   };

//   const getMesurementData = () => {
//     setLoader(true);
//     let query = {
//       category: route?.params?.category,
//       startDate: `${moment().startOf('month').format('YYYY-MM-DD')}`,
//       endDate: `${moment().endOf('month').format('YYYY-MM-DD')}`,
//     };
//     usersService.getMeasurementTrackerData(query).then(res => {
//       setChartData(res.data.responseData.result?.mesurement1);
//       setData(res.data.responseData.result?.mesurement2);
//       setLoader(false);
//     });
//   };

//   const onDelete = item => {
//     const index = chartData.indexOf(item);
//     setChartData(prevState =>
//       prevState.slice(0, index).concat(prevState.slice(index + 1)),
//     );
//     let query = {
//       category: route?.params?.category,
//       savedAt: item?.savedAt,
//       type:
//         route?.params?.type == 2 || route?.params?.title == 'My Weight'
//           ? route.params.type
//           : 1,
//     };
//     usersService.deleteMilestoneTrackerData(query);
//     getMilestoneData();
//   };

//   const onMonthChange = value => {
//     setOpen(false);
//     setDate(value);
//     setMonth(moment(value).format('YYYY-MM-DD'));
//     let lastDateofMonth = new Date(
//       value.getFullYear(),
//       value.getMonth() + 1,
//       0,
//     );
//     let firstDateofMonth = new Date(value.getFullYear(), value.getMonth(), 1);
//     if (route.params.type == 2 || route.params.title == 'My Weight') {
//       let query = {
//         category:
//           route?.params?.type == 2 || route?.params?.title == 'My Weight'
//             ? route?.params?.category
//             : route?.params?.title,
//         startDate: `${moment(firstDateofMonth).format('YYYY-MM-DD')}`,
//         endDate: `${moment(lastDateofMonth).format('YYYY-MM-DD')}`,
//         type:
//           route?.params?.type == 2 || route?.params?.title == 'My Weight'
//             ? route?.params?.type
//             : 1,
//       };
//       usersService.getMilestoneTrackerData(query).then(res => {
//         setChartData(res.data.responseData.result?.tracker1);
//         setData(res.data.responseData.result?.tracker2);
//       });
//     } else {
//       let query = {
//         exerciseId: route?.params?.exerciseId,
//         // category:
//         //   route.params.type == 2 || route.params.title == 'My Weight'
//         //     ? route.params.category
//         //     : route.params.title,
//         startDate: `${moment(firstDateofMonth).format('YYYY-MM-DD')}`,
//         endDate: `${moment(lastDateofMonth).format('YYYY-MM-DD')}`,
//         type:
//           route?.params?.type == 2 || route?.params?.title == 'My Weight'
//             ? route?.params?.type
//             : 1,
//       };
//       usersService.getMilestoneTrackerData(query).then(res => {
//         setChartData(res.data.responseData.result?.tracker1);
//         setData(res.data.responseData.result?.tracker2);
//       });
//     }
//   };

//   const updateInput = text => {
//     let updateText = text.replace(/^0+/, '');
//     setInput(updateText);
//     setSaved(false);
//   };
//   const updateReps = text => {
//     let updateText = text.replace(/^0+/, '');
//     setReps(updateText);
//   };

//   const weightList = (i) => {
//     return (
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {/* {data.map((item, index) => ( */}
//           <View
//             style={{
//               borderColor: i == 0 ? COLORS.white : COLORS.black,
//               borderWidth: 1,
//               marginRight: 10,
//               marginTop: 10,
//               justifyContent: "center",
//               borderRadius: 5,
//               flexDirection:"row",
//               alignItems:"center"
//             }}
//           >
//             <Text style={[
//                 styles.weightText,
//                 { color: i == 0 ? COLORS.white : COLORS.black },
//               ]}>{data[i].reps}</Text>
//               <View style={{height:15, backgroundColor:i == 0 ? COLORS.white : COLORS.grey, width:1}}/>
//               <Text style={[
//                 styles.weightText,
//                 { color: i == 0 ? COLORS.white : COLORS.black },
//               ]}>{data[i].weight} KG</Text>
           
//           </View>
//         {/* ))} */}
//       </ScrollView>
//     );
//   };

//   const renderItem = ({ item, index }) => {
//     return (
//       <View
//         style={[
//           styles.listView,
//           {
//             backgroundColor: index == 0 ? COLORS.lightGreen : COLORS.grey_6,
//             borderTopLeftRadius: index == 0 ? 5 : 0,
//             borderTopRightRadius: index == 0 ? 5 : 0,
//             borderBottomLeftRadius: index == 3 ? 5 : 0,
//             borderBottomRightRadius: index == 3 ? 5 : 0,
//           },
//         ]}
//       >
//         <View style={styles.textView}>
//           <Text
//             style={[
//               styles.listText,
//               { color: index == 0 ? COLORS.white : COLORS.black },
//             ]}
//           >
//             {item?.savedAt}
//           </Text>
          
//           <Text
//             style={[
//               styles.listText,
//               { flex: 0, color: index == 0 ? COLORS.white : COLORS.black },
//             ]}
//           >
//             Personal best
//           </Text>
//         </View>
//         <View style={{ width: "90%", alignSelf: "center" }}>
//           {weightList(index)}
//         </View>
//       </View>
//     );
//   };
//   return (
//     <MainScreen>
//       <Header title="Lift History"  />
//       <View style={{ flex: 1, marginTop: 10 }}>
//         {data.length > 0 ?
//         <FlatList data={data} renderItem={renderItem} /> : <View/>} 
//       </View>
//     </MainScreen>
//   );
// };

// export default TrackDataScreen;

// const styles = StyleSheet.create({
//   listView: {
//     height: 100,
//     width: "90%",
//     backgroundColor: COLORS.grey_5,
//     alignSelf: "center",
//     marginBottom: 5,
//   },
//   textView: {
//     width: "90%",
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "center",
//     marginTop: 20,
//   },
//   listText: { fontSize: 15, flex: 1, fontFamily: "Manrope-Regular" },
//   weightText: {
//     fontSize: 15,
//     fontFamily: "Manrope-Regular",
//     marginHorizontal:5,
//     marginVertical: 5,
//   },
// });