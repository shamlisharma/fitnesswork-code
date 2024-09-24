import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Text,
  Dimensions,
  Linking
} from 'react-native';
import { COLORS, DeviceScreen } from '../../common/Constant';
import { MainScreen } from '../../common/Screen';
import {
  BackArrowIcon,
  BackIcon,
  MicIcon,
  PinIcon,
  SendIcon,
  SendIconDisable,
} from '../../Svg';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import io from 'socket.io-client';
import { usersService } from '../../services/ApiServices';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector, connect } from 'react-redux';
import { getChat, getChatHistory } from '../../_action/CommunityAction';
import setting from '../../config/settings';
import ChatScreen from './ChatScreen';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import VoiceRecordingModal from './VoiceRecordingModal';
import _ from 'lodash';
import { Loader } from '../../common/Loader';
import { getOr } from 'lodash/fp';
import { isEmpty } from 'lodash';

const { width } = Dimensions.get('window')

let ChatData = React.memo(function ChatData(props) {
  const listRef = useRef();
  const [lastViewableIndex, setLastViewableIndex] = useState(null);
  const navigation = useNavigation();

  const { userProfile, chatHistoryData, userChat } = props;
  const dispatch = useDispatch();

  const [apiCount, setApiCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState();
  const [type, setMimeType] = useState('');
  const [url, setUrl] = useState('');
  const [thumbImage, setThumbImage] = useState('');
  const [chatData1, setChatData1] = useState([]);
  const [chatLoader, setChatLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [audioPath, setAudioPath] = useState(
    AudioUtils.DocumentDirectoryPath + '/test.aac',
  );
  const [recorderFile, setRecorderFile] = useState('');
  const [currentTime, setCurrentTime] = useState(0.0);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stoppedRecording, setStoppedRecording] = useState(false);
  const [filePathData, setFilePathData] = useState('');
  const [hasPermission, setHasPermission] = useState();
  const [voiceModal, setVoiceModal] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const [height, setHeight] = useState(height);
  const [receiverMsg, setReceiverMsg] = useState();
  const [onConfirm, setOnConfirm] = useState(false);
  const [newMessages, setNewMessages] = useState();
  // const socketRef = useRef();
  const socketUrl = setting.socketDevUrl.url;
  const fromHome = props?.route?.params?.fromHome;
  const planName = props?.route?.params?.planName;
  const [trueFromHome, setTrueFromHome] = useState(fromHome);
  function prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  }

  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );

  useEffect(() => {

    //console.log("getProfileData",getProfileData?.planName)
    getProfileData?.planName.includes('Standard') ? null : onMembershipChange();
    onGetInnovated()
  }, []);

  useEffect(() => {
    if (trueFromHome == true) {
      setChatLoader(false);
    } else {
      setChatLoader(true);
      setTimeout(function () {
        setChatLoader(false);
      }, 1000);
      setTrueFromHome(false);
    }
    if (chatHistoryData?.messages) {
      // setChatLoader(false);
      const groups = chatHistoryData?.messages?.reduce((groups, chat) => {
        const date = chat?.created?.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(chat);
        return groups;
      }, {});

      // Edit: to add it in the array format instead
      const groupArrays = Object?.keys(groups)?.map(date => {
        return {
          date,
          chatMessages: groups[date],
        };
      });
      console.log('chat data of user', groupArrays);
      setChatData1(groupArrays);
    }
  }, [chatHistoryData]);

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  const onViewableItemsChanged = useRef(props => {
    const { viewableItems, changed } = props;
    setLastViewableIndex(viewableItems[viewableItems.length - 1]?.index);
  });
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');

    // socketRef.current = io(socketUrl, {
    //   query: {accessToken: accessToken},
    //   transports: ['websocket'],
    // });
    setNewMessages('');

    // socketRef.current.on('message', data => {
    //   let obj = {
    //     created: new Date(),
    //     groupId: data.groupId,
    //     message: data.message,
    //     receiverId: data.receiverId,
    //     senderId: data.senderId,
    //   };
    //   setNewMessages({date: '', chatMessages: [obj]});
    //   // setChatData1(chatData1)
    // });

    // socketRef.current.on('reconnect', () => {
    //   let obj = {
    //     created: new Date(),
    //     groupId: data.groupId,
    //     message: data.message,
    //     receiverId: data.receiverId,
    //     senderId: data.senderId,
    //   };
    //   setNewMessages({date: '', chatMessages: [obj]});
    // });

    // socketRef.current.on('reconnection_attempt', () => {
    //   let obj = {
    //     created: new Date(),
    //     groupId: data.groupId,
    //     message: data.message,
    //     receiverId: data.receiverId,
    //     senderId: data.senderId,
    //   };
    //   setNewMessages({date: '', chatMessages: [obj]});
    // });

    return () => {
      //socketRef.current.disconnect();
    };
  }, []);

  useFocusEffect(
  
    React.useCallback(() => {
   
      if (props?.userChat != undefined && apiCount === 0) {
        setApiCount(res => res + 1);
        dispatch(getChat());
        let req = {
          groupId: userChat?._id,
        };
        dispatch(getChatHistory(req));
      }
    }, [props?.userChat]),
  );

  useEffect(() => {
    // chatHistory();
  }, []);

  useEffect(() => {
    let temp_chatData = [...chatData1];
    temp_chatData.unshift(newMessages);
    setChatData1(temp_chatData);
  }, [newMessages]);
  // Audio handle here

  useEffect(() => {
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      setHasPermission(isAuthorised);
      if (!isAuthorised) return;
      prepareRecordingPath(audioPath);

      AudioRecorder.onProgress = data => {
        setCurrentTime(Math.floor(data.currentTime));
      };
    });
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // do something
      console.log('back to home');
    });
    return unsubscribe;
  }, [props]);

  // chat history here

  const chatHistory = async () => {
    // noinspection JSAnnotator
    let req = {
      groupId: userChat?._id,
    };
    dispatch(getChatHistory(req));
  };

  // image upload handle here
  const handleSelectFile = () => {
    const options = {
      mediaType: 'mixed',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return null;
      } else if (response.assets && response.assets.length !== 0) {
        const uri = response.assets[0].uri;
        const fileName = response.assets[0].fileName;
        const type = response.assets[0].type;
        if (uri && fileName) {
          const file = {
            name: fileName,
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type: type || 'video/quicktime',
          };

          setSelectedFile(() => file);
          Alert.alert(
            'Alert',
            'Do you want to send ?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => onUpload(file),
              },
            ],
            {
              cancelable: false,
            },
          );
        }
      }
    });
  };

  const onMembershipChange = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access the trainer chat feature, please upgrade your membership plan to premuim.',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>{
           navigation.push("Membership",{ filter: "chat" })
            //  navigation.push('Membership', { filter: "chat" })
          }
        },
      ],
      {
        cancelable: false,
      },
    );
  };
  const onGetInnovated = () => {
    Alert.alert(
      "Work with me 1-1",
      'I’ve created a programme which has helped 1000+ people transform their physique. It’s fully customised and you’ll work with me  weekly directly.',
      [
        {
          text: 'Get Involved',
          onPress: () =>{
           Linking.openURL("https://fitnessvwork.com/vip-coaching/")
            //  navigation.push('Membership', { filter: "chat" })
          },
          
        },
        {
          text: 'No Thanks',
          onPress: () => { },
          style: 'cancel',
        },
        
      ],
      {
        cancelable: false,
      },
    );
  };
  const onUpload = file => {
    setOnConfirm(true);
    var data = new FormData();
    data.append('file', file);

    usersService
      .chatFileUpload(data)
      .then(result => {
        setChatLoader(true);
        if (result?.data?.statusCode === 1) {
          setChatLoader(false);
          setMimeType(result?.data?.responseData?.type);
          setUrl(result?.data?.responseData?.url);
          setThumbImage(result?.data?.responseData?.thumImage);
          let newMsg = {
            created: new Date(),
            groupId: userChat?._id,
            receiverId: userChat?.coachId._id,
            type: result?.data?.responseData?.type,
            url: result?.data?.responseData?.url,
            senderId: userProfile?._id,
            thumbImage: result?.data?.responseData?.thumImage,
          };
          chatData1.unshift({ date: '', chatMessages: [newMsg] });
          setChatData1(chatData1);
          // socketRef.current.emit('chatMessage', newMsg);
          setSelectedFile(null);
          setOnConfirm(false);
        }
      })
      .catch(err => {
        console.log('error for file upload', err);
        setOnConfirm(false);
        setChatLoader(false);
      });
  };

  // message send handle here
  const onSend = async () => {
    console.log(
      'message send from chat',
      isEmpty(messages),
      '----messages',
      messages,
    );
    if (messages == '' || isEmpty(messages)) {
    } else {
      let newMsg = {
        created: new Date(),
        groupId: userChat?._id,
        message: messages,
        receiverId: userChat?.coachId._id,
        senderId: userProfile?._id,
      };
      chatData1.unshift({ date: '', chatMessages: [newMsg] });
    
      setChatData1(chatData1);
      // socketRef.current.emit('chatMessage', newMsg);

      setMessages('');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Image
            source={require('../../../assets/Avatar.png')}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  async function _stop() {
    AudioRecorder.onFinished = data => {
      if (Platform.OS === 'android') {
        _finishRecording(true, data.audioFileURL);
      }

      setFilePathData(data.audioFileURL);
      if (Platform.OS === 'ios') {
        _finishRecording(
          data.status === 'OK',
          data.audioFileURL,
          data.audioFileSize,
        );
      }
    };
    if (!recording) {
      return;
    }
    setStoppedRecording(true);
    setRecording(false);
    setPaused(false);
    setVoiceModal(false);
    try {
      const filePath = await AudioRecorder.stopRecording();
    } catch (error) { }
  }

  async function _play() {
    if (recording) {
      await _stop();
    }

    setTimeout(() => {
      var sound = new Sound(audioPath, '', error => {
        if (error) {
        }
      });

      setTimeout(() => {
        sound.play(success => {
          if (success) {
          } else {
          }
        });
      }, 100);
    }, 100);
  }

  async function _record() {
    setVoiceModal(true);
    if (recording) {
      // console.log('Already recording!', recording);
      return;
    }

    if (!hasPermission) {
      // console.log("Can't record, no permission granted!");
      return;
    }

    if (stoppedRecording) {
      prepareRecordingPath(audioPath);
    }
    setRecording(true);
    setPaused(false);

    try {
      const filePath = await AudioRecorder.startRecording();
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async function _finishRecording(didSucceed, filePath, fileSize) {
    setFilePathData(filePath);

    let onAudioPath =
      Platform.OS === 'android' ? filePath : filePath.replace('file://', '');
    let audioObj = {
      name: onAudioPath,
      type: 'audio/mpeg',
      uri: onAudioPath,
    };
    var data = new FormData();
    data.append('file', audioObj);
    usersService.chatFileUpload(data).then(result => {
      if (result?.data?.statusCode === 1) {
        setRecorderFile(result?.data?.responseData?.location);
        setVoiceModal(false);
        let newMsg = {
          created: new Date(),
          groupId: userChat?._id,
          receiverId: userChat?.coachId._id,
          type: result?.data?.responseData?.type,
          url: result?.data?.responseData?.url,
          senderId: userProfile?._id,
          thumbImage: result?.data?.responseData?.thumImage,
        };
        chatData1.unshift({ date: '', chatMessages: [newMsg] });
        setChatData1(chatData1);
        // socketRef.current.emit('chatMessage', newMsg);
      }
    });
  }

  const closeAudio = () => {
    _stop();
    setVoiceModal(false);
  };

  return (
    <MainScreen>

      {/* background */}
      <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 10 }} >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ right: 25, left: 25, top: 20, bottom: 20 }}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitleTextStyle}>Chat with Coach</Text>

        <View />


      </View>

      <View style={{ height: 0.5, backgroundColor: '#D3D3D3', width }} />



      {chatLoader ? <Loader loading={true} /> : null}
      {voiceModal ? (
        <VoiceRecordingModal
          currentTime={currentTime}
          recordVoice={voiceModal}
          close={() => closeAudio()}
          onPress={() => _stop()}
          play={() => _play()}
        />
      ) : null}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == 'ios' && 'padding'}
        keyboardVerticalOffset={Platform.OS == 'ios' && 100}>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, marginTop: 10 }}>
            <FlatList
              ref={listRef}
              inverted
              keyExtractor={(item, index) => index.toString()}
              data={chatData1}
              extraData={chatData1}
              bounces={false}
              renderItem={({ item }) => (
                <ChatScreen
                  msg={item}
                  userProfile={userProfile}
                  chatLoader={chatLoader}
                  selectedFile={selectedFile}
                  onPlay={() => _play()}
                  onStop={() => _stop()}
                />
              )}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged.current}
            />
          </View>
          {selectedFile && onConfirm ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingTop: 5,
                width: '90%',
                height: 100,
                marginBottom: 40,
              }}>
              <ImageBackground
                style={{
                  width: 200,
                  height: 100,
                  opacity: 0.4,
                }}
                source={{ uri: selectedFile?.uri }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color={COLORS.lightGreen}
                  />
                </View>
              </ImageBackground>
            </View>
          ) : null}
          <View style={styles.searchSection}>
            <TextInput
              value={messages}
              onChangeText={messages => setMessages(messages)}
              style={styles.input}
              placeholder="Type here"
              multiline
            />

            <TouchableOpacity style={styles.icons} onPress={() => _record()}>
              <MicIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icons} onPress={handleSelectFile}>
              <PinIcon />
            </TouchableOpacity>

            {isEmpty(messages) && (
              <View style={styles.icons}>
                <SendIconDisable />
              </View>
            )}

            {!isEmpty(messages) && (
              <TouchableOpacity style={styles.icons} onPress={onSend}>
                <SendIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainScreen>
  );
});

const mapStateToProps = state => {
  return {
    userProfile: getOr(
      {},
      'profileReducer.profile.data.responseData.userProfile',
      state,
    ),
    chatHistoryData: getOr([], 'community.chatHistory', state),
    userChat: getOr({}, 'community.getChat.result', state)[0],
  };
};
export default connect(mapStateToProps)(ChatData);

const styles = StyleSheet.create({
  giftedChatBoxInput: {},
  container: {
    flex: 1,
    backgroundColor: '#2b608a',
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#fff',
  },
  button: {
    padding: 20,
  },
  disabledButtonText: {
    color: '#eee',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  activeButtonText: {
    fontSize: 20,
    color: '#B81F00',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.grey_6,
    padding: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: COLORS.black,
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    flexGrow: 1,
  },
  icons: {
    paddingHorizontal: 8,
  },
  timeZone: {
    color: COLORS.grey_4,
    fontSize: 13,
    fontFamily: 'Manrope',
    textAlign: 'center',
  },
  videoStyle: {
    width: 200,
    height: DeviceScreen.height * 0.2125,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerTitleTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 17,
    textTransform: 'capitalize',
    color: COLORS.grey_1,
    justifyContent: 'center',
  },
});
