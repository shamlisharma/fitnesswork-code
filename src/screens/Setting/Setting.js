import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { CrossIcon } from '../../Svg'
import RNPickerSelect from 'react-native-picker-select';


const ImageLogo = () => {
    return (
        <Image source={require('../../../assets/According.png')} />
    )
}


export default function Setting({ navigation }) {
    return (
        <View>
            <View style={styles.main}>
                <View style={styles.maicross}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <CrossIcon />
                    </TouchableOpacity>

                </View>
                <View>
                    <Text style={styles.text}>
                        Settings
                    </Text>
                </View>

            </View>
            <View style={{ borderWidth: 1, borderColor: "#cfcdcd", marginTop: 10 }}>

            </View>
            <View>
                <Text style={styles.text2}>
                    How often you want to train per week?
                </Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: '#cfcdcd', marginHorizontal: 10, marginTop: 7 }}>
                <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    items={[
                        { label: '1x', value: '2x' },
                        { label: '3x', value: '4x' },
                        { label: '5x', value: '6X' },
                    ]}
                />
            </View>
            <View>
                <Text style={styles.text2}>
                    Choose time of a day for training
                </Text>
                <View style={{ borderWidth: 1, borderColor: '#cfcdcd', marginHorizontal: 10, marginTop: 7 }}>
                    <RNPickerSelect
                        onValueChange={(value) => console.log(value)}
                        items={[
                            { label: 'Morning', value: 'Evening' },
                        ]}
                    />
                </View>
            </View>
            <View>
                <Text style={styles.text2}>
                    Preferred rest day
                </Text>
                <View style={{ borderWidth: 1, borderColor: '#cfcdcd', marginHorizontal: 10, marginTop: 7 }}>
                    <RNPickerSelect
                        onValueChange={(value) => console.log(value)}
                        items={[
                            { label: 'Sunday', value: '2x' },
                            { label: 'Monday', value: '4x' },
                            { label: 'Tuesday', value: '6X' },
                            { label: 'Wednesday', value: '2x' },
                            { label: 'Thursday', value: '4x' },
                            { label: 'Friday', value: '6X' },
                            { label: 'Saturday', value: '6X' },

                        ]}
                    // Icon={ImageLogo}
                    />

                </View> 
            </View>
            <View>
                <Text style={styles.text2} >
                    Choose time of a day for training
                </Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: '#cfcdcd', marginHorizontal: 10, marginTop: 7 }}>
                <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    items={[
                        { label: 'kg', value: '2x' },
                        // { label: 'Monday', value: '4x' },


                    ]}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('HardWork')} >
                <Text style={styles.Button}>
                    Save
                </Text>
            </TouchableOpacity>



        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontFamily: 'Manrope',
        fontWeight: '400',
        color: "rgba(51, 51, 51, 1)",
        paddingLeft: '25%',

    },
    main: {
        flexDirection: "row",
        marginTop: 25,
        // backgroundColor:"red",
        alignItems: "center"
    },
    maicross: {
        // backgroundColor:"red",
        marginLeft: 15
    },
    text2: {
        fontSize: 14,
        color: "rgba(130, 130, 130, 1)",
        fontWeight: "400",
        marginTop: 25,
        marginLeft: 15
    },
    Button: {
        fontSize: 15,
        textAlign: "center",
        marginTop: 50,
        color: "grey",
        fontWeight: "600",
        // backgroundColor:"black",
        borderWidth: 1,
        padding: 15,
        borderRadius: 30,
        marginHorizontal: 10,
        borderColor: "#F5F5F5",
        backgroundColor: "#dfdede"
    }
})