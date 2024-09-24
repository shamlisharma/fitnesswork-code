import React, {useEffect, useReducer, useRef, useState} from 'react';
import {View, TouchableOpacity, Text, Platform, AppState} from 'react-native';
import AppleHealthKit, {HealthKitPermissions,HealthValue,} from 'react-native-health';
import moment from 'moment';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {saveActivityAction} from '../../_action/FitnessAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appleHealthWorkout} from '../../_action/WorkoutAction';
import {result} from 'lodash';
const PERMS = AppleHealthKit.Constants.Permissions;

const StatsData = props => {
  let dispatch = useDispatch();
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData,
  );
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      steps: 0,
      googleDailyStep: 0,
      googleSteps: 0,
      googleSleep: 0,
      googleCal: 0,
      sleep: 0,
      workout: 0,
      calories: 0,
      sleepDuration: 0,
      setSteps: 0,
      setSleep: 0,
      setWorkout: 0,
      setCalories: 0,
      setWorkoutByGFit: 0,
      inithealthdata: true,
    },
  );

  const [googleAuth, setGoogleAuth] = useState();

  // permission for apple health
  let options = {
    permissions: {
      read: [
        PERMS.StepCount,
        PERMS.Steps,
        PERMS.SleepAnalysis,
        PERMS.Workout,
        PERMS.ActiveEnergyBurned,
      ],
    },
  };
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;  
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    if (Platform.OS != 'android') {
      getAppleHealthData();
      if (userInput.setSteps !== 0) saveActivityInfoForDaily();
    } else {
      if (googleAuth == 'Authorization cancelled') {
      } else {
        getGoogleHealthData();
        if (userInput.googleDailyStep !== 0) saveActivityInfoForDaily();
      }
    }
  }, [
    userInput.googleSteps,
    userInput.setSteps,
    props.refreshing,
    userInput.steps,
    props.isFocused,
    userInput.googleDailyStep,
    userInput.googleStepsData,
    // userInput.weeklySteps
  ]);

  useEffect(() => {
    saveSteps();
  }, [userInput.googleSteps]);

  const saveSteps = async () => {
    let {steps, sleepDuration, workout, calories} = userInput;
    const token = await AsyncStorage.getItem('accessToken');
    axios.defaults.headers.common.AccessToken = token;
    if (steps) {
      setUserInput({setSteps: steps});
    }
    if (sleepDuration) {
      setUserInput({setSleep: sleepDuration});
    }
  };
  // Apple health
  function getAppleHealthData() {
    // initialization for apple health
    var sum = 0;
    var calSum = 0;

    var start1 = new Date(moment().subtract(2, 'days').startOf('day').format());
    var start1 = {
      date: start1.toISOString(),
    };

    var start2 = new Date(moment().subtract(1, 'days').startOf('day').format());
    var start2 = {
      date: start2.toISOString(),
    };

    var start3 = new Date(moment().startOf('day').format());
    var start3 = {
      date: start3.toISOString(),
    };
    const date = new Date();

    var firstDayPrevMonth = new Date(
      moment().subtract(30, 'days').startOf('day').format(),
    );

    var sleepFirstDayPrevMonth = moment()
      .subtract(30, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepFirstDayPrevMonth.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    var lastDayPrevMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    var prev3MonthofStartDate = new Date(
      moment().subtract(90, 'days').startOf('day').format(),
    );

    var sleepPrev3MonthofStartDate = moment()
      .subtract(90, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepPrev3MonthofStartDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    // var prevMonday = moment().day("Monday").format('YYYY-MM-DD');

    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

    var startDateOfWeek = moment()
      .subtract(moment().diff(prevMonday, 'days'), 'days')
      .startOf('day')
      .toISOString();

    // if((new Date()).getDay() === 1) {
    //   startDateOfWeek = new Date(moment().subtract(0, 'days').startOf('day').format());
    // }

    var endDateOfWeek = moment().toISOString();

    var sleepStartDateOfWeek = moment()
      .subtract(moment().diff(prevMonday, 'days'), 'days')
      .startOf('day')
      .utcOffset(0);
    sleepStartDateOfWeek.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    sleepStartDateOfWeek = sleepStartDateOfWeek.toISOString();

    var d = new Date();
    d.setMonth(d.getMonth() - 3);

    var start9 = {
      date: firstDayPrevMonth.toISOString(),
    };

    var current = new Date(); // get current date
    var weekstart = current.getDate() - current.getDay();
    var weekend = weekstart + 6; // end day is the first day + 6
    var monday = new Date(current.setDate(weekstart));
    var sunday = new Date(current.setDate(weekend));

    var d = new Date();
    d.setDate(d.getDate() - 5);
    var recentSevenDayStartDate = moment()
      .subtract(7, 'days')
      .startOf('day')
      .toISOString();

    var sleepRecentSevenDayStartDate = moment()
      .subtract(7, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepRecentSevenDayStartDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    var recentSevenDayEndDate = moment().toISOString();
    var sleepRecentOneDayStartDate = moment()
      .subtract(0, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepRecentOneDayStartDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    let recentSevenDaysStepOption = {
      startDate: recentSevenDayStartDate,
      endDate: recentSevenDayEndDate,
      period: 1440,
      limit: 10,
      unit: 'Step(s)',
      includeManuallyAdded: true,
    };

    let recentSevenDaysSleepOption = {
      startDate: sleepRecentSevenDayStartDate.toISOString(),
      endDate: new Date().toISOString(),
      // limit: 10, // optional; default no limit
      ascending: true,
      // includeManuallyAdded: true,
    };

    let recentOneDaysSleepOption = {
      startDate: sleepRecentOneDayStartDate.toISOString(),
      endDate: new Date().toISOString(),
      // limit: 10, // optional; default no limit
      ascending: true,
      // includeManuallyAdded: true,
    };

    // console.log('week start====',weekstart)
    //     console.log("week from here",monday,sunday);
    let prev3MonthsDate = {
      startDate: prev3MonthofStartDate.toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      ascending: false,
      period: 1440,
      unit: 'Step(s)',
      includeManuallyAdded: true,
    };
    let prev3MonthsSleepDate = {
      startDate: sleepPrev3MonthofStartDate.toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      ascending: true,
    };
    let optionsDate = {
      startDate: firstDayPrevMonth.toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      ascending: false,
      period: 1440,
      unit: 'Step(s)',
      includeManuallyAdded: true,
    };
    let sleepOptionsDate = {
      startDate: sleepFirstDayPrevMonth.toISOString(), // required
      endDate: new Date().toISOString(),
      ascending: true,
    };
    let monthlyDate = {
      startDate: firstDayPrevMonth.toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      ascending: false,
      period: 1440,
      unit: 'Step(s)',
      includeManuallyAdded: true,
    };

    let monthlyStepOptions = {
      startDate: firstDayPrevMonth.toISOString(),
      endDate: lastDayPrevMonth.toISOString(),
    };

    // console.log('monday startday coming-===',monday.toISOString);
    // console.log('startdday of week====',endDateOfWeek);
    let stepOption = {
      startDate: startDateOfWeek,
      endDate: endDateOfWeek,
      period: 1440,
      limit: 10,
      unit: 'Step(s)',
      includeManuallyAdded: true,
    };
    let sleepOption = {
      startDate: sleepStartDateOfWeek,
      endDate: endDateOfWeek,
    };

    let workoutSample = {
      startDate: startDateOfWeek,
      endDate: endDateOfWeek,
      type: 'Workout', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
    };

    let energyOptions = {
      startDate: startDateOfWeek,
      endDate: new Date().toISOString(),
    };
    console.log("getProfileData =>>>>",{getProfileData});
    // get data from apple health
    getProfileData&&getProfileData?.userProfile.planName !== 'Free' && AppleHealthKit.initHealthKit(options, (err, results) => {
      console.log({results,err});
      if (err) {
        setUserInput({inithealthdata: false});
        return;
      }

      // getDailyStepCountSamples method call here for weekly data

      AppleHealthKit.getDailyStepCountSamples(stepOption, (err, results) => {
        if (err) {
          // console.log('errorrrStep', err);
        } else {
          const resData = results?.map((step, index) => {
            return step.value;
          });
          const stepArrValue = results?.reverse().map(step => step.value);
          sum = 0;
          for (var i = 0; i < resData.length; i++) {
            sum += parseInt(resData[i]);
          }

          let devidedBy;

          if (new Date().getDay() === 0) {
            devidedBy = 7;
          } else {
            devidedBy = new Date().getDay();
          }
          props.setUserInput({
            weeklySteps: Math.round(sum / devidedBy),
            stepsWeeklyArr: stepArrValue,
            stepsWeeklyDate: results,
          });
          setUserInput({steps: sum});
          if (userInput.steps !== 0) {
            saveActivityInfo();
          }
        }
      });

      AppleHealthKit.getDailyStepCountSamples(
        recentSevenDaysStepOption,
        (err, results) => {
          if (err) {
            // console.log('errorrrStep', err);
          } else {
            const today = new Date();
            const first = today.getDate() - today.getDay() + 1;
            const last = today.getDate() - today.getDay() + 7;
            const resData = results?.map((step, index) => {
              return step.value;
            });
            sum = 0;
            const stepArrValue = results?.reverse().map(step => step.value);
            for (var i = 0; i < resData.length; i++) {
              sum += parseInt(resData[i]);
            }
            props.setUserInput({
              recentWeeklySteps: Math.round(sum / 7),
              recentStepsWeeklyArr: stepArrValue,
              recentStepsWeeklyDate: results,
            });
            setUserInput({recentSteps: sum});
            // if (userInput.recentSteps !== 0) {
            //   saveActivityInfo();
            // }
          }
        },
      );

      // 3month of data
      AppleHealthKit.getDailyStepCountSamples(
        prev3MonthsDate,
        (err, results) => {
          if (err) {
            console.log('errorrrStep', err);
          } else {
            const resData = results?.map(step => step.value);
            const stepArrValue = results?.reverse().map(step => step.value);
            sum = 0;
            for (var i = 0; i < resData.length; i++) {
              sum += parseInt(resData[i]);
            }
            props.setUserInput({
              avg3MonthofSteps: Math.round(sum / 90),
              pre3monthOfStepsData: results,
            });
          }
        },
      );
      AppleHealthKit.getDailyStepCountSamples(optionsDate, (err, results) => {
        if (err) {
          console.log('errorrrStep', err);
        } else {
          const resData = results?.map(step => step.value);
          sum = 0;
          for (var i = 0; i < resData.length; i++) {
            sum += parseInt(resData[i]);
          }
          props.setUserInput({
            monthlyAvgSteps: Math.round(sum / 30),
          });
        }
      });
      // for monthly steps data with limit
      AppleHealthKit.getDailyStepCountSamples(monthlyDate, (err, results) => {
        if (err) {
          console.log('errorrrStep', err);
        } else {
          const resData = results.reverse()?.map(step => step.value);
          const date = results?.map(step =>
            moment(step.startDate).format('DD/MM'),
          );
          props.setUserInput({monthlySteps: results});
          props.setUserInput({graphStepsDate: results});
        }
      });

      // daily step count
      AppleHealthKit.getStepCount(start3, (err, results) => {
        if (err) {
          console.log('errorrrdaily', err);
        } else {
          props.setUserInput({dailyStepsData: Math.round(results?.value)});
          props.setUserInput({
            dailySteps: Math.round(results?.value),
            stepsData: Math.round(results?.value),
          });
          setUserInput({setSteps: Math.round(results?.value)});
          if (userInput.setSteps !== 0) saveActivityInfoForDaily();
        }
      });

      // getSleepSamples method call here
      AppleHealthKit.getSleepSamples(sleepOption, (err, results) => {
        // console.log('steps from health', err);
        // console.log('sleep option coming neeraj-====', sleepOption);
        // console.log('results coming neeraj====', results);
        let thisWeekMonday = moment().startOf('isoweek').format('YYYY-MM-DD');
        results = results.filter(
          item =>
            moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
              moment(thisWeekMonday).format('YYYY-MM-DD'),
            ) ||
            moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
              moment(thisWeekMonday).format('YYYY-MM-DD'),
            ),
        );
        // console.log('sleepStartDateOfWeek=,',   moment().startOf('isoweek').format('YYYY-MM-DD'));
        let totalSleepDuration = 0;
        var duration = 0;
        if (err) {
          console.log('err sleep', err);
        } else {
          if (results.length !== 0) {
            // results.map(item => {
            totalSleepDuration += parseFloat(
              moment
                .duration(
                  moment(results[0].endDate).diff(moment(results[0].startDate)),
                )
                .asMinutes()
                .toFixed(1),
            );
            var startTime = moment(results[0].startDate);
            var endTime = moment(results[0].endDate);

            // calculate total duration
            duration = moment.duration(endTime.diff(startTime));
            // });
            setUserInput({sleepDuration: totalSleepDuration});
            props.setUserInput({
              weeklySleepData: results,
            });
          } else {
            setUserInput({sleepDuration: 0});
          }
        }
      });

      AppleHealthKit.getSleepSamples(
        recentOneDaysSleepOption,
        (err, results) => {
          // console.log('steps from health recent one day', result);
          let totalSleepDuration = 0,
            index = 0;
          var duration = 0;
          if (err) {
            console.log('err sleep', err);
          } else {
            // console.log('recentOneDaysSleepOption====',recentOneDaysSleepOption);
            if (results.length !== 0) {
              // console.log('results coming before',results);
              results = results.filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    t =>
                      t.startDate === value.startDate &&
                      t.endDate === value.endDate,
                  ),
              );

              results = results.filter(item =>
                moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                  moment().format('YYYY-MM-DD'),
                ),
              );
              // console.log('results coming after',results);
              while (index <= results.length - 1) {
                totalSleepDuration += parseFloat(
                  moment
                    .duration(
                      moment(results[index].endDate).diff(
                        moment(results[index].startDate),
                      ),
                    )
                    .asMinutes()
                    .toFixed(2),
                );
                index++;
              }
              // console.log('totalSleepDuration coming after',totalSleepDuration);
              props.setUserInput({
                sleepData: totalSleepDuration,
              });
            }
          }
        },
      );

      // last 7 days sleep sample
      AppleHealthKit.getSleepSamples(
        recentSevenDaysSleepOption,
        (err, results) => {
          let totalSleepDuration = 0;
          // console.log('sleep data recennt seven days', results);
          if (err) {
            console.log('err sleep', err);
          } else {
            results = results.filter(
              item =>
                moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                  moment()
                    .subtract(7, 'days')
                    .startOf('day')
                    .format('YYYY-MM-DD'),
                ) ||
                moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                  moment()
                    .subtract(7, 'days')
                    .startOf('day')
                    .format('YYYY-MM-DD'),
                ),
            );
            // console.log('result 7 days after-----',results);
            if (results.length !== 0) {
              // results = results.filter(item => moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(moment('').format('YYYY-MM-DD')));
              props.setUserInput({
                recentSevenDaysSleepData: results,
              });
            } else {
              setUserInput({sleepDuration: 0});
            }
          }
        },
      );

      // monthly sleep sample
      AppleHealthKit.getSleepSamples(sleepOptionsDate, (err, results) => {
        let totalSleepDuration = 0;
        // console.log('results 1 month before====', results);
        if (err) {
          console.log('err sleep', err);
        } else {
          // console.log('results 1 month before====',results)
          results = results.filter(
            item =>
              moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                moment()
                  .subtract(30, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ) ||
              moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                moment()
                  .subtract(30, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ),
          );
          // console.log('results 1 month after====',results)
          if (results.length !== 0) {
            props.setUserInput({
              monthlySleepData: results,
            });
          } else {
            setUserInput({sleepDuration: 0});
          }
        }
      });

      // prev3MonthsDate sleep data
      AppleHealthKit.getSleepSamples(prev3MonthsSleepDate, (err, results) => {
        // console.log('sleep prevous 3 month', results);
        let totalSleepDuration = 0;
        if (err) {
          console.log('err sleep', err);
        } else {
          // console.log('results 3 months before =',results);
          results = results.filter(
            item =>
              moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                moment()
                  .subtract(90, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ) ||
              moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                moment()
                  .subtract(90, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ),
          );
          // console.log('results 3 months after =',results);
          if (results.length !== 0) {
            props.setUserInput({
              prev3MonthOfSleepData: results,
            });
          } else {
            setUserInput({sleepDuration: 0});
          }
        }
      });
      // Active energy burned
      AppleHealthKit.getActiveEnergyBurned(energyOptions, (err, results) => {
        if (err) {
          console.log('error', err);
        } else {
          const calData = results?.map(cal => cal.value);
          for (var i = 0; i < calData.length; i++) {
            calSum += parseInt(calData[i]);
          }

          setUserInput({calories: calSum});
          props.setUserInput({caloriesData: calSum});
        }
      });

      // getSamples call here for workout
      AppleHealthKit.getSamples(workoutSample, (err, results) => {
        let totalWorkoutDuration = 0;
        if (err) {
          console.log('errer of workout data', err);
        } else {
          if (results.length !== 0) {
            results.map(item => {
              totalWorkoutDuration += parseFloat(
                moment
                  .duration(moment(item.end).diff(moment(item.start)))
                  .asHours()
                  .toFixed(1),
              );
            });
            setUserInput({setWorkout: totalWorkoutDuration});
            props.setUserInput({workoutData: results?.length});
            dispatch(appleHealthWorkout(results?.length));
          } else {
            setUserInput({setWorkout: 0});
          }
        }
      });
    });
  }

  // google health data

  function getGoogleHealthData() {
    var current = new Date(); // get current date
    var weekstart = current.getDate() - current.getDay() + 1;
    var weekend = weekstart + 6; // end day is the first day + 6
    // var startDateOfWeek = moment().startOf('week');
    // var endDateOfWeek = moment().endOf('week');
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

    var stepStartDateOfWeek = moment()
      .subtract(moment().diff(prevMonday, 'days'), 'days')
      .startOf('day')
      .utcOffset(0);
    var sleepStartDateOfWeek = moment()
      .subtract(moment().diff(prevMonday, 'days'), 'days')
      .startOf('day')
      .utcOffset(0);
    sleepStartDateOfWeek.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    // if((new Date()).getDay() === 1) {
    //   startDateOfWeek = new Date(moment().subtract(0, 'days').startOf('day').format());
    // }
    stepStartDateOfWeek = stepStartDateOfWeek.toISOString();

    sleepStartDateOfWeek = sleepStartDateOfWeek.toISOString();

    var endDateOfWeek = moment().toISOString();

    var recentSevenDayStartDate = moment()
      .subtract(7, 'days')
      .startOf('day')
      .toISOString();
    var sleepRecentSevenDayStartDate = moment()
      .subtract(7, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepRecentSevenDayStartDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    sleepRecentSevenDayStartDate = sleepRecentSevenDayStartDate.toISOString();
    var recentSevenDayEndDate = moment().toISOString();

    var sleepRecentThirtyDaysDate = moment()
      .subtract(30, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepRecentThirtyDaysDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    sleepRecentThirtyDaysDate = sleepRecentThirtyDaysDate.toISOString();

    var sleepRecentNintyDaysDate = moment()
      .subtract(90, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepRecentNintyDaysDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    sleepRecentNintyDaysDate = sleepRecentNintyDaysDate.toISOString();
    var sleepRecentOneDayStartDate = moment()
      .subtract(0, 'days')
      .startOf('day')
      .utcOffset(0);
    sleepRecentOneDayStartDate.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    var firstDayPrevMonth = new Date(
      moment().subtract(30, 'days').startOf('day').format(),
    );
    let monthlyDate = {
      startDate: firstDayPrevMonth.toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 0,
    };
    let sleep1MonthlyOption = {
      startDate: sleepRecentThirtyDaysDate, // required
      endDate: endDateOfWeek, // optional; default now
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 0,
    };
    // var startDateOfWeek = new Date(current.setDate(weekstart));
    // var endDateOfWeek = new Date(current.setDate(weekend));
    var googleWeeklyStepsSum = 0;
    var googleWeeklyCalSum = 0;
    var start3 = new Date(moment().startOf('day').format());
    var start3 = {
      date: start3.toISOString(),
    };
    let stepOption = {
      startDate: stepStartDateOfWeek,
      endDate: endDateOfWeek,
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1,
    };
    let workoutActivityOption = {
      startDate: stepStartDateOfWeek,
      endDate: endDateOfWeek,
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 15,
    };
    // console.log('step option comingg===',stepOption);

    let recentSevenDaysStepOption = {
      startDate: recentSevenDayStartDate,
      endDate: recentSevenDayEndDate,
      period: 1440,
      limit: 10,
      unit: 'Step(s)',
      includeManuallyAdded: true,
    };

    let sleepRecentOneDayOption = {
      startDate: sleepRecentOneDayStartDate, // required
      endDate: new Date().toISOString(), // optional; default now
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 0,
    };

    let activityOption = {
      startDate: stepStartDateOfWeek,
      endDate: endDateOfWeek,
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1,
    };

    var day1 = new Date(moment().subtract(1, 'days').startOf('day').format());

    const dailySleep = {
      startDate: sleepStartDateOfWeek,
      endDate: endDateOfWeek,
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 0,
    };

    const opt = {
      startDate: stepStartDateOfWeek, // required
      endDate: endDateOfWeek, // required
      basalCalculation: true,
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1,
    };
    const gSleepOption = {
      startDate: sleepRecentSevenDayStartDate,
      endDate: recentSevenDayEndDate, // required
    };

    var prev3MonthofStartDate = new Date(
      moment().subtract(90, 'days').startOf('day').format(),
    );

    let prev3MonthsDate = {
      startDate: prev3MonthofStartDate.toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1,
    };

    let sleepPrev3MonthDate = {
      startDate: sleepRecentNintyDaysDate, // required
      endDate: new Date().toISOString(), // optional; default now
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1,
    };

    const googleFitFunctions = () => {
      GoogleFit.getDailySteps(stepOption)
        .then(result => {
          // console.log('steps data===', result);
          props.setUserInput({
            googleDailyStep: Math.round(result[2]?.steps[0]?.value),
          });
          setUserInput({
            googleDailyStep: Math.round(result[2]?.steps[0]?.value),
          });
          if (userInput.googleDailyStep !== 0) saveActivityInfoForDaily();
        })
        .catch(err => {
          console.log(err);
        });

      GoogleFit.getDailyStepCountSamples(recentSevenDaysStepOption)
        .then(results => {
          const resData = results[2].rawSteps?.map((step, index) => {
            //  console.log(index,'step.value neerajkalra====',step)
            return step.steps;
          });
          let sum = 0;
          const stepArrValue = results[2].rawSteps
            ?.reverse()
            .map(step => step.steps);
          for (var i = 0; i < resData.length; i++) {
            sum += parseInt(resData[i]);
          }

          props.setUserInput({
            recentWeeklySteps: Math.round(sum / 7),
            recentStepsWeeklyArr: stepArrValue,
            recentStepsWeeklyDate: results[2].rawSteps.reverse(),
          });
        })
        .catch(err => {
          alert(err.message);
          console.log(err);
        });
      // get weekly steps
      GoogleFit.getDailyStepCountSamples(stepOption)
        .then(res => {
          let sum = 0;
          const gStepData = res[2]?.rawSteps?.map(step => step.steps);
          const googleStepsDate = res[2]?.rawSteps?.map(step => step.startDate);
          const zeroIndexStep = gStepData.length;
          for (var i = 0; i < gStepData.length; i++) {
            googleWeeklyStepsSum += parseInt(gStepData[i] - zeroIndexStep);
          }
          sum = 0;
          for (var i = 0; i < gStepData.length; i++) {
            sum += parseInt(gStepData[i]);
          }

          let devidedBy;
          if (new Date().getDay() === 0) {
            devidedBy = 7;
          } else {
            devidedBy = new Date().getDay();
          }

          props.setUserInput({
            googleStepsData: Math.round(sum / devidedBy),
            googleStepsWeekData: gStepData,
            googleWeeklyStepsDate: googleStepsDate,
          });
          setUserInput({googleSteps: googleWeeklyStepsSum});
          if (userInput.googleSteps !== 0) {
            saveActivityInfo();
          }
        })
        .catch(err => {
          console.log('steps errror@@@@@@@@@@', err);
        });

      GoogleFit.getSleepSamples(sleepRecentOneDayOption)
        .then(res => {
          res = res.filter(item =>
            moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
              moment().format('YYYY-MM-DD'),
            ),
          );
          let totalSleepDurationByGoogleFit = 0;
          res = res.filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                t =>
                  t.startDate === value.startDate &&
                  t.endDate === value.endDate,
              ),
          );
          res.map(item => {
            totalSleepDurationByGoogleFit += parseInt(
              moment
                .duration(moment(item.endDate).diff(moment(item.startDate)))
                .asMinutes(),
            );
            var startTime = moment(item.startDate);
            var endTime = moment(item.endDate);

            // calculate total duration
            duration = moment.duration(endTime.diff(startTime));
          });

          // console.log('res one day google sleep data===', res);
          // console.log('totalSleepDurationByGoogleFit===',totalSleepDurationByGoogleFit)

          props.setUserInput({
            sleepData: totalSleepDurationByGoogleFit.toFixed(2),
          });
        })
        .catch(err => {});

      GoogleFit.getActivitySamples(workoutActivityOption)
        .then(results => {
          let totalWorkoutDuration = 0;
          if (results.length !== 0) {
            results.map(item => {
              totalWorkoutDuration += parseFloat(
                moment
                  .duration(moment(item.end).diff(moment(item.start)))
                  .asHours()
                  .toFixed(1),
              );
            });
            setUserInput({setWorkout: totalWorkoutDuration});
            props.setUserInput({workoutData: results?.length});
          }
        })
        .catch(err => {
          console.log('steps neeraj errror@@@@@@@@@@', err);
        });

      // monthly steps
      GoogleFit.getDailyStepCountSamples(monthlyDate)
        .then(res => {
          props.setUserInput({
            googleMonthlyStepsData: res,
          });
        })
        .catch(err => {});
      // for 3 month steps
      GoogleFit.getDailyStepCountSamples(prev3MonthsDate)
        .then(res => {
          props.setUserInput({
            google3MonthOfStepsData: res,
          });
        })

        .catch(err => {});

      // daily sleep sample
      GoogleFit.getSleepSamples(dailySleep)
        .then(res => {
          let thisWeekMonday = moment().startOf('isoweek').format('YYYY-MM-DD');
          res = res.filter(
            item =>
              moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                moment(thisWeekMonday).format('YYYY-MM-DD'),
              ) ||
              moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                moment(thisWeekMonday).format('YYYY-MM-DD'),
              ),
          );

          // alert('c')
          let duration = 0;
          let totalSleepDurationByGoogleFit = 0;
          res.map(item => {
            totalSleepDurationByGoogleFit += parseInt(
              moment
                .duration(moment(item.endDate).diff(moment(item.startDate)))
                .asMinutes(),
            );
            var startTime = moment(item.startDate);
            var endTime = moment(item.endDate);

            // calculate total duration
            duration = moment.duration(endTime.diff(startTime));
          });
          let devidedBy;

          if (new Date().getDay() == 0) {
            devidedBy = 7;
          } else {
            devidedBy = new Date().getDay();
          }

          props.setUserInput({
            googleSleepData: totalSleepDurationByGoogleFit / devidedBy,
          });
        })
        .catch(err => {});

      GoogleFit.getSleepSamples(gSleepOption)
        .then(res => {
          let totalSleepDurationByGoogleFit = 0;
          res = res.filter(
            item =>
              moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                moment()
                  .subtract(7, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ) ||
              moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                moment()
                  .subtract(7, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ),
          );
          res.map(item => {
            totalSleepDurationByGoogleFit += parseInt(
              moment
                .duration(moment(item.endDate).diff(moment(item.startDate)))
                .asMinutes(),
            );
          });
          var gSleep = totalSleepDurationByGoogleFit;
          props.setUserInput({googleWeeklySleepData: res});
          setUserInput({googleSleep: gSleep});
          if (userInput.googleSleep !== 0 && userInput.googleDailyStep !== 0)
            saveActivityInfoForDaily();
        })
        .catch(err => {});

      // monthly sleep data
      GoogleFit.getSleepSamples(sleep1MonthlyOption)
        .then(res => {
          res = res.filter(
            item =>
              moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                moment()
                  .subtract(30, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ) ||
              moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                moment()
                  .subtract(30, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ),
          );
          props.setUserInput({googleMonthlySleepData: res});
        })
        .catch(err => {
          console.log('gggSleep', err);
        });

      // 3 month sleep data

      GoogleFit.getSleepSamples(sleepPrev3MonthDate)
        .then(res => {
          res = res.filter(
            item =>
              moment(moment(item.endDate).format('YYYY-MM-DD')).isSame(
                moment()
                  .subtract(90, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ) ||
              moment(moment(item.endDate).format('YYYY-MM-DD')).isAfter(
                moment()
                  .subtract(90, 'days')
                  .startOf('day')
                  .format('YYYY-MM-DD'),
              ),
          );
          props.setUserInput({google3MonthSleepData: res});
        })
        .catch(err => {
          console.log('gggSleep', err);
        });
    };

    GoogleFit.checkIsAuthorized().then(() => {
      if (!GoogleFit.isAuthorized) {
        const options = {
          scopes: [
            Scopes.FITNESS_ACTIVITY_READ,
            Scopes.FITNESS_BODY_READ,
            Scopes.FITNESS_LOCATION_READ,
            Scopes.FITNESS_SLEEP_READ,
          ],
        };

        GoogleFit.authorize(options)
          .then(authResult => {
            // console.log('google fit respinse', authResult);
            if (authResult.success) {
              googleFitFunctions();
            } else {
              console.error(authResult.message);
              setGoogleAuth(authResult.message);
            }
          })
          .catch(() => {
            dispatch('AUTH_ERROR');
          });
      } else {
        googleFitFunctions();
      }
    });
  }

  // save Activity action
  function saveActivityInfo() {
    let req = {
      deviceId: Platform.OS == 'ios' ? 3 : 2,
      day: 7,
      steps: Platform.OS == 'ios' ? userInput.steps : userInput.googleSteps,
      sleep:
        Platform.OS == 'ios' ? userInput.sleepDuration : userInput.googleSleep,
    };
    dispatch(saveActivityAction(req))
      .then(res => {
        if (res.data.statusCode === 1) {
        } else {
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  function saveActivityInfoForDaily() {
    let req = {
      deviceId: Platform.OS == 'ios' ? 3 : 2,
      day: 1,
      steps:
        Platform.OS == 'ios' ? userInput.setSteps : userInput.googleDailyStep,
    };
    dispatch(saveActivityAction(req))
      .then(res => {
        if (res.data.statusCode === 1) {
        } else {
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  return <View></View>;
};

export const Stats = StatsData;
