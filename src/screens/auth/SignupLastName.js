import React, {useReducer} from 'react';
import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
    AppButton,
    COLORS,
    Constants,
    DeviceScreen,
    SignupStepsNum,
} from '../../common/Constant';
import {validateName} from '../../common/Validation';
import InlineError from '../../common/InlineError';
import AuthHeader from "../../components/header/AuthHeader";
import {Screen} from "../../common/Screen";

function SignupLastName(props) {
    const navigation = useNavigation();
    const [data, setData] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            lastName: '',
            lastNameError: '',
        },
    );

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
            lastNameError: '',
        });
    };

    function onSubmitSignupFirstName() {
        let {lastName} = data;

        if (lastName === '') {
            setData({lastNameError: Constants.Errors.LastNameError});
        } else if (!validateName(lastName).status) {
            setData({lastNameError: Constants.Errors.LastNameFormatError});
        } else {
            navigation.navigate('SignupAge', {
                password: props.route.params.password,
                firstName: props.route.params.firstName,
                lastName: lastName,
            });
        }
    }

    let {lastNameError} = data;
    return (
        <Screen auth={"true"}>
            <ImageBackground
                source={require('../../../assets/bgSignin.png')}
                style={{width: DeviceScreen.width, height: "100%"}}>
                <AuthHeader title="Sign up" onPress={() => navigation.goBack()}/>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} bounces={false}>
                    <View style={styles.Container}>
                        <View style={{paddingTop: 140}}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: COLORS.white,
                                    fontWeight: '700',
                                    lineHeight: 20
                                }}>
                                Nice to meet you, {props.route.params.firstName}
                            </Text>
                        </View>
                        <View style={{paddingTop: 5, paddingBottom: 20}}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.grey_4,
                                    lineHeight: 20
                                }}>
                                Please type your last name
                            </Text>
                        </View>
                        <View style={styles.inputField}>
                            <TextInput
                                keyboardType="email-address"
                                style={styles.inputFieldTxt}
                                placeholderTextColor="#ffffffb3"
                                placeholder="Enter your last name here"
                                value={data.lastName}
                                onChangeText={value => setData({lastName: value})}
                                name="lastName"
                                onChange={handleChange}
                                selectionColor={COLORS.blue}
                                returnKeyType="next"
                                onSubmitEditing={onSubmitSignupFirstName}
                            />
                        </View>
                        <InlineError errorMessage={lastNameError}/>
                        <AppButton
                            title="Next"
                            onPress={onSubmitSignupFirstName}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                top: '45%',
                            }}>
                            <SignupStepsNum num1="5"/>
                        </View>


                    </View>
                </ScrollView>
            </ImageBackground>
        </Screen>
    );
}

const styles = StyleSheet.create({
    Container: {
        height: DeviceScreen.height,
        padding: 30,
        backgroundColor: 'rgba(7,7,7,0.4)',
    },
    inputField: {
        flexDirection: 'row',
        borderBottomColor: COLORS.white,
        borderBottomWidth: 1,
        height: 55,
        borderRadius: 0,
        alignItems: 'center',
    },
    icon: {
        alignSelf: 'center',
        alignContent: 'center',
        textAlignVertical: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorField: {
        fontSize: 16,
        marginVertical: 5,
        color: COLORS.white,
    },
    inputFieldTxt: {
        height: 50,
        fontSize: 15,
        color: COLORS.grey_5,
        width:'100%',
        paddingLeft:10
    },
});

export default SignupLastName;
