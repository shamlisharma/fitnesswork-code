import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  AppState,
} from 'react-native';

import {InfoIcon} from '../../../Svg';
import {COLORS} from '../../../common/Constant';
import {MainScreen} from '../../../common/Screen';
import GradientContainer from '../../../components/GradientContainer';
import Timer from '../../../components/Timer';
import {CloseFoodIcon, PauseIcon, PlayIcon, VideoPlayIcon} from '../../../Svg';
import ExerciseDetailRow from './ExerciseDetailRow';
// import Video from 'react-native-video';
import Video from 'react-native-video';
import {useNavigation, useRoute} from '@react-navigation/native';
import settings from '../../../config/settings';
import {useDispatch, useSelector} from 'react-redux';
import {workoutProgrammeActionTypes} from '../../../_action/WorkoutAction';
import {usersService} from '../../../services/ApiServices';
import GradientButton from '../../../components/GradientButton';
import AlertModal from '../../modal/AlertModal';

let cdnPath = settings.cdnUrl.url;

const ExerciseCard = React.memo(props => {
  const {
    item,
    currentlyPlayingVideoId,
    onInfoButtonPressed,
    viewFrom,
    getCurrentlyPlayingVideoId,
    startWorkoutStatus,
    navigationPath,
  } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [playVideo, setPlayVideo] = useState(false);
  const [isVideoPaused, setVideoPaused] = useState(false);

  useEffect(() => {
    if (item._id == currentlyPlayingVideoId) {
      setPlayVideo(true);
    } else {
      setPlayVideo(false);
    }
  }, [currentlyPlayingVideoId]);

  useEffect(() => {
    const unsubscribe = navigationPath?.addListener('focus', () => {
      console.log('AppState of hit excercise video', 123);
      _handleAppStateChange();
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const unsubscribe = navigationPath?.addListener('blur', () => {
      // do something
      console.log('Exercise card blur');
      setVideoPaused(true);
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: workoutProgrammeActionTypes.RESET_WORKOUT_DURATION,
            });
            navigation.goBack();
          }}>
          <CloseFoodIcon color={COLORS.grey_3} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const _handleAppStateChange = () => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('AppState of hit excercise video', nextAppState);
      //alert("omg")
      switch (nextAppState) {
        case 'active':
          console.log('active state in exercise acrd 33');
        case 'background':
          setVideoPaused(true);
        case 'inactive':
          setVideoPaused(true);
      }
    });

    return () => {
      subscription.remove();
    };
  };

  const onEndVideo = () => {
    // setPlayVideo(false);
    // props.setWorkoutStatus(2)
  };
  console.log('isVideoPaused of video player', isVideoPaused);
  return (
    <View>
      {item?.exerciseVideo === '' && item?.link?.url === null ? null : (
        <View style={{paddingHorizontal: 15, marginVertical: 15}}>
          {/* {playVideo  ( */}
          <>
            <View
              style={[
                styles.videoStyle,
                {
                  backgroundColor: '#D3D3D3',
                  // position: 'absolute',
                  // left: 10,
                },
              ]}>
              {!viewFrom ? (
                <Image
                  source={{uri: cdnPath + item.thumbImage}}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                />
              ) : (
                <Video
                  source={{
                    uri: cdnPath + item?.exerciseVideo,
                  }}
                  
                  // source={
                  //   item?.exerciseVideo != ''
                  //     ? {
                  //         uri:  item?.exerciseVideo,
                  //       }
                  //     : {uri: item?.link?.url}
                  // }
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  volume={10}
                  controls={playVideo}
                  paused={!playVideo || isVideoPaused}
                  resizeMode={'stretch'}
                  ignoreSilentSwitch={'ignore'}

                  // disableFocus
                ></Video>
              )}
              {!playVideo && (
                <TouchableOpacity
                  style={styles.transparentContainerView}
                  activeOpacity={1}
                  onPress={() => {
                    if (viewFrom) {
                      setVideoPaused(false);
                      getCurrentlyPlayingVideoId(item._id);
                    }
                  }}>
                  {viewFrom && <PlayIcon />}
                </TouchableOpacity>
              )}
            </View>
          </>
        </View>
      )}
      <View
        style={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontFamily: 'Manrope-Semibold'}}>{item?.title}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onInfoButtonPressed}>
          <InfoIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ExerciseCard;

const styles = StyleSheet.create({
  startButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    height: 100,
  },
  startTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 20,
    color: COLORS.lightGreen,
    textTransform: 'uppercase',
    marginHorizontal: 10,
  },

  tableColumnTitleTextStyle: {
    fontFamily: 'Manrope-Regular',
    color: COLORS.grey_4,
    fontSize: 13,
    lineHeight: 15,
    flex: 1,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  inputBoxStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    borderColor: COLORS.grey_4,
    color: COLORS.grey_2,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
  },
  inputBoxContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  contentContainer: {
    backgroundColor: COLORS.light_grey,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  submitButtonTextStyle: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: COLORS.lightGreen,
    lineHeight: 20,
    textAlign: 'center',
  },
  submitButtonViewStyle: {
    margin: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 35,
  },
  separatorOne: {
    flexDirection: 'row',
    width: '30%',
  },
  separatorTwo: {
    flexDirection: 'row',
    width: '70%',
  },
  submitButtonStyle: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  submitButtonGradientStyle: {
    borderRadius: 30,
  },
  videoStyle: {
    width: '100%',
    alignSelf: 'center',
    height: Dimensions.get('window').height * 0.3125,
    // borderTopLeftRadius: 5,
    // borderTopRightRadius: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },

  transparentContainerView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
