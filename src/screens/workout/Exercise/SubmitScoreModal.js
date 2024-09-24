import React, { useState } from "react";
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "../../../components/GradientButton";


const SubmitScoreModal = ({title='Score added successfully',isVisible ,onConfirm}) => {

    return (
            <Modal isVisible={isVisible}>
                <View style={{ backgroundColor: "white", paddingVertical:20, borderRadius: 10, marginHorizontal: 30 }}>
                    {/* <Text style={{ fontSize: 16, fontWeight: "700", color: "#4F4F4F", textAlign: "center", marginTop: 15 }}>
                       
                    </Text> */}
                    <Text style={{ textAlign: "center", marginTop: 10, color: "#828282" }}>
                    {title}
                    </Text>
                    {/* <Text style={{ textAlign: "center", color: "#828282" }}>
                        switched to {newExercise}
                    </Text> */}
                    <View style={{ marginTop: 20, marginHorizontal: 20, }}>
                        {/* <Button  title="Yes switch the exercise" onPress={onClose}  /> */}
                        <GradientButton title="ok" onPress={onConfirm} />
                        {/* <TouchableOpacity onPress={onClose
                        }>
                            <Text style={{ textAlign: "center", marginTop: 15, color: "#0DB8DA" }}>
                                Cancel
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </Modal>
    )
}

export default SubmitScoreModal

const styles = StyleSheet.create({})