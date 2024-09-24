// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   ActivityIndicator,
//   Pressable,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import {COLORS} from '../../common/Constant';
// import DropDown from '../../components/DropDown';
// import GradientButton from '../../components/GradientButton';
// import {LineChart} from 'react-native-chart-kit';
// import LastSavedContainer from './LastSavedContainer';
// import MonthDropDown from '../../components/MonthDropDown';
// import {usersService} from '../../services/ApiServices';
// import moment from 'moment';
// import DatePicker from 'react-native-date-picker';
// import {CrossIcon, DobCalenderIcon} from '../../Svg';
// import {TextInput} from 'react-native-gesture-handler';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// /*
// Type of Tracking
// 1 -> Milestone
// 2 -> Measurement
// */

// /*
// Category and their keys
// Bench -> 1
// Deadlift -> 2
// Squats -> 3
// */

// /*
// Units and their keys
// KG/CM -> 1
// LBS/IN -> 2
// */

// const TrackDataScreen = React.memo(({route,navigation}) => {
//   const [loader, setLoader] = useState(false);
//   const [input, setInput] = useState('');
//   const [saved, setSaved] = useState(false);
//   const [data, setData] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [month, setMonth] = useState('');
//   const [dropDownItem, setDropDownItem] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [open, setOpen] = useState(false);
//   const [reps, setReps] = useState('');
//   const [exerciseStats, setExerciseStats] = useState([]);
//   const [selectedUnit, setSelectedUnit] = useState("KG")
//   useEffect(() => {
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
//         setChartData(res.data.responseData.result?.tracker1);
//         setData(res.data.responseData.result?.tracker2);
//         setLoader(false);
//       });
//     } else {
//       let query = {
//         exerciseId: route?.params?.exerciseId,
//         startDate: `${moment().startOf('month').format('YYYY-MM-DD')}`,
//         endDate: `${moment().endOf('month').format('YYYY-MM-DD')}`,
//         type: route?.params?.title == 'My Weight' ? 2 : route?.params?.type,
//       };
//       usersService.getMilestoneTrackerData(query).then(res => {
//         setChartData(res.data.responseData.result?.tracker1);
//         setData(res.data.responseData.result?.tracker2);
//         setLoader(false);
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

//   return (
//     <ScrollView style={{backgroundColor: COLORS.white}}>
//       <View style={styles.container}>
//        <View style={{flexDirection:"row"}}>
//        <TouchableOpacity onPress={()=>navigation.goBack()} style={{alignSelf:"flex-start",marginTop:20}}>
//         <CrossIcon/>
//         </TouchableOpacity>
//         <Text style={{textAlign:"center",flex:1, marginTop:30,}}>{route?.params?.title}</Text>
//        </View>
//         {/* {route?.params?.type == 2 || route?.params?.title == 'My Weight' ? null : (
//           <View style={styles.textInputContainerStyle}>
//             <TextInput
//               style={{fontSize: 15, paddingTop: 15, color: 'black'}}
//               keyboardType={'number-pad'}
//               placeholder="Reps"
//               value={reps}
//               onChangeText={text => updateReps(text)}
//               maxLength={3}
//             />
//           </View>
//         )} */}
//         {/* <View
//           style={
//             route?.params?.type == 2 || route?.params?.title == 'My Weight'
//               ? styles.dropdownContain
//               : styles.dropdownContainer
//           }>
//           <DropDown
//             onChangeText={text => {
//               updateInput(text);
//             }}
//             textInputValue={input}
//             length={route?.params?.length}
//             getDropDownValue={setDropDownItem}
//           />
//         </View> */}

//         {/* <View
//           style={
//             route?.params?.type == 2 || route?.params?.title == 'My Weight'
//               ? styles.saveButton
//               : styles.saveButton
//           }>
//           {saved ? (
//             <Text style={styles.savedTextStyle}>Saved</Text>
//           ) : input ? (
//             <GradientButton
//               title="Save"
//               onPress={() =>
//                 route?.params?.type == 2 || route?.params?.title == 'My Weight'
//                   ? onSaveMeasurment()
//                   : onSave()
//               }
//               style={{paddingHorizontal: 40, paddingVertical: 15}}
//             />
//           ) : (
//             <View style={styles.saveButtonDisabledStyle}>
//               <Text style={styles.saveButtonDisabledTextStyle}>Save</Text>
//             </View>
//           )}
//         </View> */}
//         {<View style={{marginTop:50}}/>}
//         {loader ? (
//           <View style={styles.activityIndicatorContainer}>
//             <ActivityIndicator size={'large'} />
//           </View>
//         ) : (
//           <>
//             <View
//               style={{
//                 marginTop:
//                   route?.params?.type == 2 || route?.params?.title == 'My Weight'
//                     ? -60
//                     : -60,
//               }}>
//               <LastSavedContainer
//                 data={chartData}
//                 dropDownItem={dropDownItem}
//                 onDelete={onDelete}
//                 type={route?.params?.type}
//                 title={route?.params?.title}
//                 selectedUnit={selectedUnit}
//                 getConvertedValue={getConvertedValue}
//               />
//             </View>

//             <View style={styles.subContainer}>
//               <View style={styles.statisticsContainer}>
//                 <Text style={styles.statisticsTitleStyle}>Statistics</Text>
//               </View>
//               <Pressable
//                 style={styles.monthDropDownStyle}
//                 onPress={() => setOpen(true)}>
//                 <DobCalenderIcon />
//               </Pressable>
//               <DatePicker
//                 modal
//                 mode="date"
//                 open={open}
//                 date={date}
//                 androidVariant="nativeAndroid"
//                 maximumDate={new Date()}
//                 minimumDate={new Date('1940-01-01')}
//                 onConfirm={date => onMonthChange(date)}
//                 onCancel={() => {
//                   setOpen(false);
//                 }}
//               />

//               {/* <MonthDropDown style={styles.monthDropDownStyle} onMonthSelect={(value)=> onMonthChange(value)}/> */}
//               <View style={styles.chartContainerStyle}>
//                 <LineChart
//                   data={{
//                     labels: [{savedAt: new Date(), value: 1}]
//                       .concat(data)
//                       ?.map(item => {
//                         return new Date(item?.savedAt).getDate();
//                       }),
//                     datasets: [
//                       {
//                         data: [{savedAt: new Date(), value: 1}]
//                           .concat(data)
//                           ?.map(item =>
//                             getConvertedValue(
//                               item?.value ? item?.value : item?.weight,
//                             ),
//                           ),
//                       },
//                     ],
//                   }}
//                   width={Dimensions.get('window').width - 40} // from react-native
//                   height={180}
//                   yAxisInterval={2} // optional, defaults to 1
//                   withVerticalLines={false}
//                   chartConfig={{
//                     backgroundGradientFromOpacity: 0,
//                     backgroundGradientToOpacity: 0,
//                     strokeWidth: 2,
//                     decimalPlaces: 0, // optional, defaults to 2dp
//                     color: (opacity = 1) => `rgb(13,184,218)`,
//                     labelColor: (opacity = 1) => 'rgb(189, 189, 189)',
//                     style: {
//                       borderRadius: 16,
//                     },
//                     propsForDots: {
//                       r: '5',
//                       strokeWidth: '3',
//                       stroke: COLORS.blue,
//                       fill: 'white',
//                     },
//                     propsForBackgroundLines: {
//                       strokeWidth: '1',
//                       stroke: COLORS.lightGrey,
//                       strokeDasharray: '10',
//                     },
//                     propsForLabels: {
//                       fontFamily: 'Manrope-Regular',
//                       fontSize: 13,
//                     },
//                   }}
//                   bezier
//                   formatYLabel={value => `${value}    `}
//                   hidePointsAtIndex={[0]}
//                   style={styles.graphStyle}
//                   segments={3}
//                 />

//                 <View style={{position: 'absolute', left: '6%', top: 5}}>
//                   <Text
//                     style={{
//                       color: COLORS.grey_3,
//                       fontFamily: 'Manrope-Regular',
//                       fontSize: 13,
//                     }}>
//                     {dropDownItem}
//                   </Text>
//                 </View>
//                 <View style={{position: 'absolute', left: '6%', bottom: 15}}>
//                   <Text
//                     style={{
//                       color: COLORS.grey_3,
//                       fontFamily: 'Manrope-Regular',
//                       fontSize: 13,
//                       textTransform: 'capitalize',
//                     }}>
//                     {month.slice(0, 4)}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </>
//         )}
//       </View>
//     </ScrollView>
//   );
// });

// export default TrackDataScreen;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.white,
//     flex: 1,
//     padding: 10,
//     paddingTop: 20,

//   },
//   dropdownContainer: {
//     zIndex: 100,
//     paddingLeft: 15,
//     width: '50%',
//     marginTop: 0,
//   },
//   dropdownContain: {
//     zIndex: 100,
//     paddingLeft: 15,
//     width: '50%',
//   },
//   saveButtonContainer: {
//     position: 'absolute',
//     marginTop: 80,
//     left: '40%',
//   },
//   savedTextStyle: {
//     fontFamily: 'Manrope-Regular',
//     color: COLORS.lightGreen,
//     fontSize: 15,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//   },
//   saveButtonDisabledStyle: {
//     backgroundColor: COLORS.grey_6,
//     borderRadius: 30,
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//   },
//   saveButtonDisabledTextStyle: {
//     fontFamily: 'Manrope-Regular',
//     color: COLORS.grey_4,
//     fontSize: 15,
//     textAlign: 'center',
//     // marginTop:10
//   },
//   subContainer: {
//     marginTop: 20,
//     // alignItems:'center'
//   },
//   monthDropDownStyle: {position: 'absolute', right: 0, width: 40, top: 10},
//   chartContainerStyle: {
//     backgroundColor: COLORS.light_grey,
//     marginTop: 2,
//     paddingTop: 20,
//     zIndex: -1,
//     paddingBottom: 10,
//   },
//   graphStyle: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   statisticsContainer: {
//     paddingVertical: 10,
//     backgroundColor: COLORS.light_grey,
//     paddingHorizontal: 15,
//     borderTopLeftRadius: 5,
//     borderTopRightRadius: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//   },
//   statisticsTitleStyle: {fontFamily: 'Manrope-Bold', fontSize: 16},
//   activityIndicatorContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
//   selectDateFieldStyle: {
//     marginVertical: 10,
//     paddingVertical: 10,
//     borderBottomWidth: 2,
//     paddingHorizontal: 15,
//     borderColor: COLORS.grey_4,
//     flexDirection: 'row',
//   },
//   textInputContainerStyle: {
//     borderWidth: 1,
//     height: 50,
//     width: '50%',
//     paddingLeft: 10,
//     borderColor: COLORS.grey_6,
//     position: 'absolute',
//     marginVertical: 20,
//     left: 25,
//     borderTopRightRadius: 10,
//     borderTopLeftRadius: 10,
//     borderBottomRightRadius: 10,
//     borderBottomLeftRadius: 10,
//   },
//   saveButton: {
//     position: 'absolute',
//     top: 20,
//     right: 25,
//     marginTop:"15%"
//   },
// });

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MainScreen } from "../../common/Screen";
import { FlatList } from "react-native-gesture-handler";
import { COLORS } from "../../common/Constant";
import Header from "../../components/header/Header";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usersService } from "../../services/ApiServices";
import AlertModal from "../modal/AlertModal";
const TrackDataScreen = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [month, setMonth] = useState("");
  const [dropDownItem, setDropDownItem] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [reps, setReps] = useState("");
  const [exerciseStats, setExerciseStats] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("KG");
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectIndex, setSelectIndex] = useState(-1)

  useEffect(() => {
    getMilestoneData();
  }, []);
  useEffect(async () => {
    const unitt = await AsyncStorage.getItem("selectedUnit");

    if (unitt) {
      // alert(unitt)
      setSelectedUnit(JSON.parse(unitt));
    }
  }, []);
  const getConvertedValue = (value) => {
    if (dropDownItem === "IN" && value) {
      return (value / 2.54)?.toFixed(1);
    } else if (dropDownItem === "LBS" && value) {
      return (value * 2.20462)?.toFixed(1);
    } else {
      return value;
    }
  };

  const convertValueForQuery = (value) => {
    if (dropDownItem === "IN") return (value * 2.54).toFixed(1);
    else if (dropDownItem === "LBS") return (value * 0.4535).toFixed(1);
    else return value;
  };

  useEffect(() => {
    const obj = {
      weight: input,
      reps: reps,
    };
    setExerciseStats(obj);
  }, [input, reps]);

  const getMilestoneData = () => {
   
    usersService
      .getMilestoneTrackerData(route?.params?.exerciseId)
      .then((res) => {
        console.log("elseResult", res.data.responseData.result);
        // setChartData(res.data.responseData.result?.tracker1);
        let data = [];
        res.data.responseData.result?.tracker2.map((item) => {
          if (item.exerciseData) {
            let add = item.exerciseData.map((i) => i.weight);
            data.push({
              ...item,
              total: add.reduce(
                (partialSum, a) => Number(partialSum) + Number(a),
                0
              ),
            });
          } else {
            data.push({
              ...item,
              exerciseData: [
                { id: Math.random(), reps: item.reps, wight: item.weight },
              ],
              total: item.weight,
            });
          }
        });
        setLoader(false);
        setSelectIndex(-1)
        // data = data.filter((i)=> i.savedAt)
        // console.log({data})

        setData(data.sort((a, b) => b.total - a.total));
        // setLoader(false);
      });
    // }

    // }
  };

  const weightList = (i) => {
    return (
      <ScrollView key={i} horizontal showsHorizontalScrollIndicator={false}>
        {data[i].exerciseData.map((item, index) => (
          <View
            key={index}
            style={{
              borderColor: i == 0 ? COLORS.white : COLORS.black,
              borderWidth: 1,
              marginRight: 10,

              justifyContent: "center",
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.weightText,
                { color: i == 0 ? COLORS.white : COLORS.black },
              ]}
            >
              {item.reps}
            </Text>
            <View
              style={{
                height: 15,
                backgroundColor: i == 0 ? COLORS.white : COLORS.grey,
                width: 1,
              }}
            />
            <Text
              style={[
                styles.weightText,
                { color: i == 0 ? COLORS.white : COLORS.black },
              ]}
            >
              {item.weight
                ? selectedUnit === "LBS"
                  ? (item.weight * 2.20462)?.toFixed(1)
                  : item.weight?.toFixed(1)
                : 0}{" "}
              {selectedUnit === "LBS" ? "LBS" : "KG"}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={[
          styles.listView,
          {
            backgroundColor: index == 0 ? COLORS.lightGreen : COLORS.grey_6,
            borderTopLeftRadius: index == 0 ? 5 : 0,
            borderTopRightRadius: index == 0 ? 5 : 0,
            borderBottomLeftRadius: index == data.length - 1 ? 5 : 0,
            borderBottomRightRadius: index == data.length - 1 ? 5 : 0,
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
            {item?.savedAt}
          </Text>

          {index == 0 ? (
            <Text
              style={[
                styles.listText,
                { flex: 0, color: index == 0 ? COLORS.white : COLORS.black },
              ]}
            >
              Personal best
            </Text>
          ) : null}
        </View>
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 17,
          }}
        >
          {weightList(index)}
          {loader  && index== selectIndex? (
            <ActivityIndicator
              animating
              color={index == 0 ? COLORS.white : COLORS.black}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                // setAlertVisible(!alertVisible)s
                setSelectIndex(index)
                deleteHistory(item);
              }}
              activeOpacity={0.8}
              style={{
                height: 30,
                width: 30,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  tintColor: index == 0 ? "white" : "black",
                }}
                source={require("../../../assets/trash.png")}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const deleteHistory = (item) => {
    Alert.alert("Alert", "Are you sure you want to delete your history?", [
      {
        text: "Cancel",
        onPress: () => {
          setSelectIndex(-1)
        },
      },
      {
        text: "Ok",
        onPress: () => {
          onDelete(item);
        },
      },
    ]);
  };

  const onDelete = async (item) => {
    // console.log({item})
    setLoader(true)
    let query = {
      category: route?.params?.category,
      savedAt: item?.savedAt,
      type:
        route?.params?.type == 2 || route?.params?.title == "My Weight"
          ? route.params.type
          : 1,
      exerciseId: route?.params?.exerciseId,
    };

    const result = await usersService.deleteMilestoneTrackerData(query);
    // console.log(result.data);
    if (result.data.responseData.message == "Success") {
      getMilestoneData();
    }else{
      setSelectIndex(-1)
      setLoader(false)
    }
  };

  const toggle = (item) => {
    setAlertVisible(!alertVisible);
    onDelete(item);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {route?.params.screen == "measure" ||
      route?.params?.screen == "hard" ? null : (
        <Header top={Platform.OS == "android" ? 20 : 0} title="Lift History" />
      )}
      <View style={{ flex: 1, marginTop: 10, backgroundColor: "white" }}>
        {data.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{}}
            keyExtractor={(item, index) => index}
            data={data}
            renderItem={renderItem}
          />
        ) : (
          <View />
        )}

        {/* <AlertModal cancel={toggle}
        onResume={toggle}
          alert={alertVisible}
          marginHorizontal={20}
          headertitle={"Alert"}
          content={"Are you sure you want to delete it?"}
          cancelBtn={"No"}
          saveBtn={"Yes"}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default TrackDataScreen;

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
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
