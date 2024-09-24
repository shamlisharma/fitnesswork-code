import React from 'react'
import { Modal, StyleSheet, Text, Pressable,View, Image} from 'react-native'
import { COLORS } from '../../common/Constant';
import setting from '../../config/settings';
import { MicIcon, StepsCloseIcon, VoiceRecorderIcon } from '../../Svg';

let ImageModal = React.memo(function ImageModal({image,modalShow,closeModal}){
    let mediaPath = setting.cdnUrl.url;
    
return(
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalShow}
      onRequestClose={closeModal}
      >

        <View style={styles.modalBackground}>
        
        <View style={styles.activityIndicatorWrapper}>
        <View style={{flexDirection:"row",justifyContent:"flex-end",padding:20}}>
                <Pressable onPress={closeModal}>
                   <StepsCloseIcon color={COLORS.white}/>
                    </Pressable>
                    
                </View>
               
                <Image  resizeMode="contain" source={{uri:mediaPath+image}} style={{width:"100%",height:300}}/>
            </View>
        
      </View>
      </Modal>
)
})
export default ImageModal
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#000000cf',
       
      },
      activityIndicatorWrapper: {
        // backgroundColor: '#fff',
        height: "auto",
        width: "100%",
        paddingBottom:30
        
    
    }
});
