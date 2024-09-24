import React from 'react';
import { SafeAreaView,View,Image,ScrollView ,Text} from 'react-native';
import { COLORS } from '../../common/Constant';
import Header from '../../components/header/Header';
import setting from "../../config/settings";

let MembershipPlanInfo = React.memo(function MembershipPlanInfo(props){
    let dataById = props?.route?.params?.membershipPlanByid
    let mediaPath = setting.s3Url.url
    return(
        <SafeAreaView style={{flex:1,backgroundColor:COLORS.white,}}> 
        <Header title="Membership"/>
         <ScrollView showsVerticalScrollIndicator={false} >
        <View style={{flex:1, padding:15}}>
        <View>
        <Image source={{uri: mediaPath + dataById.planImage}} 
        style={{height:200,width:"100%"}}
        />
        </View> 
        <View style={{marginTop:30}}>
        <Text style={{fontSize:16,fontFamily:"Manrope-Bold",}}>Plan</Text>  
        <Text style={{fontSize:16,fontFamily:"Manrope-semibold",textTransform:"capitalize"}}>{dataById.planName}</Text>
        </View>
        <View style={{marginTop:10}}>
        <Text style={{fontSize:16,fontFamily:"Manrope-Bold",}}>Description</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",textTransform:"capitalize"}}>{dataById.description}</Text>

        {dataById.planName == "Standard" ?
        <>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black,marginTop:10}}>Create unlimited workouts</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Create unlimited meal plans</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Calorie Tailor-made foods</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Home workouts for all levels</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Interactive Mobile Friendly app</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Access to Joshua’s learn academy</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Access to 50+ customised recipes</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Access to 100+ demonstration videos</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Daily Steps Monitor for IOS and Android</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Daily motivating tips via push notifications</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Share workouts and compete with friends</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Progress tracker with charts and measurements</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Follow Fat Loss or Muscle Building programmes</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>Participate in the famous 60 Day Challenge</Text>
        </>:<></>}
        { 
          dataById.planName == "Premium" ?
          <>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black,marginTop:10}}>- Everything in standard</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>- Weekly review from Trainer</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>- Live Chat Trainer support</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>- Access to Customised Meal plan</Text>
        <Text style={{fontSize:14,fontFamily:"Manrope-regular",color:COLORS.black}}>- Access Customised Workout plan</Text>
        </>:<></>}
        </View>
        </View>
        
        </ScrollView>
        </SafeAreaView>
    )
})
export default MembershipPlanInfo;