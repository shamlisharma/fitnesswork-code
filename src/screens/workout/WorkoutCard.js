import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';

import RNCalendarEvents from 'react-native-calendar-events';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';

import {COLORS} from '../../common/Constant';
import {AddCalenderIcon, CheckboxSelected, CheckboxUnselected} from '../../Svg';
import {storeData, getData} from '../../utils/storage';
import {useDispatch, useSelector} from 'react-redux';
import {usersService} from '../../services/ApiServices';
import {getWorkoutList} from '../../_action/WorkoutAction';
import DatePicker from 'react-native-date-picker';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import moment from 'moment';
import AlertModal from '../modal/AlertModal';
import { dayNamefromDay } from '../../utils/helper';

// function for generating weeks obj
const WEEKS = () => {
  let week = {};
  for (let i = 0; i <= 6; i++) {
    let currDate = new Date(new Date().setDate(new Date().getDate() + i));
    week[DAYS[currDate.getDay()]] = currDate;
  }
  return week;
};
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WorkoutCard = React.memo(props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [openCalender, setOpenCalender] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [completedDay, setCompletedDay] = useState(false)
  const [alertModalVisibility, setAlertModalVisibility] = useState(false);
  const [wId, setWid] = useState();
  const {loading, data, filterKey, favouriteKey, searchKey, filterData} =
    useSelector(state => state.workout.workoutList);
  const {
    day,
    title,
    description,
    _id,
    weekGoal,
    index,
    dayGoals,
    category,
    workoutPhase,
    phase,
    week,
    weekNo,
    status,
    time,
    workOut,
    weekLength,
    workData,
    workoutProgrammeHistory
  } = props;

  const generateLink = async () => {
    try {
      var link = await dynamicLinks().buildShortLink(
        {
          link: `https://fitnessvworkout.page.link/workout?id=${props?.workoutId},${props?.day}`,
          // domainUriPrefix is created in your Firebase console
          domainUriPrefix: 'https://fitnessvworkout.page.link',
          android: {
            packageName: 'com.funavry.fitnessvworkexpo',
            minimumVersion: '18',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'com.funavry.fitnessvworkexpo',
            minimumVersion: '18',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      return link;
    } catch (error) {
      console.log('error', error);
    }
  };
// alert(weekLength*weekGoal)
  const workoutScreen = async () => { 
    // console.log(workoutProgrammeHistory?.length,'ppppworkoutPhaseworkoutPhase',workoutProgrammeHistory?.length >= (weekLength*weekGoal));
      console.log({weekLength,weekGoal})
      // _checkCompletedDay()
      // return
      // alert((weekLength*weekGoal))
    
      // alert(workoutProgrammeHistory?.length+1 >= (weekLength*weekGoal))
    if (weekNo === week) {
      if (category === 1 ) {
        navigation.navigate('Push exercises', {
          // item: workData?.data?.responseData?.result[0],
          workoutId: props?.workoutId,
          title: title,
          fromDashboard: 'true',
          workoutPhase: weekNo,
          phase: week,
          currentWorkId: props?.curWorkId,
          curWeek: props?.week,
          day: day,
          category: category,
          selectedWeek:props?.selectedWeek,
          currentDay: props?.currentDay,
          completedDay,
          allCompleteWorkout: workoutProgrammeHistory?.length >= (weekLength*weekGoal)
        });
      } else if (category === 2) {
        navigation.navigate('Workout Hiit Title', {
          phase: phase,
          workoutId: props?.workoutId,
          title: title,
          fromDashboard: 'true',
          workoutPhase: workoutPhase,
          currentWorkId: props?.curWorkId,
          curWeek: props?.week,
          day: day,
          category,
          selectedWeek:props?.selectedWeek,
          currentDay: props?.currentDay,
          completedDay,
          allCompleteWorkout: workoutProgrammeHistory?.length >= (weekLength*weekGoal)
        });
      }
    }else{
      navigation.navigate('Push exercises', {
        // item: workData?.data?.responseData?.result[0],
        workoutId: props?.workoutId,
        title: title,
        fromDashboard: 'true',
        workoutPhase: weekNo,
        phase: week,
        currentWorkId: props?.curWorkId,
        curWeek: props?.week,
        day: day,
        category: 0,
        selectedWeek:props?.selectedWeek,
        currentDay: props?.currentDay,
        completedDay,
        allCompleteWorkout: workoutProgrammeHistory?.length >= (weekLength*weekGoal)
        
      });
      // alert("You can’t access this yet. Future Phase.")
    }
  };

  useEffect(() => {
    let params = {
      isFilter: 1,
      workoutId: props?.workoutId,
    };
    _checkCompletedDay()
    // dispatch(getWorkoutList(params));
  }, [navigation]);
const _checkCompletedDay=()=>{
  console.log({workoutProgrammeHistory});
  console.log("workData?.workoutId",workData);

 let res= workoutProgrammeHistory?.some(e => e.workoutId === workData?.workoutId&&e.workoutWeek===workData.weekNo)
 console.log({res});
 setCompletedDay(res)
}
console.log("workoutProgrammeHistory",workoutProgrammeHistory?.length,props);
  // store events Details in memory
  const storeEventIds = (res, status, id) => {
    if (status === 0) {
      storeData({[calDate]: [_id, id]});
    } else {
      storeData({...res, [calDate]: [_id, id]});
    }
  };

  var curr = new Date(); // get current date
  var first = curr.getDate(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6

  var firstday = new Date(curr.setDate(first)).toISOString();
  var lastday = new Date(curr.setDate(last)).toISOString();

  // create and add event to the calender
  const eventAdd = async (res, status, calId, dateClnder) => {
    const getLink = await generateLink();

    const ddd = new Date(dateClnder);
    // const newDate = new Date(dateClnder);
    // console.log('get link coming---',getLink);
    // console.log('ddd coming neeraj---',ddd.toISOString());
    // console.log('ddd coming---',ddd);

    let newDate = moment(dateClnder).add(time, 'minutes');

    // newDate.setMinutes(ddd.getMinutes() + time);

    RNCalendarEvents.saveEvent(
      title ? title.charAt(0).toUpperCase() + title.slice(1) : null,
      {
        calendarId: calId,
        startDate: dateClnder.toISOString(),
        endDate: newDate.toISOString(),
        allDay: false,
        location:
          getLink +
          '                                                             ' +
          description,
        alarms: [
          {
            date: dateClnder.toISOString(),
          },
        ],
      },
    )
      .then(id => {
        props.setEventAdded(true);
        storeEventIds(res, status, id);
      })
      .catch(() => {
        Alert.alert('Something went wrong', 'Can not add event', [
          {text: 'OK'},
        ]);
      });
  };

  // intiat add event
  const addEventToCalender = async date => {
    setCalDate(date);
    let permission = false;
    if (weekNo === week) {
      setOpenCalender(false);
      // check for permission
      RNCalendarEvents.checkPermissions()
        .then(res => {
          // console.log('Permission Value', res);
        })
        .catch(() => {
          Alert.alert('Please allow calender access via app setting', '', [
            {text: 'OK'},
          ]);
        });
      // ask for permission
      await RNCalendarEvents.requestPermissions()
        .then(res => {
          // console.log('Request permission', res);
          if (res === 'denied') permission = true;
        })
        .catch(err => {
          console.log('Permission request error ', err);
        });
      // handle permission in ios
      if (Platform.OS === 'ios' && permission) {
        Alert.alert('Please allow the calendar access.', '', [
          {text: 'OK', onPress: () => Linking.openSettings()},
        ]);
      }
      // get list of calendar and select primary one
      let calId;
      await RNCalendarEvents.findCalendars().then(res => {
        res.forEach(val => {
          if (val.isPrimary === 'true') {
            calId = val.id;
          }
        });
      });
      // add events
      if (!permission || Platform.OS === 'android') {
        // get local storage stored events
        getData().then(async res => {
          // check if storage response is undefined or empty then add initial event in store
          if (res === undefined || res == {}) {
            eventAdd(res, 0, calId, date);
          } else {
            let calEventIds = [];
            let weeksKeys = Object.keys(WEEKS());
            // get calender events
            await RNCalendarEvents.fetchAllEvents(
              firstday,
              lastday,
              calId,
            ).then(events => {
              events.forEach(item => {
                calEventIds.push(item.id);
              });
            });
            let eventKeys = Object.keys(res);
            // check if event alrady exist in local store
            if (eventKeys.includes(date)) {
              // check local store event has matched id and event id
              if (res[date][0] === _id && calEventIds.includes(res[date][1])) {
                Alert.alert('Workout already added in calender.', '', [
                  {text: 'OK'},
                ]);
              } else {
                eventAdd(res, 1, calId, date);
              }
            } else {
              eventAdd(res, 1, calId, date);
            }
          }
        });
      }
    }
  };
  const onOpenCalender = () => {
    if (weekNo == week) {
      setOpenCalender(true);
    } else {
      setAlertModalVisibility(true);
      // Alert.alert('you can only schedule from an active phase');
    }
  };

  return (
    <View>
      {title == 'Rest Day' ? (
        <TouchableOpacity
          disabled
          onPress={() => (title == 'Rest Day' ? null : workoutScreen())}>
          <View style={styles.container}>
            {
            // index < weekGoal &&
            // weekNo === week &&
            // title !== 'Rest Day' 
            completedDay? (
              <CheckboxSelected />
            ) : (
              <CheckboxUnselected />
            )}
            <View style={[styles.textContainer]}>
              <Text style={styles.titleTextStyle}>
               Day {props?.currentDay} - {title}  
              </Text>
              {/* <Text style={styles.titleTextStyle}>
                {dayNamefromDay(day)} - {title}  
              </Text> */}
            </View>
            <View></View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.workoutContainer}
            onPress={() => (title == 'Rest Day' ? null : workoutScreen())}>
            {
            // status == 1 && weekNo === week && title !== 'Rest Day' 
            completedDay? (
              <CheckboxSelected />
            ) : (
              <CheckboxUnselected />
            )}
            <View style={[styles.textContainer, {paddingLeft: 20}]}>
              <Text style={styles.titleTextStyle}>
              Day {props?.currentDay} - {title}  
              </Text>
              {/* <Text style={styles.titleTextStyle}>
              {dayNamefromDay(day)} - {title}
              </Text> */}

              <Text style={styles.descriptionTextStyle}>{description}</Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => onOpenCalender()}>
            <AddCalenderIcon />
          </TouchableOpacity> */}
          <DatePicker
            modal
            mode="datetime"
            open={openCalender}
            date={calDate}
            is24hourSource="locale"
            androidVariant="nativeAndroid"
            minimumDate={new Date()}
            onConfirm={date => {
              setOpenCalender(false);
              setCalDate(date);
              addEventToCalender(date);
            }}
            onCancel={() => {
              setOpenCalender(false);
            }}
          />
        </View>
      )}

      <AlertModal
        alert={alertModalVisibility}
        onResume={() => setAlertModalVisibility(false)}
        headertitle="Workout schedule"
        content={'you can only schedule from an active phase'}
        cancel={() => setAlertModalVisibility(false)}
        cancelBtn=""
        saveBtn="Ok"
        width={100}
        opacity={''}
      />
    </View>
  );
});

export default WorkoutCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  workoutContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  restContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#61a5862e',
  },

  textContainer: {
    flex: 0.85,
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  descriptionTextStyle: {
    fontFamily: 'Manrope-Light',
    fontSize: 14,
    color: COLORS.grey_3,
  },
});
