import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import {scale} from 'react-native-size-matters';
import {COLORS, DeviceScreen} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import {BarChart} from 'react-native-gifted-charts';
import {BarDataSelectedModal} from './BarDataSelectedModal';
import moment from 'moment';
import {PenIcon} from '../../Svg';
import { storeSleepGraphData } from '../../_action/GraphDataAction';
import ModifySleepTargetModal from './SleepGoal';
import {connect} from 'react-redux';
import { Loader } from '../../common/Loader';

const fill = '#6839ef';
let minuteSum = 0,
  minutesDuration,
  index1 = 0,
  updated1MonthBarData = [],
  updated3MonthBarData = [];
let SleepScreen = React.memo(function SleepScreen(props) {
  const dispatch = useDispatch();
  const [monthlyData, setMonthlyData] = useState(props?.graphDataReducer?.oneMonthAvg);
  const [currentButtonSelected, setCurrentButtonSelected] = useState('week');
  const [monthlyDataOf3, setMonthlyDataOf3] = useState(props?.graphDataReducer?.threeMonthAvg);
  const [weeklyData, setWeeklyData] = useState(props?.graphDataReducer?.oneWeekAvg);
  const [loading, setLoading] = useState(true);
  const [weeklyDataInMin, setWeeklyDataInMin] = useState('');
  const [weekArr, setWeekArr] = useState(props?.graphDataReducer?.oneWeekList || []);
  const [monthArr, setMonthArr] = useState(props?.graphDataReducer?.oneMonthList || []);
  const [threeMonthArr, set3MonthArr] = useState(props?.graphDataReducer?.threeMonthList || []);
  const [oneMonthBarDate, setOneMonthBarDate] = useState(props?.graphDataReducer?.oneMonthDates || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBarData, setSelectedBarData] = useState({
    barDatavalue: '',
    pageX: 0,
    pageY: 0,
  });
  const [threeMonthsBarDate, setThreeMonthsBarDate] = useState(props?.graphDataReducer?.threeMonthDates || []);

  let {prev3MonthOfSleepData, monthlySleep, weeklysleep, todaySleep} =
    props?.route?.params;

  const fetchDay = day => {
    switch (day) {
      case 0:
        return 'Sun';
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
    }
  };

  useEffect(() => {
    
    // setLoading(res => !res); 
  },[threeMonthArr])

  // useEffect(() => {
  //   if(dataToFetch == 'month') {
  //     updateOneMonthData();
  //   }
  //   else if(dataToFetch == '3month') {
  //     // setTimeout(() => {
  //       updateThreeMonthData();
  //     // },500)

  //   }
  // },[dataToFetch])

  useEffect(() => {
 
    if(weekArr.length === 0) {
      updateOneWeekData();
    }
    else {
      setLoading(false)
    }

    if(monthArr.length === 0) {
      updateOneMonthData();
    }
    if(threeMonthArr.length === 0) {
      updateThreeMonthData();

    }
    else {
      setLoading(false)
    }    
  }, []);

  let labelConfig = {
    fontSize: 10,
    color: COLORS.grey_2,
    fontFamily: 'Manrope-Semibold',
    marginLeft: scale(
      (weekArr.length === 1
        ? 33
        : weekArr.length === 2
        ? 30
        : weekArr.length === 3
        ? 28
        : 10) / 2,
    ),
  };

  const onSleepUpdate = () => {
    if (props?.getProfileData?.planName == 'Premium' || props?.getProfileData?.planName == 'Standard') {
      setModalVisible(true);
    } else {
      changeMemershipModal();
    }
  };

  const changeMemershipModal = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access this feature, please upgrade to premium',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props.navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  const updateOneMonthData = () => {
    if (monthlySleep?.length !== 0) {
      minuteSum = 0;
      (index1 = 0), (updated1MonthBarData = []);
      monthlySleep = monthlySleep.sort(function (a, b) {
        return new Date(a.endDate) - new Date(b.endDate);
      });




      while (index1 <= monthlySleep.length - 1) {
        minutesDuration = parseFloat(
          moment
            .duration(
              moment(monthlySleep[index1].endDate).diff(
                moment(monthlySleep[index1].startDate),
              ),
            )
            .asMinutes(),
        );
        minuteSum = minuteSum + minutesDuration;
        // console.log('month duration comiong====',
        // Math.floor(minutesDuration / 60),'h ',
        // (((minutesDuration / 60) - Math.floor(minutesDuration / 60))*60).toFixed(0), ' min',
        // '=date====,',moment(monthlySleep[index1].endDate).format('YYYY-MM-DD'),'=date====,',moment(monthlySleep[index1].startDate).format('YYYY-MM-DD')   );

        index1++;
      }
      combineDataForSimilarDates(monthlySleep, '1month');
      // console.log('minuteSum 1 month===',minuteSum)
      setMonthlyData(
        Math.floor(minuteSum / 30 / 60) +
          'h ' +
          Math.round((minuteSum / 30) % 60) +
          'm',
      );
      dispatch(storeSleepGraphData('1monthAvg',Math.floor(minuteSum / 30 / 60) +
      'h ' +
      Math.round((minuteSum / 30) % 60) +
      'm',));
      updated1MonthBarData = [];
      if (monthlySleep.length) {
        index1 = 0;
        let incementBy = Math.round(monthlySleep.length / 4);

        while (index1 <= monthlySleep.length - 1) {
          updated1MonthBarData.push({
            value: moment(monthlySleep[index1].endDate).format('MM/DD'),
          });

          index1 = index1 + incementBy;
        }

        updated1MonthBarData.push({
          value: moment(monthlySleep[monthlySleep.length - 1].endDate).format(
            'MM/DD',
          ),
        });
        updated1MonthBarData = updated1MonthBarData.filter(
          (v, i, a) => a.findIndex(v2 => v2.value === v.value) === i,
        );
        dispatch(storeSleepGraphData('1monthDates',updated1MonthBarData));

        setOneMonthBarDate(updated1MonthBarData);
      }

      updated1MonthBarData = [];
    }
  };

  const updateOneWeekData = () => {
    if (weeklysleep?.length !== 0) {
      minuteSum = 0;
      var barData = [],
        minutesDurationhoursDuration,
        hourSum = 0,
        hoursDuration;
      weeklysleep = weeklysleep.sort(function (a, b) {
        return new Date(a.endDate) - new Date(b.endDate);
      });
      
        //  '=date====,',moment(weeklysleep[index1].endDate).format('YYYY-MM-DD'),'=date====,',moment(weeklysleep[index1].startDate).format('YYYY-MM-DD')   );

      combineDataForSimilarDates(weeklysleep, 'week');
      // console.log('weekly neeraj sleep====',weeklysleep);
      index1 = 0;
      while (index1 <= weeklysleep.length - 1) {
        minutesDuration = parseFloat(
          moment
            .duration(
              moment(weeklysleep[index1].endDate).diff(
                moment(weeklysleep[index1].startDate),
              ),
            )
            .asMinutes(),
        );

       
        minuteSum = minuteSum + minutesDuration;
              
        


        index1++;
      }
      // console.log('minute sum 7 getitng===',minuteSum)
      dispatch(storeSleepGraphData('weekavg',Math.floor(minuteSum / 7 / 60) +
      'h ' +
      Math.round((minuteSum / 7) % 60) +
      'm',));
      setWeeklyData(Math.floor(minuteSum / 7 / 60) +
      'h ' +
      Math.round((minuteSum / 7) % 60) +
      'm',);
      // setWeeklyDataInMin(Math.round((minuteSum / 7) % 60));
      
      barData = [];
    }
    else {
     
     
     
      
      
    }

  };
  const updateThreeMonthData = () => {
    if (prev3MonthOfSleepData?.length !== 0) {
      minuteSum = 0;
      updated3MonthBarData = [];
      prev3MonthOfSleepData = prev3MonthOfSleepData.sort(function (a, b) {
        return new Date(a.endDate) - new Date(b.endDate);
      });

      prev3MonthOfSleepData?.map((item, index) => {
        let endDate = moment(item.endDate);
        let startDate = moment(item.startDate);

        minutesDuration = parseFloat(
          moment.duration(endDate.diff(startDate)).asMinutes(),
        );
        minuteSum = minuteSum + minutesDuration;
      });
      combineDataForSimilarDates(prev3MonthOfSleepData, '3month');

      updated3MonthBarData = [];
      if (prev3MonthOfSleepData.length) {
        index1 = 0;
        let incementBy = Math.round(prev3MonthOfSleepData.length / 4);

        while (index1 <= prev3MonthOfSleepData.length - 1) {
          updated3MonthBarData.push({
            value: moment(prev3MonthOfSleepData[index1].endDate).format(
              'MM/DD',
            ),
          });

          index1 = index1 + incementBy;
        }

        updated3MonthBarData.push({
          value: moment(
            prev3MonthOfSleepData[prev3MonthOfSleepData.length - 1].endDate,
          ).format('MM/DD'),
        });
        updated3MonthBarData = updated3MonthBarData.filter(
          (v, i, a) => a.findIndex(v2 => v2.value === v.value) === i,
        );

        setThreeMonthsBarDate(updated3MonthBarData);
        dispatch(storeSleepGraphData('3monthDates',updated3MonthBarData));
        // console.log('minuteSum 3 month===',minuteSum)
        setMonthlyDataOf3(
          Math.floor(minuteSum / 90 / 60) +
            'h ' +
            Math.round((minuteSum / 90) % 60) +
            'm',
        );
        // setLoading(false)
        dispatch(storeSleepGraphData('3monthAvg',Math.floor(minuteSum / 90 / 60) +
        'h ' +
        Math.round((minuteSum / 90) % 60) +
        'm',));

      }

        setLoading(false);
      
      

      updated3MonthBarData = [];
    }
    else {
      setLoading(false);
    }
  };

  const combineDataForSimilarDates = (list, type) => {
    let index1 = 0,
      index2 = 0,
      updatedList = [],
      sum = 0;

    const checkIfItemExists = endDate => {
      if (updatedList.length > 0) {
        return updatedList.some(item =>
          moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
            moment(endDate).format('YYYY-MM-DD'),
          ),
        );
      } else {
        return false;
      }
    };

    while (index1 <= list.length - 1) {
      if (!checkIfItemExists(list[index1].endDate)) {
        (index2 = 0), (sum = 0);
        while (index2 <= list.length - 1) {
          if (
            moment(moment(list[index1].endDate).format('YYYY-MM-DD')).isSame(
              moment(moment(list[index2].endDate).format('YYYY-MM-DD')),
            )
          ) {
            sum =
              sum +
              parseFloat(
                moment
                  .duration(
                    moment(list[index2].endDate).diff(
                      moment(list[index2].startDate),
                    ),
                  )
                  .asHours()
                  .toFixed(1),
              );
          }
          index2++;
        }
        updatedList.push({
          value: parseFloat(sum),
          frontColor: fill,
          label:
            type == 'week'
              ? fetchDay(new Date(list[index1].endDate).getDay())
              : undefined,
          endDate: moment(list[index1].endDate).format('YYYY-MM-DD'),
        });
      }
      index1++;
    }
    if (type == 'week') {
      setWeekArr(updatedList);
      dispatch(storeSleepGraphData('weeklist',updatedList));
    } else if (type == '1month') {
      setMonthArr(updatedList);
      dispatch(storeSleepGraphData('1monthlist',updatedList));
    } else if (type == '3month') {
      set3MonthArr(updatedList);
      dispatch(storeSleepGraphData('3monthlist',updatedList));
    }

    updatedList = [];
  };

  const getBarSpacing = () => {
    if (currentButtonSelected == '3month') {
      if (threeMonthArr.length <= 20) {
        return scale(14);
      } else if (threeMonthArr.length <= 30) {
        return scale(8);
      } else {
        return scale(5);
      }
    } else if (currentButtonSelected == '1month') {
      if (monthArr.length <= 20) {
        return scale(18);
      } else if (monthArr.length <= 30) {
        return scale(7);
      } else {
        return scale(6);
      }
    } else if (currentButtonSelected == 'week') {
      if (weekArr.length === 1) {
        return scale(35);
      } else if (weekArr.length === 2) {
        return scale(65);
      } else if (weekArr.length === 3) {
        return scale(80);
      } else if (weekArr.length === 4) {
        return scale(59);
      } else if (weekArr.length === 5) {
        return scale(41);
      } else if (weekArr.length === 6) {
        return scale(32);
      } else if (weekArr.length === 7) {
        return scale(26.5);
      } else {
        return scale(25);
      }
    }
  };

  const getBarWidth = () => {
    if (currentButtonSelected == '3month') {
      if (threeMonthArr.length <= 20) {
        return scale(10);
      } else if (threeMonthArr.length <= 25) {
        return scale(7);
      } else if (threeMonthArr.length <= 30) {
        return scale(4);
      } else {
        return scale(3);
      }
    } else if (currentButtonSelected == '1month') {
      if (monthArr.length <= 20) {
        return scale(15);
      } else if (monthArr.length <= 25) {
        return scale(7);
      } else if (monthArr.length <= 30) {
        return scale(4);
      } else {
        return scale(3);
      }
    } else if (currentButtonSelected == 'week') {
      if (weekArr.length === 1) {
        return scale(37);
      } else if (weekArr.length === 2) {
        return scale(35);
      } else if (weekArr.length === 3) {
        return scale(30);
      } else if (weekArr.length === 4) {
        return scale(18);
      } else if (weekArr.length === 5) {
        return scale(16);
      } else if (weekArr.length === 6) {
        return scale(14);
      } else if (weekArr.length === 7) {
        return scale(12);
      } else {
        return scale(10);
      }
    }
  };

  const renderBarDates = () => {
    return currentButtonSelected == '1month' ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: DeviceScreen.width - 80,
          alignSelf: 'center',
          marginLeft: scale(15),
        }}>
        {oneMonthBarDate.map(item => {
          return <Text style={{fontSize: 10}}>{item.value}</Text>;
        })}
      </View>
    ) : currentButtonSelected == '3month' ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: DeviceScreen.width - 80,
          alignSelf: 'center',
          marginLeft: scale(15),
        }}>
        {threeMonthsBarDate.map(item => {
          return <Text style={{fontSize: 10}}>{item.value}</Text>;
        })}
      </View>
    ) : null;
  };

  const getInitialSpacing = () => {
    if (currentButtonSelected == 'week') {
      if (weekArr.length === 1) {
        return scale((DeviceScreen.width - 160) / 2);
      } else if (weekArr.length === 2) {
        return scale((DeviceScreen.width - 200) / 3);
      } else if (weekArr.length === 3) {
        return scale(15);
      } else {
        return scale(16);
      }
    } else {
      return scale(16);
    }
  };

  const onBarPress = (evt, item) => {
    setSelectedBarData({
      barDatavalue: item?.value,
      pageX: evt?.nativeEvent?.pageX,
      pageY: evt?.nativeEvent?.pageY,
      date: item?.endDate,
    });
  };
  
  // console.log('current===', selectedBarData);
  // console.log('graphDataReducer====',props?.graphDataReducer);
  return (
    <MainScreen>
      <ModifySleepTargetModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        setModalVisible={setModalVisible}
      />

       {/* <Loader loading={loading}/> */}
      <ScrollView>
        <View style={styles.goal}>
          <Text style={styles.title}>Your goal</Text>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={onSleepUpdate}>
            <View style={{padding: 6}}>
              <PenIcon width={18} height={18} color={'#6839ef'} />
            </View>
            <Text style={styles.stepsCount}>
              {props?.getProfileData?.sleepGoal
                ? props?.getProfileData?.sleepGoal + 'h'
                : 0 + 'h'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goal}>
          <Text style={styles.title}>Total today</Text>
          <Text style={styles.stepsCount}>{todaySleep}</Text>
        </View>
        <View style={styles.avgSteps}>
          <View>
            <Text style={styles.title}>Average Sleep</Text>
            <Text style={styles.weekDate}>
              {currentButtonSelected == '3month'
                ? moment().subtract(90, 'days').startOf('day').format('ll') +
                  ' - ' +
                  moment().format('ll')
                : currentButtonSelected == '1month'
                ? moment().subtract(30, 'days').startOf('day').format('ll') +
                  ' - ' +
                  moment().format('ll')
                : Platform.OS == 'android'
                ? moment().subtract(7, 'days').startOf('day').format('ll') +
                  ' - ' +
                  moment().format('ll')
                : moment().subtract(7, 'days').startOf('day').format('ll') +
                  ' - ' +
                  moment().format('ll')}
            </Text>
          </View>
          <Text style={styles.stepsCount}>
            {currentButtonSelected == '3month'
              ? monthlyDataOf3 == undefined
                ? 0
                : monthlyDataOf3
              : currentButtonSelected == '1month'
              ? monthlyData == undefined
                ? 0
                : monthlyData
              : weeklyData == undefined
              ? 0 + 'h'
              : weeklyData}
          </Text>
        </View>
        <View
          style={{
            padding: 15,
          }}>
          <View style={{backgroundColor: COLORS.grey_6, paddingBottom: 20}}>
            <View
              style={{
                left: -15,
              }}>
              <BarChart
                width={DeviceScreen.width - 80}
                noOfSections={4}
                data={
                  currentButtonSelected == '3month'
                    ? threeMonthArr
                    : currentButtonSelected == '1month'
                    ? monthArr
                    : currentButtonSelected == 'week' && weekArr
                }
                // leftShiftForLastIndexTooltip = {55}
                onPress={onBarPress}
                activeOpacity={0.2}
                isAnimated={false}
                xAxisLabelTextStyle={labelConfig}
                barWidth={getBarWidth()}
                disableScroll={true}
                scrollAnimation={false}
                labelWidth={30}
                initialSpacing={getInitialSpacing()}
                yAxisColor={COLORS.grey_6}
                hideYAxisText
                spacing={getBarSpacing()}
                xAxisColor={COLORS.grey_4}
                // lineBehindBars={false}
              />
              {renderBarDates()}
            </View>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', justifyContent: 'center', padding: 20}}>
          <TouchableOpacity
            style={
              currentButtonSelected == 'week'
                ? styles.activeBtn
                : styles.inActiveBtn
            }
            onPress={() => setCurrentButtonSelected('week')}>
            <Text
              style={{
                textAlign: 'center',
                color: currentButtonSelected == 'week' ? '#6839ef' : 'black',
                fontFamily: 'Manrope-Semibold',
              }}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              currentButtonSelected == '1month'
                ? styles.activeBtn
                : styles.inActiveBtn
            }
            onPress={() => setCurrentButtonSelected('1month')}>
            <Text
              style={{
                textAlign: 'center',
                color: currentButtonSelected == '1month' ? '#6839ef' : 'black',
                fontFamily: 'Manrope-Semibold',
              }}>
              1 Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              currentButtonSelected == '3month'
                ? styles.activeBtn
                : styles.inActiveBtn
            }
            onPress={() => setCurrentButtonSelected('3month')}>
            <Text
              style={{
                textAlign: 'center',
                color: currentButtonSelected == '3month' ? '#6839ef' : 'black',
                fontFamily: 'Manrope-Semibold',
              }}>
              3 Month
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {selectedBarData.barDatavalue ? (
        <BarDataSelectedModal
          onClose={() => setSelectedBarData({barDatavalue: 0})}
          selectedBarData={selectedBarData}
          day={selectedBarData.date}
          goal={props?.getProfileData?.sleepGoal}
          type={'sleep'}
        />
      ) : (
        <View />
      )}
      
      {
       loading&& 
      <View 
        style={{
          ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
        }}
      
      >
        <View  style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'black',
          opacity: 0.5
        }} />
        <View style={{ 
          height: scale(50),
          borderRadius: scale(13),
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'black',
          paddingHorizontal: scale(10)
        }}>
            <ActivityIndicator 
            color={'white'}
            
            />
            <Text style={{ color: 'white', marginLeft: scale(15) } }>I’m checking your sleep data 💤</Text>
        </View>
        </View>}
    </MainScreen>
  );
});

let mapStateToProps = state => {
  return {
    getProfileData:
      state?.profileReducer?.profile?.data?.responseData?.userProfile,
    graphDataReducer: state?.graphDataReducer?.sleepGraphData

  };
};
export default connect(mapStateToProps)(SleepScreen);

const styles = StyleSheet.create({
  goal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    height: 90,
    borderBottomColor: COLORS.grey_5,
  },
  avgSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    marginTop: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Manrope-bold',
  },
  stepsCount: {
    fontSize: 22,
    fontFamily: 'Manrope-Bold',
  },
  weekDate: {
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Manrope',
    color: COLORS.grey_2,
  },
  inActiveBtn: {
    padding: 15,
    backgroundColor: COLORS.grey_6,
    marginRight: 10,
    width: '30%',
    borderRadius: 10,
    borderColor: COLORS.grey_4,
    borderWidth: 1,
  },
  activeBtn: {
    padding: 15,
    backgroundColor: '#6839ef29',
    marginRight: 10,
    width: '30%',
    borderRadius: 10,
    borderColor: '#6839ef',
    borderWidth: 1.6,
  },
});
