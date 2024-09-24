import React from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CrossIcon } from '../../Svg';

export const ImagePickerModal = React.memo((props) => {
    const {
        visible,
        close,
    } = props;
    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            onRequestClose={close}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => close()} activeOpacity={0.7}
                        style={{ paddingVertical: 10 }}>
                        <CrossIcon />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20 }}>{'Choose from Camera'}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 20 }}>{'Choose from Gallery'}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
})

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000040'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        height: 200,
        width: '80%',
    }
});