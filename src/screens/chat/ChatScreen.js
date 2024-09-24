import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {COLORS, DeviceScreen} from '../../common/Constant';
import setting from '../../config/settings';
import {PlayBtnIcon, PlayIcon} from '../../Svg';
import moment from 'moment';
import SoundPlayer from 'react-native-sound-player';
import ImageModal from './ImageModal';
import {FlatList} from 'react-native-gesture-handler';
import { ChatItem } from './ChatItem';

let ChatScreen = React.memo(function ChatScreen(props) {
  const {msg, userProfile, onStop} = props;
  const [playIcon, setPlayIcon] = useState(false);
  const [imageModalShow, setImageModalShow] = useState(false);
  const [imageState, setImageState] = useState();
  const videoPlayerRef = useRef(null);
  let mediaPath = setting.s3Url.url;
  let cdnPath = setting.cdnUrl.url;
  let myUserId = userProfile?._id;
let currentDate = moment().format("YYYY-MM-DD")
  
  const openImageModal = item => {
    setImageModalShow(true);
    setImageState(item);
  };
  return (
    <View style={{marginBottom: 25}}>
      {imageModalShow ? (
        <ImageModal
          image={imageState}
          modalShow={true}
          closeModal={() => setImageModalShow(false)}
        />
      ) : null}
       {msg?.date == "" ?
      null:
      <Text
        style={{
          textAlign: 'center',
          color: COLORS.grey_4,
          fontSize: 13,
          fontFamily: 'Manrope',
          padding: 5,
        }}>
         
          {moment(msg?.date).format('LL')}
          
        
      </Text>
      }
      
      
      <FlatList
        inverted
        keyExtractor={(item, index) => index.toString()}
        data={msg?.chatMessages}
        renderItem={({item}) => (
          <ChatItem 
            myUserId={myUserId}
            item={item}
            openImageModal={openImageModal} 
            />
        )}
      />
    </View>
  );
});
export default ChatScreen;

const styles = StyleSheet.create({
  timeZone: {
    color: COLORS.grey_4,
    fontSize: 13,
    fontFamily: 'Manrope',
    textAlign: 'center',
  },
  videoStyle: {
    width: 1600,
    height: 900,
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
