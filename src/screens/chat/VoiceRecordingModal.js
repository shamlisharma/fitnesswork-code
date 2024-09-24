import React from 'react'
import { Modal, StyleSheet, Text, Pressable,View, Image} from 'react-native'
import { COLORS } from '../../common/Constant';
import { MicIcon, VoiceRecorderIcon } from '../../Svg';

let VoiceRecordingModal = React.memo(function VoiceRecordingModal({onPress,recordVoice,play,close,currentTime}){
    const onCancel = () =>{
      close();
      // onPress();
    }
return(
    <Modal
      animationType="slide"
      transparent={true}
      visible={recordVoice}
      onRequestClose={close}
      >
<View style={styles.modalBackground}>
        <View style={styles.modalWrapper}>
          <View style={styles.titleView}>
            {/* <Text style={styles.title}>Are you sure?</Text> */}
          </View>
          <View style={styles.descView}>
            {/* <Text style={styles.warningMsg}>
              You want to change your membership plan.
            </Text> */}
          </View>
          <View style={{flexDirection:"row",justifyContent:"center"}}>
           <Image  style={{width:55,height:55,}} source={require("../../../assets/microphone.png")}/>
          </View>
          <View style={{flexDirection:"row",justifyContent:"center",paddingVertical:16}}>
            <Text>{currentTime}s</Text>
          </View>
          <View style={styles.buttonView}>
          <Pressable style={styles.confirmButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onPress}>
              <Text style={styles.buttonText}>Send</Text>
            </Pressable>
            {/* <Pressable
              style={styles.confirmButton}
              onPress={play}>
              <Text style={styles.buttonText}>Play</Text>
            </Pressable> */}
          </View>
        </View>
      </View>
      </Modal>
)
})
export default VoiceRecordingModal
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
      },
      modalWrapper: {
        backgroundColor: '#fff',
        height: 'auto',
        width: '90%',
        paddingBottom: 30,
        borderRadius: 5,
      },
      logoImage: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
      },
      titleView: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 25,
      },
      descView: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
      questLogoImage: {
        width: 50,
        height: 50,
      },
      title: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
      },
      warningMsg: {
        fontFamily: 'Manrope-regular',
        fontSize: 14,
        paddingTop: 6,
      },
      confirmButton: {
        // backgroundColor: COLORS.lightGreen,
        // paddingHorizontal: 40,
        // paddingVertical: 10,
      },
      buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 30,
      },
      buttonText: {
        fontSize: 16,
        fontFamily: 'Manrope-Semibold',
        color: COLORS.lightGreen,
      },
});
