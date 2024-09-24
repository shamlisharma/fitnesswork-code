import React from "react";
import {SafeAreaView, View, Text, StatusBar, StyleSheet,ScrollView } from "react-native";
import Header from "../../components/header/Header";
import {useNavigation} from "@react-navigation/native";
import {COLORS, DeviceScreen} from "../../common/Constant";
import moment from "moment";


let PrivacyPolicy = React.memo(function PrivacyPolicy() {
    let navigation = useNavigation();

    const getMonthAndYear = () => {
        const date = moment(new Date());
        return ` ${date.format('MMMM, YYYY')}`
    }
    return(
        <SafeAreaView style={{flex:1}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Header 
                title="Privacy policy"
                status="drawer" 
            />
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{height:"100%",backgroundColor:COLORS.white,paddingVertical:10}}>
                <View style={styles.dateTitle}>
                    <Text style={{fontSize:15,fontFamily: "Manrope",fontWeight:'400',color:COLORS.grey_4}}>Effective date:</Text>
                    <Text style={{fontSize:15,fontFamily: "Manrope",fontWeight:'bold',color:COLORS.grey_4}}>{getMonthAndYear()}</Text>
                </View>
                <View style={{padding:15}}>
                    <Text style={styles.fitnessTitle}>INTRODUCTION</Text>
                </View>
                <View style={styles.desc}>
                        <Text
                            style={[styles.policyDesc,{paddingVertical:10}]}>
                            We are FitnessvWork ("we"/"us"/"our") an online nutrition health and fitness company, run by Joshua Oguntuase, an Active IQ accredited personal trainer from the UK.
                        </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        These are the Terms and Conditions ("Terms") which govern our provision of the FitnessvWork 60 Day Fitness and Nutrition plan (the "Plan") to you, the customer ("you"/"your"), and your use of the Plan.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        These Terms should be read in conjunction with our Website & App Terms of Use and our Privacy Policy.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        These Terms constitute a legal agreement between us and you. Please read them carefully.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        Please note that we do not provide medical advice.  When following our Plan, you are doing so at your own risk, and you must take full responsibility for the effects on your body that you may experience along the way. Any guidance we may provide is no substitute for professional medical or physiotherapy advice. Always ask your GP if in doubt.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        The Plan is not appropriate for you if you have any of the conditions or illnesses listed in clause 6.2 below. You must not sign up for the plan if you are under 18 years of age.

                    </Text>

                </View>


                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>THE PLAN</Text>
                </View>
                <View style={styles.desc}>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        The Plan is an online tailored nutrition and training plan to help users get fitter, stronger and healthier.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        The set meals and workout for each phase will be tailored to you, in line with our own unique formula. Our ethos is being able to help people balance work life with fitness in a sustainable and enjoyable way. Therefore, meals are based on a protein/carb/fat ratio and balanced against the training preferences of the user for that day.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        Once your Plan begins, you will be in complete control of the results. In order to achieve success with this program you need to stick to it 100%: this includes following advice we give you about meal portions, meal timings, training, alcohol consumption and eating out.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        The length and timing of the Plan is pre-determined. If you decide to stop or pause the Plan at any time, we will not be responsible for providing any additional guidance or support after the official end date of the Plan.
                    </Text>
                </View>
                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>MEALS</Text>
                </View>
                <View style={styles.desc}>
                <Text
                    style={[styles.policyDesc,{paddingVertical:10}]}>
                    All the meals contained within all Plans are tailored to your fat loss goals. They are pre-set, so new recipes will not be created upon request.

                </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        Unfortunately, we cannot provide tailored plans for those with allergies. Please be aware of this when signing up to the Plan, or if you choose to change your dietary preferences while on the Plan. If you have an allergy or intolerance you should follow publically available guidance on alternatives to allergens.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        It is important that you fully understand that the advice given by us regarding allergies is followed at your own risk and responsibility. Although we will recommend the use of Plans in line with your allergies or intolerances, this does not constitute medical advice and you must ensure that you and your GP and/or or nutritionist are comfortable with all the ingredients used in the recommended meals.
                    </Text>
            </View>
                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>TRAINING</Text>
                </View>
                <View style={styles.desc}>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        The training guides contained within the Plans are pre-set. You will receive details on the exact training routine to follow, including the duration, repetition, range and amount of sets.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        If you wish to carry out your own training in place of or in addition to that which is recommended on the Plan, you do so at your own risk and on your own terms.
                    </Text>

                </View>

                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>CONTACTING EACH OTHER / PLAN SUPPORT</Text>
                </View>
                <View style={styles.desc}>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        If we have to contact you we will do so by writing to you at the email address you provided to us when you signed up to the Plan.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        Josh is on hand to answer queries by email at: info@fitnessvwork.com. Please wait 7 days for a response to your email.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        If you have any questions or complaints about the Plan, please contact us at: info@fitnessvwork.com.
                    </Text>

                </View>

                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>MATERIAL WE PROVIDE</Text>
                </View>
                <View style={styles.desc}>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        We are the owner and the licensor of all intellectual property rights in FitnessvWork and the Plan.  These works are protected by copyright laws and treaties around the world. All such rights are reserved.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        You must not use the Plan other than your personal fitness and nutrition.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        You must not share or distribute any part of the content of the Plan for any purpose. If you are found to have distributed the content of the Plan in breach of these terms, your Plan will be cancelled and appropriate further action may be taken against you.
                    </Text>

                </View>


                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>INFORMATION YOU PROVIDE US</Text>
                </View>
                <View style={styles.desc}>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        We will keep your confidential information private.  We will take all reasonable precautions to ensure that all such information is stored securely and kept confidential.

                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        For information on how we will use your personal data, please see our Privacy Policy on our website.

                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        We may ask for your permission to publish your transformation photos. We will always do this in writing. If you provide us with your written consent to publish your photos, you give us the right to make reasonable use of them, including for our future marketing of the Plan to prospective users. Once you have given consent to publication, if you subsequently withdraw that consent, we will endeavor to take the practical steps to honour this, however in some cases it may not be reasonable or practical for us to do so.

                    </Text>

                </View>

                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>PROVIDING THE PLAN
                    </Text>
                </View>
                <View style={styles.desc}>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        By signing up to the Plan, you confirm that you are in good physical condition and know of no medical or other reason why you should not engage in any form of exercise.
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:10}]}>
                        We may refuse to sell a Plan for medical reasons.  Our policy is that we will not provide fitness or nutrition plans if, by way of example, you are suffering an illness, injury or condition, including but not limited to:

                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( a ) Cancer;
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( b ) HIV/AIDS;
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( c ) Heart, lung, liver, kidney or other organ disease;
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( d ) Anorexia;
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( e ) Bulimia.
                    </Text>

                    <Text  style={[styles.policyDesc,{paddingVertical:10}]}>Our Plans are not appropriate for pregnant women, children under 18 or adults over 65, or anyone who has had a gastric band fitted.</Text>
                    <Text  style={[styles.policyDesc,{paddingVertical:10}]}>We may need certain information from you so that we can supply the Plan to you. If you do not give us this information within a reasonable time of us asking for it, or if you give us incomplete or incorrect information, we may either end the contract or make an additional charge of a reasonable sum to compensate us for any extra work that is required as a result. We will not be responsible for supplying the Plan late or not supplying any part of it if this is caused by you not giving us the information we need within a reasonable time of us asking for it.</Text>
                </View>
                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>YOUR USE OF THE PLAN</Text>
                    <Text  style={[styles.policyDesc,{paddingVertical:10}]}>When accessing the Plan via the FitnessvWork app, you can only log in on one device at any one time. Please contact us if you require access to the app on multiple devices.</Text>
                    <Text  style={[styles.policyDesc,{paddingVertical:10}]}>At the end of the Plan period, you will lose your access to all material Plan material available on the FitnessvWork app.</Text>
                </View>

                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>SUSPENDING THE PLAN</Text>
                    <Text  style={[styles.policyDesc,{paddingVertical:10}]}>Reasons we may suspend the supply of the Plan to you. We may have to suspend the supply of a Plan or part of a Plan, workout or recipe to:
                    </Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( a ) deal with technical problems or make minor technical changes; or
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( b ) update the Plan to reflect changes in relevant laws and regulatory requirements; or
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( c ) make changes to the Plan as requested by you or notified by us to you.
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:10}]}>We will contact you in advance to tell you we will be suspending supply of the Plan, unless the problem is urgent or an emergency. If we have to suspend the provision of the Plan for longer than one week in any 8-week period, we will adjust the price so that you do not pay for Plan while it is suspended.</Text>
                    <Text style={[styles.policyDesc,{paddingVertical:10}]}>You may contact us to end the contract for a Plan if we suspend it, or if we tell you we are going to suspend it, in each case for a period of more than two weeks and we will refund any sums you have paid in advance for the Plan in respect of any 'unspent' weeks on the Plan at that point.
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:10}]}>If you do not make payment for the Plan on time, we may suspend supply of any elements of the Plan until you have paid us the outstanding amounts. We will contact you to tell you we are suspending supply. We will not charge you for the Plan during the period for which it is suspended.
                    </Text>
                </View>
                <View style={{padding:15,top:10}}>
                    <Text style={styles.fitnessTitle}>YOUR RIGHTS TO END THE CONTRACT</Text>
                    <Text
                        style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( a ) You have the right to end the contact in certain circumstances.  However, these are subject to certain important exclusions, which are set out below:We do not offer refunds after purchase date if you have changed your mind about the Plan.
                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( b ) If you want to end the contract because of something we have done or have told you we are going to do, see clause 9.2;

                    </Text>
                    <Text style={[styles.policyDesc,{paddingVertical:4}]}>
                        ( c ) If you are ill or injured and cannot complete a Plan, you may be able to get a full or partial refund upon our receipt of a valid medical report from your GP. This is not an automatic right, and will be offered in our absolute discretion.
                    </Text>
                    
                    </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
})

const styles = StyleSheet.create({
    fitnessTitle:
        {
            color:COLORS.lightBlue,
            fontSize:16,
            lineHeight:20,
            fontWeight:"700",
        },
    desc:{
        paddingRight:15,
        paddingLeft:15
    },
    policyDesc:{
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'left',
        color: COLORS.grey_3,
        fontFamily:"Manrope",
        lineHeight:22
    },
    dateTitle:{
        flexDirection:"row",
        padding:15
    }
})
export default PrivacyPolicy;
