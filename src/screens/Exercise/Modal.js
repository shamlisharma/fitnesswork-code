import React, { useState } from "react";
import { Button, Text, View,TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "../../components/GradientButton";

function ModalTester({ visible, onClose,prevExercise='',newExercise='',onConfirm }) {
    const [isModalVisible, setModalVisible] = useState(true);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
       
            <Modal isVisible={visible}>
                <View style={{ backgroundColor: "white", height: 210, borderRadius: 10, marginHorizontal: 30 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#4F4F4F", textAlign: "center", marginTop: 15 }}>
                        Are you sure ?
                    </Text>
                    <Text style={{ textAlign: "center", marginTop: 10, color: "#828282" }}>
                        Exercise {prevExercise} will be
                    </Text>
                    <Text style={{ textAlign: "center", color: "#828282" }}>
                        switched to {newExercise}
                    </Text>
                    <View style={{ marginTop: 20, marginHorizontal: 20, }}>
                        {/* <Button  title="Yes switch the exercise" onPress={onClose}  /> */}
                        <GradientButton title="Yes, Switch the exercise" onPress={onConfirm}/>
                        <TouchableOpacity onPress={onClose
                        }>
                        <Text style={{textAlign:"center",marginTop:15,color:"#0DB8DA"}}>
                        Cancel
                    </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
             // <View style={{ flex: 1,backgroundColor:"red" }}>
         //<Button title="Show modal" /> 
        // </View>
    );
}

export default ModalTester;