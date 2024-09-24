import React, {useEffect, useState, useRef} from 'react';
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../common/Constant';
import {useNavigation} from '@react-navigation/native';
import setting from '../../config/settings';
import moment from 'moment';
// import Video from 'react-native-video';
import Video from 'react-native-video';
import {Loader} from '../../common/Loader';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import VideoModal from './VideoModal';
import {VideoPlayIcon} from '../../Svg';
import {scale} from 'react-native-size-matters';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let Learn = React.memo(function Learn(props) {
  const navigation = useNavigation();
  const {
    learnData,
    index,
    currentVideoPlayId,
    getCurrentlyPlayingVideoId,
    isPause,
    firstItemId,
  } = props;
  let cdnPath = setting.cdnUrl.url;
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );

  const [paused, setPaused] = useState(isPause);
  const [isVideoLoad, setVideoLoader] = useState(false);
  const [defaultState, setDefaultState] = useState(false);

  useEffect(() => {
    if (currentVideoPlayId == learnData._id) {
     // setPaused(false);

      // alert('rashello');
    } else {
      setPaused(true);
    }
  }, [currentVideoPlayId]);

  const videoPlayer = useRef(null);

  // useEffect(() => {
  //   navigation.addListener('blur', route => {
  //     setPaused(true);
  //   });
  //   navigation.addListener('focus', route => {
  //     setPaused(false);
  //   });
  // }, [navigation]);

  useEffect(() => {
    console.log('learn screen called again', isPause);
    //setPaused(isPause);
    //setDefaultState(true);
  }, [navigation]);

  const checkVideoAccesibility = () => {
    console.log("checkVideoAccesibility data",getProfileData?._id,"getProfileData?.planName",getProfileData?.planName);
    if (
      (getProfileData?.planName == 'Free') &&
      firstItemId == learnData._id
      // index === 0
    ) {
      return true;
    } else if (
      (getProfileData?.planName == 'Free') &&
      firstItemId != learnData._id
      // index > 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onMembershipChange = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access more learn content, please upgrade you account.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  useEffect(() => {
    if (!paused) {
      setTimeout(() => {
        console.log('videoplayer.curremt===', videoPlayer.current);

        videoPlayer?.current?.presentFullscreenPlayer();
      }, 500);
    }
  }, [paused]);

  console.log('status of pause', isPause);
  return (
    <>
      <View style={styles.tipsPara}>
        <View style={styles.tipsParaView}>
          <Text style={styles.paragraph}>
            {learnData?.heading ||
              '5 tips to help you balance work with fitness to be healthy and happy'}
          </Text>
          <Text style={styles.dateView}>
            {moment(learnData?.created).format('ll') + ' '}{' '}
            {moment(learnData?.created).format('LT')}
          </Text>
        </View>
      </View>

      <View style={{paddingHorizontal: 10, bottom: 10}}>
        <>
          {isVideoLoad ? (
            <>
              <Image
                source={{
                  uri: cdnPath + learnData?.image,
                }}
                // resizeMode={'fit'}
                style={[styles.videoStyle, {zIndex: 8}]}
              />
              <View style={{zIndex: 10, position: 'absolute'}}>
                <Loader />
              </View>
            </>
          ) : !paused ? (
            <>
              <Video
                posterResizeMode={'cover'}
                selectedVideoTrack={{
                  type: 'resolution',
                  value: 144,
                }}
                ignoreSilentSwitch={"ignore"}
                fullscreen={true}
                controls={Platform.OS === 'android'? true:false}
                paused={paused}
                ref={ref => (videoPlayer.current = ref)}
                onFullscreenPlayerDidDismiss={() => setPaused(true)}
                resizeMode={'cover'}
                source={{uri: learnData?.video}}
                style={styles.videoStyle}
                disableFocus
                ignoreSilentSwitch={'ignore'}
              />
            </>
          ) : (
            <Pressable
              style={[
                styles.videoStyle,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: checkVideoAccesibility() === false ? 0.3 : 1,
                },
              ]}
              onPress={() => {
                //setVideoLoader(true);
                // setPaused(false);
                if (checkVideoAccesibility() === true) {
                  getCurrentlyPlayingVideoId(learnData._id);
                  setPaused(false);
                  // setTimeout(() => {
                  //   setVideoLoader(false);
                  // }, 500);
                  //setVideoLoader(false);
                  console.log('learn data coming eneraj====', learnData);
                } else {
                  onMembershipChange();
                  // setTimeout(() => {
                  //   setVideoLoader(false);
                  // }, 500);
                  //setVideoLoader(false);
                }
              }}>
              <Image
                source={{
                  uri: cdnPath + learnData?.image,
                }}
                // resizeMode={'fit'}
                style={[styles.videoStyle, {zIndex: 8}]}
              />
              <View style={{zIndex: 10, position: 'absolute'}}>
                <VideoPlayIcon />
              </View>
            </Pressable>
          )}
        </>
        {/* <TouchableOpacity
                onPress={() => 
                  
                  {
                    console.log('videoPlayer?.current getting===',videoPlayer?.current)
                    videoPlayer?.current?.presentFullscreenPlayer()}}
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: 'red'
                }}
              >

              </TouchableOpacity> */}
      </View>
    </>
  );
});
export default Learn;
const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 12,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 5,
    borderColor: COLORS.grey_5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    paddingVertical: 12,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  gradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  withoutGradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
  },
  searchTxt: {
    marginLeft: 10,
    fontSize: 15,
    color: '#BDBDBD',
    fontFamily: 'Manrope-Regular',
    borderWidth: 1,
  },
  filterView: {
    backgroundColor: '#F9F9F9',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnCategory: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    // color:COLORS.grey_3
  },
  videoStyle: {
    // width: 100,
    width: deviceWidth - scale(30),
    alignSelf: 'center',
    height: scale(220),
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    backgroundColor: COLORS.light_grey,
  },

  tipsPara: {
    padding: 10,
  },
  tipsParaView: {
    backgroundColor: COLORS.light_grey,
    padding: 15,
    width: deviceWidth - scale(30),
    alignSelf: 'center',
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Manrope-Semibold',
    lineHeight: 20,
    color: COLORS.grey_2,
  },
  dateView: {
    fontSize: 14,
    color: COLORS.grey_4,
    fontFamily: 'Manrope',
    paddingTop: 5,
  },
  seekBarKnob: {
    color: 'blue',
  },
  backgroundVideo: {
    height: 250,
    width: '100%',
  },
  mediaControls: {
    height: '100%',
    flex: 1,
    alignSelf: 'center',
  },
});
