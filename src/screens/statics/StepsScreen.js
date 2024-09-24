import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {COLORS, DeviceScreen} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import moment from 'moment';
import {BarDataSelectedModal} from './BarDataSelectedModal';
import {scale} from 'react-native-size-matters';
import CollapsableContainer from '../../components/CollapsableContainer';
import GradientButton from '../../components/GradientButton';
import {PenIcon} from '../../Svg';
import {useNavigation} from '@react-navigation/native';
import {usersService} from '../../services/ApiServices';
import settings from '../../config/settings';
import LinearGradient from 'react-native-linear-gradient';
import {getProfileAction} from '../../_action/ProfileAction';
import {useDispatch, connect} from 'react-redux';
import ModifyStepsTargetModal from './ModifyStepsTargetModal';
import Tooltip from 'rn-tooltip';
import {BarChart} from 'react-native-gifted-charts';
import {getBaseOs} from 'react-native-device-info';
const screenWidth = Dimensions.get('window').width;
const item = [
  {
    steps: 2396,
    userId: {
      fname: 'Ricky',
      lname: 'Andr',
      profileImage: 'profileImage_1666156740220_BB64CDAC-E606-4464-8D02-24651F698673.jpg'
    },
    _id: "634e6bf4c5637900182c527c"
  },
  {
    steps: 2396,
    userId: {
      fname: 'Ricky',
      lname: 'Andr',
      profileImage: 'profileImage_1666156740220_BB64CDAC-E606-4464-8D02-24651F698673.jpg'
    },
    _id: "634e6bf4c5637900182c527c"
  },
  {
    steps: 2396,
    userId: {
      fname: 'Ricky',
      lname: 'Andr',
      profileImage: 'profileImage_1666156740220_BB64CDAC-E606-4464-8D02-24651F698673.jpg'
    },
    _id: "634e6bf4c5637900182c527c"
  },
  {
    steps: 2396,
    userId: {
      fname: 'Ricky',
      lname: 'Andr',
      profileImage: 'profileImage_1666156740220_BB64CDAC-E606-4464-8D02-24651F698673.jpg'
    },
    _id: "634e6bf4c5637900182c527c"
  },
  {
    steps: 2396,
    userId: {
      fname: 'Ricky',
      lname: 'Andr',
      profileImage: 'profileImage_1666156740220_BB64CDAC-E606-4464-8D02-24651F698673.jpg'
    },
    _id: "634e6bf4c5637900182c527c"
  }
]
var barData = [],
  updated3MonthBarData = [],
  updated1MonthBarData = [],
  index1;
const fill = '#76c72e';
let StepScreen = React.memo(function StepsScreen(props) {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const eventViewRef = useRef();
  const dispatch = useDispatch();
  const [threeMonthsBarDate, setThreeMonthsBarDate] = useState([]);
  const [oneMonthBarDate, setOneMonthBarDate] = useState([]);
  const [currentButtonSelected, setCurrentButtonSelected] = useState('week');
  const [leaderBoardData, setLeaderBoardData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [weekBarData, setWeekBarData] = useState([]);
  const [selectedBarData, setSelectedBarData] = useState({
    barDatavalue: '',
    pageX: 0,
    pageY: 0,
  });
  const [steps3MonthData, setSteps3MonthData] = useState([]);
  const [monthlyStepsData, setMonthlyStepsData] = useState([]);
  const [monthDateRangeForStartDate, setMonthlyDateRangeForStartDate] =
    useState();
  const [monthDateRangeForEndDate, setMonthlyDateRangeForEndDate] = useState();
  const [monthlyAvgStepsData, setMonthlyAvgStepsData] = useState();

  const [month3DateRangeForStartDate, setMonthly3DateRangeForStartDate] =
    useState();
  const [month3DateRangeForEndDate, setMonthly3DateRangeForEndDate] =
    useState();
  const [monthOf3AvgData, setMonthOf3AvgData] = useState();
  console.log('neeraj ====', props.route.params);
  const {
    on3MonthStepsDataArr,
    googleMonthlyStepsData,
    google3MonthOfStepsData,
    dateForGraph,
    avgSteps,
    monthSteps,
    monthOf3AvgSteps,
    fromLeaderboard,
    steps,
    weekAvgData,
    weekStepsDate,
  } = props?.route?.params;

  let mediaPath = settings.cdnUrl.url;
  // const weeklyDate = props?.route?.params?.weekStepsDate?.map(step =>
  //   moment(step.startDate).format('DD/MM'),
  // );

  useEffect(() => {
    getLeaderBoardData();
    // dispatch(getProfileAction());
    let monthlyDate = dateForGraph;
    let dateIndex = [];

    for (var i = monthlyDate?.length - 1; i >= 0; i--) {
      dateIndex.unshift(monthlyDate[i]);
    }

    var startDateForMonthIOs = moment(dateIndex[0]?.startDate).format('ll');
    if (startDateForMonthIOs)
      setMonthlyDateRangeForStartDate(
        moment().subtract(30, 'days').startOf('day').format('ll'),
      );

    var endDayOfMonthIOs = moment(
      dateIndex[dateIndex?.length - 1]?.startDate,
    ).format('ll');
    if (endDayOfMonthIOs) setMonthlyDateRangeForEndDate(endDayOfMonthIOs);
  }, [navigation]);

  function getLeaderBoardData() {
    usersService.getLeaderBoardData().then(res => {
      console.log("response of leader board",res)
      if (res?.data?.statusCode === 1) {
        setLeaderBoardData(res?.data?.responseData?.result);
      }
    });
  }

  useEffect(() => {
    var arrOf3Month = [];
    var arrOf3MonthDate = [];
    // var i = on3MonthStepsDataArr??.length - 1;

    // while (i >= 0) {
    //   arrOf3Month.unshift(on3MonthStepsDataArr[i]);

    //   i--;
    // }
    // var j = on3MonthStepsDataArr??.length - 1;
    // while (j >= 0) {
    //   arrOf3MonthDate.unshift(on3MonthStepsDataArr[j]);
    //   // arrOf3Month.unshift(on3MonthStepsDataArr[i]);

    //   j--;
    // }

    // for (var i = 0; i <= on3MonthStepsDataArr??.length - 1; i++) {
    //     arrOf3Month.push(on3MonthStepsDataArr[i]);

    // }
    // for (var j = 0; j <= on3MonthStepsDataArr??.length - 1; j++) {
    //   if (moment().diff(moment(on3MonthStepsDataArr[j].startDate), 'days')) {
    //     arrOf3MonthDate.push(on3MonthStepsDataArr[j]);
    //   }
    // }
    if (on3MonthStepsDataArr?.length && Platform.OS != 'android') {
      barData = [];
      on3MonthStepsDataArr.map(item =>
        barData.push({
          value: item?.value,
          date: moment(item.startDate).format('DD/MM'),
          frontColor: fill,
        }),
      );
      calculateThreeMonthsDate(on3MonthStepsDataArr);
      setSteps3MonthData(barData);
    }
  }, []);

  useEffect(() => {
    getWeekData();
    calculateOneMonthData();
    calculateThreeMonthStepsData();
  }, []);

  const getWeekData = () => {
    barData = [];
    weekStepsDate.map(item => {
      barData.push({
        value: Platform.OS == 'ios' ? item?.value : item?.steps,
        label: fetchDay(new Date(item.startDate).getDay()),
        frontColor: fill,
        date: moment(item.startDate).format('DD/MM'),
      });
    });
    setWeekBarData(barData);
    barData = [];
  };

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
  const getBarSpacing = () => {
    if (currentButtonSelected == 'threeMonth') {
      if (steps3MonthData?.length <= 20) {
        return scale(10.5);
      } else if (steps3MonthData?.length <= 30) {
        return scale(9);
      } else {
        return scale(4);
      }
    } else if (currentButtonSelected == 'oneMonth') {
      if (monthlyStepsData?.length <= 20) {
        return scale(19);
      } else if (monthlyStepsData?.length <= 30) {
        return scale(8.5);
      } else {
        return scale(6);
      }
    } else if (currentButtonSelected == 'week') {
      if (weekBarData?.length === 1) {
        return scale(35);
      } else if (weekBarData?.length === 2) {
        return scale(65);
      } else if (weekBarData?.length === 3) {
        return scale(80);
      } else if (weekBarData?.length === 4) {
        return scale(59);
      } else if (weekBarData?.length === 5) {
        return scale(41);
      } else if (weekBarData?.length === 6) {
        return scale(32);
      } else if (weekBarData?.length === 7) {
        return scale(26.5);
      } else {
        return scale(25);
      }
    }
  };

  const getBarWidth = () => {
    if (currentButtonSelected == 'threeMonth') {
      if (steps3MonthData?.length <= 20) {
        return scale(10);
      } else if (steps3MonthData?.length <= 25) {
        return scale(7);
      } else if (steps3MonthData?.length <= 30) {
        return scale(4);
      } else {
        return scale(3);
      }
    } else if (currentButtonSelected == 'oneMonth') {
      if (monthlyStepsData?.length <= 20) {
        return scale(15);
      } else if (monthlyStepsData?.length <= 25) {
        return scale(7);
      } else if (monthlyStepsData?.length <= 30) {
        return scale(4);
      } else {
        return scale(3);
      }
    } else if (currentButtonSelected == 'week') {
      if (weekBarData?.length === 1) {
        return scale(37);
      } else if (weekBarData?.length === 2) {
        return scale(35);
      } else if (weekBarData?.length === 3) {
        return scale(30);
      } else if (weekBarData?.length === 4) {
        return scale(18);
      } else if (weekBarData?.length === 5) {
        return scale(16);
      } else if (weekBarData?.length === 6) {
        return scale(14);
      } else if (weekBarData?.length === 7) {
        return scale(12);
      } else {
        return scale(10);
      }
    }
  };

  const calculateOneMonthData = () => {
    if (Platform.OS == 'android') {
      var googleWeeklyStepsSum = 0,
        sum = 0;
      var googleBarMonthlySteps = [];
      let gStepData = googleMonthlyStepsData[2]?.steps?.map(step => step.value);

      googleMonthlyStepsData[2]?.steps?.map(item => {
        sum = sum + item?.value;

        googleBarMonthlySteps.push({
          value: item?.value,
          date: moment(item.date).format('DD/MM'),
          frontColor: fill,
        });
      });

      setMonthlyAvgStepsData(Math.round(sum / 30));
      setMonthlyStepsData(googleBarMonthlySteps);
      calculateOneMonthDate(googleMonthlyStepsData[2]?.steps);
      let googleStepsDate = googleMonthlyStepsData[2]?.rawSteps?.map(
        step => step,
      );
      let zeroIndexStep = gStepData?.length;
      for (var i = 0; i < gStepData?.length; i++) {
        googleWeeklyStepsSum += parseInt(gStepData[i] / zeroIndexStep);
      }
      let dateIndex = [];
      for (var i = 0; i < googleStepsDate?.length; i++) {
        dateIndex.push(googleStepsDate[i]);

        // i = i + 5;
      }
      if (
        dateIndex[0]?.startDate < dateIndex[dateIndex?.length - 1]?.startDate
      ) {
        let date = dateIndex?.map(sleep =>
          moment(sleep.startDate).format('DD/MM'),
        );

        // setMonthlyDate(date);
      }
      // if (googleWeeklyStepsSum) setMonthlyAvgStepsData(googleWeeklyStepsSum);
      var startDateForMonth = moment()
        .subtract(30, 'days')
        .startOf('day')
        .format('ll');
      if (startDateForMonth) setMonthlyDateRangeForStartDate(startDateForMonth);
      var endDayOfMonth = moment(
        dateIndex[dateIndex?.length - 1]?.startDate,
      ).format('ll');
      if (endDayOfMonth) setMonthlyDateRangeForEndDate(moment().format('ll'));
    } else {
      setMonthlyAvgStepsData(avgSteps);
      let dateIndexMonthly = [];

      if (monthSteps?.length > 8) {
        for (var i = monthSteps?.length - 1; i >= 0; i--) {
          dateIndexMonthly.unshift(monthSteps[i]);

          // i = i + 3;
        }
      } else {
        dateIndexMonthly = monthSteps;
      }
      let monthlyBarData = [];

      dateIndexMonthly.map(item =>
        monthlyBarData.push({
          value: item?.value,
          date: moment(item.startDate).format('DD/MM'),
          frontColor: fill,
        }),
      );
      setMonthlyStepsData(monthlyBarData);
      calculateOneMonthDate(monthSteps);
    }
  };

  const calculateThreeMonthStepsData = () => {
    // for 3 months steps data
    if (Platform.OS == 'android') {
      var totalSumOf3Month = 0;
      var googleBar3MonthlySteps = [];

      google3MonthOfStepsData[2]?.steps?.map(item => {
        totalSumOf3Month = totalSumOf3Month + item.value;
        googleBar3MonthlySteps.push({
          value: item?.value,
          date: moment(item.date).format('DD/MM'),
          frontColor: fill,
        });
      });
      calculateThreeMonthsDate(google3MonthOfStepsData[2]?.steps);
      if (totalSumOf3Month) setMonthOf3AvgData(totalSumOf3Month / 90);
      setSteps3MonthData(googleBar3MonthlySteps);
      let arr3Month = [];

      var startDateFor3Month = moment()
        .subtract(90, 'days')
        .startOf('day')
        .format('ll');
      if (startDateFor3Month)
        setMonthly3DateRangeForStartDate(startDateFor3Month);
      var endDayOf3Month = moment(arr3Month[arr3Month?.length - 1]?.date).format(
        'll',
      );
      if (endDayOf3Month) setMonthly3DateRangeForEndDate(moment().format('ll'));
    } else {
      setMonthOf3AvgData(monthOf3AvgSteps);
      var startDateFor3MonthIOs = moment(
        on3MonthStepsDataArr[0]?.startDate,
      ).format('ll');
      if (startDateFor3MonthIOs)
        setMonthly3DateRangeForStartDate(
          moment().subtract(90, 'days').startOf('day').format('ll'),
        );
      var endDayOf3MonthIOs = moment(
        on3MonthStepsDataArr[on3MonthStepsDataArr?.length - 1]?.startDate,
      ).format('ll');
      if (endDayOf3MonthIOs)
        setMonthly3DateRangeForEndDate(moment().format('ll'));
    }
  };

  const calculateOneMonthDate = list => {
    updated1MonthBarData = [];
    if (list?.length) {
      index1 = 0;
      let incementBy = 0;
      if (list?.length < 7) {
        incementBy = 1;
      } else if (list?.length < 15) {
        incementBy = 4;
      } else if (list?.length < 30) {
        incementBy = 7;
      } else {
        incementBy = 13;
      }
      while (index1 <= list?.length - 1) {
        updated1MonthBarData.push({
          value: moment(
            Platform.OS == 'android'
              ? list[index1].date
              : list[index1].startDate,
          ).format('MM/DD'),
        });

        index1 = index1 + incementBy;
      }

      updated1MonthBarData.push({
        value: moment(
          Platform.OS == 'android'
            ? list[list?.length - 1].date
            : list[list?.length - 1].startDate,
        ).format('MM/DD'),
      });
      updated1MonthBarData = updated1MonthBarData.filter(
        (v, i, a) => a.findIndex(v2 => v2.value === v.value) === i,
      );

      setOneMonthBarDate(updated1MonthBarData);
    }
    updated1MonthBarData = [];
  };

  const calculateThreeMonthsDate = list => {
    updated3MonthBarData = [];
    if (list?.length) {
      index1 = 0;
      let incementBy = 0;
      if (list?.length < 7) {
        incementBy = 1;
      } else if (list?.length < 15) {
        incementBy = 4;
      } else if (list?.length < 30) {
        incementBy = 7;
      } else {
        incementBy = 13;
      }

      while (index1 <= list?.length - 1) {
        updated3MonthBarData.push({
          value: moment(
            Platform.OS == 'android'
              ? list[index1].date
              : list[index1].startDate,
          ).format('MM/DD'),
        });

        index1 = index1 + incementBy;
      }

      updated3MonthBarData.push({
        value: moment(
          Platform.OS == 'android'
            ? list[list?.length - 1].date
            : list[list?.length - 1].startDate,
        ).format('MM/DD'),
      });
      updated3MonthBarData = updated3MonthBarData.filter(
        (v, i, a) => a.findIndex(v2 => v2.value === v.value) === i,
      );

      setThreeMonthsBarDate(updated3MonthBarData);
    }
  };

  let onTouch = e => {
    setTooltip(true);
    let xAxisValue = e.pageX;
    setXaxis(xAxisValue);
    let yAxisValue = e.pageY;
    setYaxis(yAxisValue);
  };

  let labelConfig = {
    fontSize: 10,
    color: COLORS.grey_2,
    fontFamily: 'Manrope-Semibold',
  };

  const changeMemershipModal = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access this feature, please upgrade your account',
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

  const renderLeaderBoardData = (item, index) => {
    return (
      <View style={styles.leaderboardTableBodyContainer}>
        <View style={styles.leaderboardPositionContainer}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.leaderboardPositionGradientStyle}
            colors={[COLORS.lightGreen, COLORS.lightBlue]}>
            <Text style={styles.leaderboardPositionTextStyle}>{index + 1}</Text>
          </LinearGradient>
        </View>
        <View style={styles.leaderboardProfileNameTextStyle}>
          <Image
            resizeMode={'cover'}
            source={
              item?.userId?.profileImage
                ? {
                    uri: mediaPath + item?.userId?.profileImage,
                  }
                : require('../../../assets/Avatar.png')
            }
            style={styles.leaderboardProfileImageStyle}
          />
          <Text style={[styles.leaderboardTableBodyTextStyle]}>
            {item?.userId?.fname}
          </Text>
        </View>
        <Text style={[styles.leaderboardTableBodyTextStyle, {width: '20%'}]}>
          {Math.ceil(item.steps)}
        </Text>
      </View>
    );
  };

  const onStepUpdate = () => {
    console.log("props?.getProfileData?.planName ",props?.getProfileData?.planName )
    if (props?.getProfileData?.planName == 'Premium' || props?.getProfileData?.planName == 'Standard') {
      setModalVisible(true);
    } else {
      changeMemershipModal();
    }
  };

  const getInitialSpacing = () => {
    if (currentButtonSelected == 'week') {
      if (weekBarData?.length === 1) {
        return scale((DeviceScreen.width - 160) / 2);
      } else if (weekBarData?.length === 2) {
        return scale((DeviceScreen.width - 200) / 3);
      } else if (weekBarData?.length === 3) {
        return scale(15);
      } else {
        return scale(16);
      }
    } else {
      return scale(16);
    }
  };

  const renderBarDates = () => {
    return currentButtonSelected == 'oneMonth' ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: DeviceScreen.width - 80,
          alignSelf: 'center',
        }}>
        {oneMonthBarDate.map(item => {
          return <Text style={{fontSize: 10}}>{item.value}</Text>;
        })}
      </View>
    ) : currentButtonSelected == 'threeMonth' ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: DeviceScreen.width - 80,
          alignSelf: 'center',
        }}>
        {threeMonthsBarDate.map(item => {
          return <Text style={{fontSize: 10}}>{item.value}</Text>;
        })}
      </View>
    ) : null;
  };

  const onTimePeriodChangeButtonPressed = data => {
    switch (data) {
      case 1:
        setCurrentButtonSelected('week');
        break;
      case 2:
        setCurrentButtonSelected('oneMonth');
        break;
      case 3:
        setCurrentButtonSelected('threeMonth');
        break;
    }
  };

  const onBarPress = (event,item) => {
     setSelectedBarData({
      barDatavalue: item?.value,
      pageX: event?.nativeEvent?.pageX,
      pageY: event?.nativeEvent?.pageY,
      date: item?.date,
    });


  };

  

  // let data = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];
  console.log("response of leader board step",steps)
  const dataItem=[ {value:50}, {value:80}, {value:90}, {value:70}, ]

  return (
    <MainScreen>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          fromLeaderboard == true
            ?scrollViewRef!=null && scrollViewRef.current &&  scrollViewRef?.current?.scrollToEnd({animated: true})
            : null
        }>
        <ModifyStepsTargetModal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          setModalVisible={setModalVisible}
        />
        <View style={styles.goal}>
          <Text style={styles.title}>Your goal</Text>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={onStepUpdate}>
            <View style={{padding: 6}}>
              <PenIcon width={18} height={18} color={'#6839ef'} />
            </View>
            <Text style={styles.stepsCount}>
              {props?.getProfileData?.stepsGoal || 0}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goal}>
          <Text style={styles.title}>Total today</Text>
          <Text style={styles.stepsCount}>{steps || 0}</Text>
        </View>
        <View style={styles.avgSteps}>
          <View>
            <Text style={styles.title}>Average Steps</Text>
            <Text style={styles.weekDate}>
              {currentButtonSelected == 'threeMonth'
                ? month3DateRangeForStartDate +
                  ' - ' +
                  month3DateRangeForEndDate
                : currentButtonSelected == 'oneMonth'
                ? monthDateRangeForStartDate + ' - ' + monthDateRangeForEndDate
                : moment().subtract(7, 'days').startOf('day').format('ll') +
                  ' - ' +
                  moment().format('ll')}
            </Text>
          </View>
          <Text style={styles.stepsCount}>
            {currentButtonSelected == 'threeMonth'
              ? isNaN(monthOf3AvgData)
                ? 0
                : Math.floor(monthOf3AvgData)
              : currentButtonSelected == 'oneMonth'
              ? isNaN(monthlyAvgStepsData)
                ? 0
                : Math.floor(monthlyAvgStepsData)
              : currentButtonSelected == 'week' && isNaN(weekAvgData)
              ? 0
              : Math.floor(weekAvgData)}
          </Text>
        </View>

        <View style={{padding: 10}}>
          <View
            style={{
              backgroundColor: COLORS.grey_6,
              paddingBottom: 20,
              overflow: 'hidden',
            }}>
            <View>
              <BarChart
                ref={eventViewRef}
                showFractionalValue
                showYAxisIndices
                width={DeviceScreen.width - 80}
                noOfSections={4}
                data={
                  currentButtonSelected == 'threeMonth'
                    ? steps3MonthData || []
                    : currentButtonSelected == 'oneMonth'
                    ? monthlyStepsData || []
                    : weekBarData || []
                }
                barWidth={getBarWidth()}
                labelWidth={30}
                initialSpacing={getInitialSpacing()}
                xAxisLabelTextStyle={labelConfig}
                onPress={onBarPress}
                disableScroll={true}
                yAxisColor={COLORS.grey_6}
                hideYAxisText
                spacing={getBarSpacing()}
                xAxisColor={COLORS.grey_4}
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
            onPress={() => onTimePeriodChangeButtonPressed(1)}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  currentButtonSelected == 'week' ? '#6839ef' : COLORS.black,
                fontFamily: 'Manrope-Semibold',
              }}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              currentButtonSelected == 'oneMonth'
                ? styles.activeBtn
                : styles.inActiveBtn
            }
            onPress={() => onTimePeriodChangeButtonPressed(2)}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  currentButtonSelected == 'oneMonth'
                    ? '#6839ef'
                    : COLORS.black,
                fontFamily: 'Manrope-Semibold',
              }}>
              1 Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              currentButtonSelected == 'threeMonth'
                ? styles.activeBtn
                : styles.inActiveBtn
            }
            onPress={() => onTimePeriodChangeButtonPressed(3)}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  currentButtonSelected == 'threeMonth'
                    ? '#6839ef'
                    : COLORS.black,
                fontFamily: 'Manrope-Semibold',
              }}>
              3 Month
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gapBetweenContainers}>
          <View style={{backgroundColor: COLORS.inputTxtColor}}>
            <Text
              style={{padding: 10, fontFamily: 'Manrope-Bold', fontSize: 15}}>
              Today's Steps leaderboard
            </Text>
          </View>
          {/* <CollapsableContainer title={'Steps leaderboard'}> */}
          <View style={{backgroundColor: COLORS.inputTxtColor}}>
            <View style={{paddingBottom: 10}}>
              <View style={styles.leaderboardTableHeaderContainer}>
                <Text
                  style={[
                    styles.leaderboardTableHeaderTextStyle,
                    {width: '15%', paddingLeft: '5%'},
                  ]}>
                  №
                </Text>
                <Text
                  style={[
                    styles.leaderboardTableHeaderTextStyle,
                    {width: '45%', textAlign: 'left'},
                  ]}>
                  Name
                </Text>

                <Text
                  style={[
                    styles.leaderboardTableHeaderTextStyle,
                    {width: '20%'},
                  ]}>
                  Count
                </Text>
              </View>
              {leaderBoardData?.length === 0 ? null : (
                <>
                  {leaderBoardData?.map((item, index) => {
                    return (props?.getProfileData?.planName == 'Free' ) &&
                      index <= 2
                      ? renderLeaderBoardData(item, index)
                      : (props?.getProfileData?.planName != 'Free') &&
                          renderLeaderBoardData(item, index);
                  })}
                </>
              )}

              {console.log('data of leaderBoardData', leaderBoardData)}
              <View style={{borderTopWidth: 2, borderColor: 'white'}}>
                {(props?.getProfileData?.planName == 'Free' ) &&
                leaderBoardData?.length > 3 ? (
                  <TouchableOpacity onPress={() => changeMemershipModal()}>
                    <Text style={styles.fullLeaderBoardTitleStyle}>
                      Open the whole leaderboard
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {selectedBarData.barDatavalue ? (
        <BarDataSelectedModal
          onClose={() => setSelectedBarData({barDatavalue: 0})}
          selectedBarData={selectedBarData}
          goal={props?.getProfileData?.stepsGoal}
          type={'steps'}
        />
      ) : (
        <View />
      )}
    </MainScreen>
  );
});

const mapStateToProps = state => {
  return {
    getProfileData:
      state?.profileReducer?.profile?.data?.responseData?.userProfile,
  };
};
export default connect(mapStateToProps)(StepScreen);

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
  leaderboardTableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  leaderboardTableBodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  leaderboardProfileImageStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  fullLeaderBoardTitleStyle: {
    fontSize: 15,
    color: COLORS.lightBlue,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  leaderboardPositionContainer: {
    width: '15%',
    justifyContent: 'center',
  },
  leaderboardPositionGradientStyle: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  leaderboardPositionTextStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboardProfileNameTextStyle: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainerStyle: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
  },
  cardImageStyle: {
    width: 180,
    height: 150,
    borderRadius: 5,
  },
  cardTitleTextStyle: {
    color: COLORS.blue,
    fontFamily: 'Manrope',
    fontSize: 14,
    marginTop: 5,
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
  leaderboardTableBodyTextStyle: {
    textAlign: 'center',
    color: COLORS.grey_2,
    fontFamily: 'Manrope',
    fontSize: 15,
    alignSelf: 'center',
  },
  leaderboardTableHeaderTextStyle: {
    fontSize: 13,
    color: COLORS.grey_4,
    textAlign: 'center',
  },
});

StepScreen.defaultProps = {
  avgSteps: 0,
  google3MonthOfStepsData: [],
  googleMonthlyStepsData: [],
  monthOf3AvgSteps: 0,
  monthSteps: [],
  on3MonthStepsDataArr: [],
  steps: [],
  weekAvgData: [],
  weekStepsDate: [],
  weeklyValue: [],
};
