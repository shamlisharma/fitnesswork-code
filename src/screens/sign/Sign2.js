import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { DeviceScreen } from '../../common/Constant'
import { BackArrowIcon } from '../../Svg'
import GradientButton from '../../components/GradientButton'



const Sign2 = ({ navigation }) => {
    const [selectedButton, setSelectedButton] = useState("");
    return (
        <ImageBackground
            source={require('../../../assets/bgSignin.png')}
            style={{ width: DeviceScreen.width, height: "100%" }}>
            <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1, }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop:20}}>
                    <View style={{ padding: 20,marginTop:10}}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackArrowIcon color={'white'} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.Text1} >
                            Sign Up
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.Text2}>
                        How often you want to train per week?
                    </Text>
                </View>
                <View >
                    <View style={{ flexDirection: "row", marginLeft: "7%", marginTop:10}} >
                        <TouchableOpacity>
                            <Text style={styles.Text3}>
                                3x
                            </Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity>
                                <Text style={styles.Text4}>
                                    4X
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity>
                                <Text style={styles.Text5}>
                                    5x
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={styles.Text6}>
                        Choose time of a day for training
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 18 }}>
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity>
                            <Text style={styles.Text7}>
                                Morning
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity>
                            <Text style={styles.Text8}>
                                Evening
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={styles.Text9}>
                        Choose time of a day for training
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 18 }}>
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity>
                            <Text style={styles.Text10}>
                                ibs
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity>
                                <Text style={styles.Text11}>
                                    Eg
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "20%", marginHorizontal: 30 }}>
                    <GradientButton title="Confirm " onPress={() =>navigation.navigate('HardWork') } />
                </View>

            </View>

        </ImageBackground>
    )
}

export default Sign2

const styles = StyleSheet.create({
    Text1: {
        paddingLeft: 100,
        fontSize: 28,
        color: "#0DB8DA"
    },
    Text2: {

        fontSize: 16,
        fontWeight: "700",
        color: "white",
        marginTop: 40,
        marginLeft: "6%"
    },
    Text3: {
        borderWidth: 1,
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: 30,
        padding: 10,
        borderRadius: 30,
        backgroundColor: "#0DB8DA"
    },
    Text4: {
        borderWidth: 1,
        marginLeft: "10%",
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: 30,
        padding: 10,
        borderRadius: 30

    },
    Text5: {
        borderWidth: 1, marginLeft: "10%",
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: 30,
        padding: 10,
        borderRadius: 30
    },
    Text6: {

        fontSize: 16,
        fontWeight: "700",
        color: "white",
        marginTop: 65,
        marginLeft: "7%"
    },
    Text7: {

        borderWidth: 1,
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: 50,
        padding: 14,
        borderRadius: 30,
        marginLeft: "7%"
    },
    Text8: {
        borderWidth: 1,
        marginLeft: "7%",
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: 50,
        padding: 15,
        borderRadius: 30,
        backgroundColor: "#0DB8DA",
    },
    Text9: {
        fontSize: 16,
        fontWeight: "700",
        color: "white",
        marginTop: 65,
        marginLeft: "7%"
    },
    Text10: {

        borderWidth: 1,
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: "15%",
        padding: 15,
        borderRadius: 30,
        marginLeft: "7%",
        backgroundColor: "#0DB8DA"
    },
    Text11: {

        borderWidth: 1,
        marginLeft: "15%",
        color: "white",
        borderColor: "#0DB8DA",
        paddingHorizontal: "15%",
        padding: 15,
        borderRadius: 30
    }
})