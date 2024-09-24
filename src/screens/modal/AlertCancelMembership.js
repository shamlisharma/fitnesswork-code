import { NavigationContainer, useNavigation } from '@react-navigation/native';

import React, { useState } from 'react';
import { Modal, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../common/Constant';
import GradientButton from '../../components/GradientButton';
import { images } from '../../utils/images';


let AlertCancelMembership = React.memo(function AlertModal(props) {
    const navigation = useNavigation()
    const [cancelMembershipVisibility, setCancelMembershipVisibility] =
        useState(false);
    const { alert, onResume, headertitle, content, cancelBtn, saveBtn, width, cancel, opacity, onClosePressed, allowCloseIcon,
        titleCustomStyle, modalCustomStyle
    } = props;

    return (
        <Modal animationType="fade" transparent={true} visible={alert} onRequestClose={onResume}>
            <View style={[styles.modalBg, { backgroundColor: opacity || '#00000040' }]}>
                <View style={[styles.modalBackground, modalCustomStyle]}>


                    {
                        allowCloseIcon &&
                        <TouchableOpacity
                            onPress={onClosePressed}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            <Image
                                source={images.crossIcon}
                            />
                        </TouchableOpacity>
                    }

                    <Text style={[styles.title, titleCustomStyle]}>{headertitle}</Text>
                    <Text style={styles.subTitle}>{content}</Text>
                    {cancelBtn !== "" ?
                        <View style={styles.buttonContainer}>


{/* 
                            <GradientButton
                                title={cancelBtn}
                                onPress={cancel}
                                style={{ padding: 6, marginHorizontal: 6 }}
                                textStyle={{ fontSize: 13 }}
                                width={width}
                            />
                            <GradientButton
                                title={saveBtn}
                                style={{ padding: 6, marginHorizontal: 6 }}
                                textStyle={{ fontSize: 13 }}
                                onPress={() => onResume()}
                                width={width}
                            /> */}

                            <View>
                                 <TouchableOpacity
                                    style={styles.cancelButtonView}
                                    onPress={() => onResume()}>
                                    
                                    <Text style={{ color: '#0CDD99' }}>
                                        Cancel Subscription
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={cancel}>
                                    <View  >
                                        <Text style={{ color: '#0DB8DA', marginLeft: 50, marginTop: 12,textDecorationLine:"underline"}}>
                                            Close
                                        </Text>
                                    </View>
                                </TouchableOpacity> 

                            </View>

                        </View> :

                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
                            <GradientButton
                                title={saveBtn}
                                style={{ padding: 6, marginHorizontal: 6 }}
                                textStyle={{ fontSize: 13 }}
                                onPress={() => onResume()}
                                width={width}
                            />
                        </View>
                    }
                </View>

            </View>
        </Modal>
    );
})
export default AlertCancelMembership;
const styles = StyleSheet.create({
    modalBg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    modalBackground: {
        backgroundColor: '#F9F9F9',
        height: "auto",
        width: "90%",
        paddingBottom: 30,
        borderRadius: 10,
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        fontFamily: "Manrope-Bold",
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    subTitle: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Manrope-Regular",
        paddingHorizontal: 25,
        color:"grey"

    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 10,
        paddingTop: 20,
        backgroundColor: "#F9F9F9"
    },
    cancelButtonView: {
        alignSelf: 'center',
        padding: 15,
        backgroundColor: '#fff',
        width: '150%',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 10,
        // borderWidth:1,
        // borderColor:"grey"

    },
});