import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import convertToCache from 'react-native-video-cache';
import GradientContainer from '../../../components/GradientContainer';
import {COLORS, DeviceScreen} from '../../../common/Constant';
import {MainScreen} from '../../../common/Screen';
import settings from '../../../config/settings';
import {usersService} from '../../../services/ApiServices';
import {
  BackArrowIcon,
  PlayIcon,
  TipsIcon,
  RightHiitIcon,
  CommunityEyeIcon,
} from '../../../Svg';
import {getExcercisesByWorkoutId} from '../../../_action/WorkoutAction';
import {styles} from './WorkoutHiitStyle';
import Imageb from 'react-native-image-progress';

const windowWidth = Dimensions.get('window').width;

const WorkouthiitScreen = ({props, route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let mediaPath = settings.cdnUrl.url;
  const [totalExercise, setTotalExercise] = useState('');
  const phase = props?.route?.params?.phase;
  const workoutPhase = props?.route?.params?.workoutPhase;
  const [circuitExr, setCircuitExr] = useState([]);
  // const workoutByIdData = props?.route?.params?.workoutHitData;
  const {loading, data, error} = useSelector(
    state => state.workout.workoutData,
  );
  const [workoutByIdData, setWorkoutByIdData] = useState([]);

  useEffect(() => {
    let exLength = workoutByIdData?.circuit?.map(e => e.exercise.length);
    const sum = exLength?.reduce(add, 0);
    function add(accumulator, a) {
      return accumulator + a;
    }
    setTotalExercise(sum);
  }, [workoutByIdData]);

  const RepsFormater = item => {
    if (item?.perSide == null || item?.noOfReps == null) {
      return item?.time + ' ' + 'secs';
    } else if (item?.perSide) {
      return item?.noOfReps + ' ' + 'Reps (' + item?.perSide + ' per side)';
    } else {
      return item?.noOfReps + ' ' + 'Reps';
    }
  };

  useEffect(() => {
    if (workoutByIdData?.circuit) {
      let data = workoutByIdData?.circuit.map(item => item.exercise);
      setCircuitExr(data);
    }
  }, [workoutByIdData?.circuit]);

  const onHitExercise = (item, index) => {
    if (workoutPhase === phase)
      navigation.navigate('Hiit Exercise', {
        dataByid: item?.exercise,
        dataByCircuit: circuitExr,
        noOfSets: item,
        workoutId: route?.params?.workoutId,
        workoutByIdData: workoutByIdData?.circuit?.length,
        exer: totalExercise,
        ind: index,
        playKey: 'true',
        dashboard: route?.params?.fromDashboard,
      });
  };

  const onClickOfExercise = (item, items, index, i) => {
    if (workoutPhase === phase)
      navigation.navigate('Hiit Exercise', {
        dataByid: item?.exercise,
        dataByCircuit: circuitExr,
        dataBySets: items,
        noOfSets: item,
        workoutId: route?.params?.workoutId,
        workoutByIdData: workoutByIdData?.circuit?.length,
        exer: totalExercise,
        ind: index,
        indexValue: i,
        day: route?.params.day,
        category: route?.params?.category,
        currentWId: route?.params?.currentWorkId,
        curWeek: route?.params?.curWeek,
        phase: route?.params?.phase,
        dashboard: route?.params?.fromDashboard,
        playKey: 'false',
      });
  };
  // ,workoutByIdData?.circuit
  const onWorkoutHere = () => {
    // let modify =
    // console.log('modift===',modify);

    // console.log('bofy coning====',body);

    let circuitData = [...workoutByIdData.circuit];
    console.log('circuit data coming====', circuitData[0]?.exercise);
    // let index1 = 0, index2 = 0;

    // while(index1 <= circuitData.length - 1) {

    //     index2 = 0;

    //     while(index2 <= circuitData[index1].exercise.length -1) {
    //       let data = {};
    //       if(circuitData[index1].exercise[index2].exerciseVideo.includes(mediaPath)) {
    //         data = convertToCache(circuitData[index1].exercise[index2].exerciseVideo);
    //       }
    //       else {
    //         data =  convertToCache(mediaPath + circuitData[index1].exercise[index2].exerciseVideo);
    //       }

    //       // console.log('exercise video==', mediaPath + circuitData[index1].exercise[index2].exerciseVideo)
    //     //  console.log('neeraj data===',data);
    //       circuitData[index1].exercise[index2].exerciseVideo = data

    //       index2++;
    //     }

    //   index1++;
    // }

    let dataGoing = {
      dataByid: workoutByIdData.circuit[0]?.exercise,
      workoutId: route?.params?.workoutId,
      dataBySets: workoutByIdData.circuit[0],
      dataByCircuit: circuitExr,
      workoutByIdData: workoutByIdData.circuit?.length,
      exer: totalExercise,
      indexValue: 0,
      ind: 0,
      day: route?.params.day,
      category: route?.params?.category,
      currentWId: route?.params?.currentWorkId,
      curWeek: route?.params?.curWeek,
      phase: route?.params?.phase,
      viewFrom: true,
      dashboard: route?.params?.fromDashboard,
      restTimeData: workoutByIdData.circuit?.map(item => item.restTime),
      noOfRoundsData: workoutByIdData.circuit?.map(item => item.noOfRounds),
      workoutTitle: route?.params?.title,
    };

    console.log('data going====', dataGoing);

    navigation.navigate('Hiit Exercise', {
      dataByid: workoutByIdData.circuit[0]?.exercise,
      workoutId: route?.params?.workoutId,
      dataBySets: workoutByIdData.circuit[0],
      dataByCircuit: circuitExr,
      workoutByIdData: workoutByIdData.circuit?.length,
      exer: totalExercise,
      indexValue: 0,
      ind: 0,
      day: route?.params.day,
      category: route?.params?.category,
      currentWId: route?.params?.currentWorkId,
      curWeek: route?.params?.curWeek,
      phase: route?.params?.phase,
      viewFrom: true,
      dashboard: route?.params?.fromDashboard,
      restTimeData: workoutByIdData.circuit?.map(item => item.restTime),
      noOfRoundsData: workoutByIdData.circuit?.map(item => item.noOfRounds),
      workoutTitle: route?.params?.title,
      backgroundImage: mediaPath + workoutByIdData?.workoutImage,
    });
  };
  useEffect(async () => {
    await AsyncStorage.removeItem('wId');
    await AsyncStorage.removeItem('wDay');
    let params = {
      isFilter: 1,
      workoutId: route?.params?.workoutId,
    };
    dispatch(getExcercisesByWorkoutId(props?.route?.params?.workoutId));
    usersService.getWorkouts(params).then(res => {
      setWorkoutByIdData(res?.data?.responseData?.result[0]);
    });
  }, []);

  const renderListItem = ({item, index}) => {
    return (
      <>
        <View style={styles.listContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.titleTxt}>Circuit {index + 1}</Text>
          </View>
          <View style={{width: '50%', alignItems: 'flex-end'}}>
            <View
              onPress={() => onHitExercise(item, index)}
              activeOpacity={0.5}
              style={styles.flexDirection}>
              <Text style={styles.setTimeTxt}>
                {item?.exercise?.length} exercises {item?.time} min
              </Text>
              {/* <PlayIcon /> */}
            </View>
          </View>
        </View>
        {item?.exercise.map((items, i) => {
          return (
            <TouchableOpacity
              key={items.id}
              style={styles.circuitListContainer}
              onPress={() => onClickOfExercise(item, items, index, i)}>
              <View style={styles.CircuitImg}>
                <Image
                  style={{
                    transform: [{scale: 0.8}],
                    width: '100%',
                    height: '100%',
                  }}
                  // resizeMode={'contain'}
                  source={{uri: mediaPath + items.thumbImage}}
                  // style={{ height: 70, }}
                />
              </View>
              <View style={{flex: 0.7, marginLeft: 15}}>
                <Text style={styles.circuitTitletText}>{items?.title}</Text>
                <Text style={styles.circuitTitletText2}>
                  {RepsFormater(items)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const ListHeader = () => {
    return (
      <>
        <View style={styles.hiitCompleteItemView}>
          <View style={{flex: 7}}>
            <Text style={styles.itemTitle}>{'What will you need'}</Text>
          </View>
          <View style={{flex: 3, alignItems: 'flex-end'}}>
            <Text style={styles.itemTitle1}>
              {`${workoutByIdData?.equipments?.length} items`}
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {workoutByIdData?.equipments?.map((item, index) => {
              return (
                <View style={styles.hiitCompleteItemSubContainer}>
                  <View style={styles.hiitCompleteIImg}>
                    {/* <Image
                      source={{uri: mediaPath + item.equipmentImage}}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    /> */}
                    <Imageb
                      source={{uri: mediaPath + item.equipmentImage}}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                      indicator={
                        <ActivityIndicator
                          size={'large'}
                          color={COLORS.lightGreen}
                        />
                      }
                    />
                  </View>
                  <View style={styles.hiitCompleteTitle}>
                    <Text style={styles.itemText}>{item.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <MainScreen lightContent statusBarColor={'transparent'} translucent>
      {loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size={'large'} color={COLORS.lightGreen} />
        </View>
      ) : (
        <>
          <ImageBackground
            source={{uri: mediaPath + workoutByIdData?.workoutImage}}
            // source={require('../../../../assets/Excercise.png')}
            resizeMode={'stretch'}
            style={styles.imgContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.blackSheetOverlay} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  hitSlop={{top: 25, left: 25, right: 25, bottom: 25}}
                  onPress={() => navigation.goBack()}
                  style={[
                    {
                      borderColor: 'white',
                      // paddingVertical: 5,
                      zIndex: 4,
                      flex: 0.1,
                    },
                    styles.itemsInCenter,
                  ]}>
                  <BackArrowIcon color={'white'} />
                </TouchableOpacity>
                <View style={[{flex: 0.8}]}>
                  <Text
                    style={[
                      styles.headerTextStyle,
                      {textTransform: 'capitalize'},
                    ]}>
                    {route?.params?.title}
                  </Text>
                </View>
                <View style={[{flex: 0.1}, styles.itemsInCenter]}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('WorkoutTips')}>
                    <TipsIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.excercsieContainer}>
              <View style={styles.blackSheetOverlay} />
              <Text style={styles.excerciseDetailStyle}>
                {workoutByIdData?.circuit?.length == undefined
                  ? null
                  : workoutByIdData?.circuit?.length + ' ' + 'circuits'}
              </Text>

              <Text style={styles.excerciseDetailStyle}>
                {`Est. Time: ${Math.ceil(
                  workoutByIdData?.time ? workoutByIdData?.time : null,
                )} min`}
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.subContainer}>
            {/* <HiitComplete /> */}
            <FlatList
              data={workoutByIdData?.circuit}
              keyExtractor={item => item.id}
              bounces={false}
              ListHeaderComponent={
                workoutByIdData?.equipments?.length && ListHeader
              }
              renderItem={renderListItem}
              contentContainerStyle={{
                paddingHorizontal: 12,
              }}
              ListFooterComponent={() => {
                return (
                  <View
                    style={{marginBottom: Platform.OS == 'android' ? 40 : 70}}
                  />
                );
              }}
            />
          </View>
        </>
      )}
      {!loading && workoutByIdData?.circuit ? (
        <TouchableOpacity
          onPress={() => onWorkoutHere()}
          style={styles.startWorkoutButtonView}>
          <GradientContainer
            disabled={false}
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.startButtonTitleLabel}>Start Workout</Text>
          </GradientContainer>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </MainScreen>
  );
};

export default WorkouthiitScreen;
