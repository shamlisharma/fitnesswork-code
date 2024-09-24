import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import moment from 'moment';
// import VideoPlayer from 'react-native-video-player';
import VideoPlayer from 'react-native-video';
import setting from '../../config/settings';
import {PlayBtnIcon, PlayIcon} from '../../Svg';
import {COLORS, DeviceScreen} from '../../common/Constant';
let mediaPath = setting.s3Url.url;
let cdnPath = setting.cdnUrl.url;
const ChatItem = props => {
  const [isVideoPaused, setVideoPaused] = useState(true);
  const [playIcon, setPlayIcon] = useState(false);

  const {item, myUserId, openImageModal} = props;
  const onPlay = msg => {
    setPlayIcon(true);

    try {
      //SoundPlayer.playUrl(mediaPath + msg.url);
      SoundPlayer.playUrl(msg.url);
      console.log('sound url message---', msg.url);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  const onPlaySound = url => {
    setPlayIcon(true);
    try {
      SoundPlayer.playUrl(url);
      console.log('sound url message--- 3333', url);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  const onPauseSound = () => {
    SoundPlayer.stop();
    setPlayIcon(false);
  };

  const onPause = () => {
    SoundPlayer.stop();
    setPlayIcon(false);
  };
  var _onFinishedPlayingSubscription = null;
  useEffect(() => {
    _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        setPlayIcon(false);
      },
    );
  }, []);

  function isAudioType(s) {
    return /\.(mp3|mp4|aac|wav|mov)$/i.test(s);
  }

  console.log('item coming===, item', item);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: item?.senderId === myUserId ? 'flex-end' : 'flex-start',
      }}>
      {item?.senderId === myUserId ? (
        <View style={{alignSelf: 'center', paddingHorizontal: 10}}>
          <Text style={styles.timeZone}>
            {moment(item?.timeStamp).format('hh:mm')}
          </Text>
          <Text style={styles.timeZone}>
            {moment(item?.timeStamp).format('a')}
          </Text>
        </View>
      ) : null}

      {/* {item?.url && (
        <Image
          source={{uri: item?.url}}
          style={[
            styles.videoStyle,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        />
      )} */}

      {console.log('item?.url--------', item)}

      {item?.message ? (
        <Text
          style={{
            maxWidth: '75%',
            backgroundColor:
              item?.senderId === myUserId ? COLORS.grey_6 : COLORS.light_grey,
            padding: 10,
            margin: 5,
            fontFamily: 'Manrope',
            fontSize: 15,
          }}>
          {item.message}
        </Text>
      ) : (
        <View>
          {item?.url ? (
            isAudioType(item?.url) ? (
              playIcon ? (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    marginBottom: 5,
                  }}
                  onPress={() => onPauseSound()}>
                  <PlayBtnIcon width={40} height={40} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}
                  onPress={() => onPlaySound(item?.url)}>
                  <PlayIcon />
                </TouchableOpacity>
              )
            ) : (
              <View>
                {isVideoPaused ? (
                  <ImageBackground
                    source={{uri: item?.url}}
                    style={[
                      styles.videoStyle,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}></ImageBackground>
                ) : (
                  <>
                    <VideoPlayer
                      source={{uri: item?.url}}
                      selectedVideoTrack={{
                        type: 'resolution',
                        value: 144,
                      }}
                      style={styles.videoStyle}
                      thumbnail={
                        {uri: cdnPath + item?.thumbImage} ||
                        require('../../../assets/breakfast.png')
                      }
                      ignoreSilentSwitch='ignore'
                      disableFocus
                      resizeMode="cover"
                      controls
                    />
                  </>
                )}
              </View>
            )
          ) : (
            <>
              {item?.checkInData ? (
                <View
                  style={{
                    backgroundColor: COLORS.grey_6,
                    padding: 10,
                    borderRadius: 10,
                    flex: 1,
                    marginRight: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{maxWidth: '83%'}}>
                    <Text style={styles.weekTitle}>
                      Check in - Week {item?.checkInData?.week}
                    </Text>
                    <Text style={styles.headingOfChat}>
                      Last week weight:{' '}
                      <Text style={styles.checkInmsg}>
                        {item?.checkInData?.lastWeekWeight}
                      </Text>
                    </Text>
                    <Text style={styles.headingOfChat}>
                      Weight now:{' '}
                      <Text style={styles.checkInmsg}>
                        {item?.checkInData?.weightNow}
                      </Text>
                    </Text>
                    <Text style={styles.headingOfChat}>
                      <Text style={styles.checkInmsg}>
                        {item?.checkInData?.trainingFrequency}
                      </Text>{' '}
                      times of training this week{' '}
                    </Text>
                    <Text style={styles.headingOfChat}>
                      Training this week was{' '}
                      <Text style={styles.checkInmsg}>
                        {item?.checkInData?.trainingFeedback}
                      </Text>{' '}
                    </Text>
                    <Text style={styles.headingOfChat}>
                      Diet this week was{' '}
                      <Text style={[styles.checkInmsg]}>
                        {item?.checkInData?.describes}
                      </Text>
                    </Text>
                    {item?.checkInData?.notes ? (
                      <Text style={styles.headingOfChat}>
                        Comments:{' '}
                        <Text style={styles.checkInmsg}>
                          {item?.checkInData?.notes}
                        </Text>
                      </Text>
                    ) : null}
                    {item?.checkInData?.backImage ? (
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            openImageModal(item?.checkInData?.backImage)
                          }>
                          <Image
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 10,
                              marginLeft: 5,
                            }}
                            source={{
                              uri: cdnPath + item?.checkInData?.backImage,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            openImageModal(item?.checkInData?.frontImage)
                          }>
                          <Image
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 10,
                              marginRight: 5,
                              marginLeft: 5,
                            }}
                            source={{
                              uri: cdnPath + item?.checkInData?.frontImage,
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            openImageModal(item?.checkInData?.sideImage)
                          }>
                          <Image
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 10,
                            }}
                            source={{
                              uri: cdnPath + item?.checkInData?.sideImage,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : (
                <>
                  {item?.type === 'audio/aac' ||
                  item?.type === 'audio/wav' ||
                  item?.type == 'audio/mpeg' ? (
                    <>
                      {playIcon ? (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 10,
                            marginBottom: 5,
                          }}
                          onPress={() => onPause(item)}>
                          <PlayBtnIcon width={40} height={40} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 10,
                          }}
                          onPress={() => onPlay(item)}>
                          <PlayIcon />
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <TouchableOpacity onPress={() => openImageModal(item?.url)}>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 200,
                          height: 100,
                          margin: 6,
                        }}
                        source={{
                          uri: mediaPath + item?.url,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}

      {item?.senderId !== myUserId ? (
        <View style={{alignSelf: 'center', paddingHorizontal: 10}}>
          <Text style={styles.timeZone}>
            {moment(item?.timeStamp).format('hh:mm')}
          </Text>
          <Text style={styles.timeZone}>
            {moment(item?.timeStamp).format('a')}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  timeZone: {
    color: COLORS.grey_4,
    fontSize: 13,
    fontFamily: 'Manrope',
    textAlign: 'center',
  },
  videoStyle: {
    width: 250,
    height: DeviceScreen.height * 0.2125,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  weekTitle: {
    fontSize: 15,
    fontFamily: 'Manrope-Bold',
    color: COLORS.blue,
    padding: 5,
  },
  headingOfChat: {
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    padding: 5,
  },
  checkInmsg: {
    fontSize: 15,
    fontFamily: 'Manrope-Bold',
  },
});

export {ChatItem};
