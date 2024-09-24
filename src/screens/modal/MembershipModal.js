import React from 'react';
import { Pressable } from 'react-native';
import {Modal,View,StyleSheet,Text,FlatList} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StepsCloseIcon} from '../../Svg';
import { COLORS } from '../../common/Constant';
export const MembershipModal = React.memo(props => {

    const {
        loading,
        close,
        infoData,
        ...attributes
    } = props;

  return (
    <Modal transparent={true} animationType="none" visible={loading} onRequestClose={close}>
        <View style={styles.modalBackground}>
            
            <View style={styles.activityIndicatorWrapper}>
                <View style={{flexDirection:"row",justifyContent:"space-between",padding:12}}>
                    <Text style={{fontSize:14,fontFamily:"Manrope-SemiBold"}}>Membership Info</Text>
                    <Pressable onPress={close}>
                    <StepsCloseIcon />
                    </Pressable>
                </View>
                <View style={{padding:12}}>
                    {props?.infoData?.planName === "Standard" ?
                <View>
                    <FlatList 
                    data={props?.infoData?.planInfo}  keyExtractor={({ id }, index) => id}
                    renderItem={({item}) => (
                        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black,marginTop:10}}>{item}</Text>

                        )}/>
                
                </View>:<></>}
                { props?.infoData?.planName == "Premium" ?
                <>
               <FlatList 
                    data={props?.infoData?.planInfo}  keyExtractor={({ id }, index) => id}
                    renderItem={({item}) => (
                        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black,marginTop:10}}>{item}</Text>

                        )}/>
                </>:<></>}
                { props?.infoData?.planName == "Free" ?
                <>
                <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black,marginTop:10}}>{props?.infoData?.description}</Text>
                
                </>:<></>}
                </View>
            </View>
        </View>
      {/*<ActivityIndicator size="large" color="#0DB8DA" />*/}
    </Modal>
  );
});
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#fff',
        height: "auto",
        width: "90%",
        paddingBottom:30
        
    
    }
});
