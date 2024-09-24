import React, {useState, useRef} from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
// import Video from 'react-native-video';
import Video from 'react-native-video';
import {COLORS} from '../../common/Constant';
import setting from '../../config/settings';

let VideoModal = React.memo(function VideoModal(props) {
  let mediaPath = setting.s3Url.url;
  let cdnPath = setting.cdnUrl.url;
  const {isVisible, videoSource, onClose} = props;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  const videoPlayer = useRef(null);

  const onSeek = seek => {
    videoPlayer?.current.seek(seek);
  };

  const onSeeking = currentVideoTime => setCurrentTime(currentVideoTime);

  const onPaused = () => {
    setPaused(!paused);
    //   setPlayerState(newState);
  };

  const onReplay = () => {
    videoPlayer?.current.seek(0);
    setCurrentTime(0);
    if (Platform.OS === 'android') {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(true);
    } else {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(false);
    }
  };

  const onProgress = data => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    onClose();
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  const onFullScreen = item => {
    onClose();
    setPlayerState(PLAYER_STATES.ENDED);
  };
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        {/* <Video
          onEnd={onEnd}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          posterResizeMode={'contain'}
          onProgress={onProgress}
          paused={paused}
          // ignoreSilentSwitch={"ignore"}
          ref={ref => (videoPlayer.current = ref)}
          resizeMode={'contain'}
          source={{uri: cdnPath + videoSource}}
          style={styles.backgroundVideo}
          disableFocus
        /> */}
        <Video
          // disableFocus
          video={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          videoWidth={1600}
          videoHeight={900}
          selectedVideoTrack={{
            type: 'resolution',
            value: 144,
          }}
          ignoreSilentSwitch={"ignore"}
          thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
        />
        <MediaControls
          duration={duration}
          isLoading={isLoading}
          progress={currentTime}
          onPaused={onPaused}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          onFullScreen={() => onFullScreen()}
          mainColor={COLORS.blue}
          playerState={playerState}
          sliderStyle={{containerStyle: {}, thumbStyle: {}, trackStyle: {}}}
        />
      </View>
    </Modal>
  );
});
export default VideoModal;
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'black',
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
  },
  mediaControls: {
    height: '100%',
    flex: 1,
    alignSelf: 'center',
  },
});
