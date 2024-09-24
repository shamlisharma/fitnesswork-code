import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {COLORS} from '../../common/Constant';
import Header from '../../components/header/Header';
import {useDispatch} from 'react-redux';
import {notificationAction} from '../../_action/Notification';
import {usersService} from '../../services/ApiServices';
import {MainScreen} from '../../common/Screen';

const NOTIFICATION_DATA = [
  {
    id: 0,
    title: 'All notifications',
    desc: 'All types of notifications will turn on',
  },
  {
    id: 1,
    title: 'Daily Tips',
    desc: 'Practical and motivational tips to help you achieve your goal',
  },
  {
    id: 2,
    title: 'Steps',
    desc: 'Get reminders to stay active',
  },
  {
    id: 3,
    title: 'Workouts',
    desc: 'Get reminders to train and also when your friends have trained',
  },
  {
    id: 4,
    title: 'Check in reminder',
    desc: 'Log and track your progress',
  },
  {
    id: 5,
    title: 'Community',
    desc: 'Get reminders to check your weekly performance score',
  },
];

let NotificationScreen = React.memo(function NotificationScreen() {
  const [toggle0, setToggle0] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(false);
  const [toggle5, setToggle5] = useState(true);

  useEffect(() => {
    getNotification();
  }, []);

  useEffect(() => {
    if (toggle1 && toggle2 && toggle3 && toggle4 && toggle5) {
      setToggle0(true);
    } else {
      setToggle0(false);
    }
  });

  const handleAllNotificationToggle = value => {
    let params = {
      dailyTips: value ? 1 : 0,
      steps: value ? 1 : 0,
      workouts: value ? 1 : 0,
      checkInReminder: value ? 1 : 0,
      habits: value ? 1 : 0,
      friends: 0,
    };
    setToggle0(value);
    setToggle1(value);
    setToggle2(value);
    setToggle3(value);
    setToggle4(value);
    setToggle5(value);
    postNotification(params);
  };

  const handleDailyTipsToggle = value => {
    let params = {
      dailyTips: value ? 1 : 0,
      steps: toggle2 ? 1 : 0,
      workouts: toggle3 ? 1 : 0,
      checkInReminder: toggle4 ? 1 : 0,
      habits: toggle5 ? 1 : 0,
      friends: 0,
    };
    setToggle1(value);
    postNotification(params);
  };

  const handleStepsToggle = value => {
    let params = {
      dailyTips: toggle1 ? 1 : 0,
      steps: value ? 1 : 0,
      workouts: toggle3 ? 1 : 0,
      checkInReminder: toggle4 ? 1 : 0,
      habits: toggle5 ? 1 : 0,
      friends: 0,
    };
    setToggle2(value);
    postNotification(params);
  };

  const handleWorkoutsToggle = value => {
    let params = {
      dailyTips: toggle1 ? 1 : 0,
      steps: toggle2 ? 1 : 0,
      workouts: value ? 1 : 0,
      checkInReminder: toggle4 ? 1 : 0,
      habits: toggle5 ? 1 : 0,
      friends: 0,
    };
    setToggle3(value);
    postNotification(params);
  };

  const handleCheckInReminderToggle = value => {
    let params = {
      dailyTips: toggle1 ? 1 : 0,
      steps: toggle2 ? 1 : 0,
      workouts: toggle3 ? 1 : 0,
      checkInReminder: value ? 1 : 0,
      habits: toggle5 ? 1 : 0,
      friends: 0,
    };
    setToggle4(value);
    postNotification(params);
  };

  const handleHabitsToggle = value => {
    let params = {
      dailyTips: toggle1 ? 1 : 0,
      steps: toggle2 ? 1 : 0,
      workouts: toggle3 ? 1 : 0,
      checkInReminder: toggle4 ? 1 : 0,
      habits: value ? 1 : 0,
      friends: 0,
    };
    setToggle5(value);
    postNotification(params);
  };

  const postNotification = async params => {
    dispatch(notificationAction(params))
      .then(res => {})
      .catch(() => {
        alert('network error');
      });
  };

  const getNotification = async () => {
    try {
      const res = await usersService.getNotification();
      if (res?.data?.statusCode === 1) {
        const result = res?.data?.responseData?.result;
        setToggle1(result.dailyTips ? true : false);
        setToggle2(result.steps ? true : false);
        setToggle3(result.workouts ? true : false);
        setToggle4(result.checkInReminder ? true : false);
        setToggle5(result.habits ? true : false);
      }
    } catch (e) {
      console.error('error ', e);
    }
  };

  const SwitchComponent = props => {
    const {title, description, onValueChange, value, style} = props;
    return (
      <View style={[styles.componentContainer, style]}>
        <View style={{width: '80%'}}>
          <Text style={styles.tipsTitle}>{title}</Text>
          <Text style={styles.tipsDesc}>{description}</Text>
        </View>
        <Switch
          onValueChange={onValueChange}
          trackColor={{true: COLORS.lightGreen, false: COLORS.grey_6}}
          ios_backgroundColor={COLORS.grey_6}
          value={value}
        />
      </View>
    );
  };
console.log('notification data coming neeeraj====',NOTIFICATION_DATA);
  const dispatch = useDispatch();
  return (
    <MainScreen>
      <Header 
        title="Notifications" 
        status="drawer" 
      />
      <SwitchComponent
        title={NOTIFICATION_DATA[0].title}
        description={NOTIFICATION_DATA[0].desc}
        value={toggle0}
        onValueChange={value => handleAllNotificationToggle(value)}
        style={{marginBottom: 30}}
      />
      <SwitchComponent
        title={NOTIFICATION_DATA[1].title}
        description={NOTIFICATION_DATA[1].desc}
        value={toggle1}
        onValueChange={value => {
          handleDailyTipsToggle(value);
        }}
      />
      <SwitchComponent
        title={NOTIFICATION_DATA[2].title}
        description={NOTIFICATION_DATA[2].desc}
        value={toggle2}
        onValueChange={value => {
          handleStepsToggle(value);
        }}
      />
      <SwitchComponent
        title={NOTIFICATION_DATA[3].title}
        description={NOTIFICATION_DATA[3].desc}
        value={toggle3}
        onValueChange={value => {
          handleWorkoutsToggle(value);
        }}
      />
      <SwitchComponent
        title={NOTIFICATION_DATA[4].title}
        description={NOTIFICATION_DATA[4].desc}
        value={toggle4}
        onValueChange={value => {
          handleCheckInReminderToggle(value);
        }}
      />
      <SwitchComponent
        title={NOTIFICATION_DATA[5].title}
        description={NOTIFICATION_DATA[5].desc}
        value={toggle5}
        onValueChange={value => {
          handleHabitsToggle(value);
        }}
      />
    </MainScreen>
  );
})
const styles = StyleSheet.create({
  tipsTitle: {
    color: COLORS.grey_2,
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    lineHeight: 20,
  },
  tipsDesc: {
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
  },
  componentContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default NotificationScreen;
