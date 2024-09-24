import React, {useEffect, useState} from 'react';
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
import {COLORS, DeviceScreen, SignupStepsNum} from '../../common/Constant';
import {useDispatch} from 'react-redux';
import AuthHeader from '../../components/header/AuthHeader';
import {Screen} from "../../common/Screen";
import { getMembershipPlan, storeMembershipPriceData } from '../../_action/MembershipActions';
import { authAction } from '../../_action/AuthAction';


const itemSkus = Platform.select({
  ios: ['003', '005'],
  android: ['002', '001'],
});


function SignupGender(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedGenderM, setSelectedGenderM] = useState(false)
  const [selectedGenderF, setSelectedGenderF] = useState(false)
  const [selectedGenderO, setSelectedGenderO] = useState(false)
  const [standardPrice, setStandardPrice] = useState(0);
  const [premiumPrice, setPremiumPrice] = useState(0);
  const [iapProducts, setIapProducts] = useState([]);

  

  function onGenderSubmit(id){
    if(id === "Male"){
      setSelectedGenderM(true)
      setSelectedGenderF(false)
      setSelectedGenderO(false)
    }else if(id === "Female"){
    setSelectedGenderF(true)
    setSelectedGenderM(false)
    setSelectedGenderO(false)
    }
    else if(id === "Other"){
      setSelectedGenderO(true)
    setSelectedGenderM(false)
    setSelectedGenderF(false)
    }
    else{}
   
    navigation.navigate('MembershipPlan', {
      password: props.route.params.password,
      firstName: props.route.params.firstName,
      lastName: props.route.params.lastName,
      age: props.route.params.age,
      gender:id,
    });
  }
  return (
    <Screen auth={"true"}>
      <ImageBackground
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: "100%"}}>
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} bounces={false}>
          <View>
            <View style={{flex: 2}}>
              <View style={styles.Container}>
                <View style={{paddingTop: 140}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.white,
                      fontWeight:'700'
                    }}>
                    Choose your gender
                  </Text>
                </View>

                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingTop: 20,
                      // opacity: this.state.showLoader ? 0.3 : 1,
                    }}
                    onPress={()=>onGenderSubmit("Male")}>
                    <View style={selectedGenderM ? styles.selectedGenderBtn :styles.genderBtn}>
                      <Text style={styles.btnGenTxt}>Male</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingTop: 20,
                      // opacity: this.state.showLoader ? 0.3 : 1,
                    }}
                    // onPress={() => navigation.navigate('MembershipPlan')}
                    onPress={()=>onGenderSubmit("Female")}>
                    <View style={selectedGenderF ? styles.selectedGenderBtn :styles.genderBtn}>
                      <Text style={styles.btnGenTxt}>Female</Text>
                    </View>
                  </TouchableOpacity>

                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    bottom: '75%',
                  }}>
                  <SignupStepsNum num1="7" />
                </View>
              </View>
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
  genderBtn: {
    width: 345,
    height: 53,
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: '#00000000',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: COLORS.lightBlue,
  },
  selectedGenderBtn:{
    width: 345,
    height: 53,
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: '#00000000',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: COLORS.lightGreen,
  },
  btnGenTxt: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 0,
    fontWeight: 'bold',
  },
});
export default SignupGender;
