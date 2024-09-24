import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import Header from '../../components/header/Header';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import TipsCard from '../../components/TipsCard';

let Help = React.memo(function Help() {
  const navigation = useNavigation();
  return (
    <MainScreen>
      <Header 
        title="Help" 
        onPress={() => navigation.goBack()} 
        status="drawer" 
      />
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 10}}>
        <View style={{padding: 10, paddingLeft: 0}}>
          <Text style={styles.fitnessTitle}>About Fitnessvwork</Text>
        </View>

        <TipsCard
          title={'How do I change my goal?'}
          textContent={
            <Text>
              You can change your goal by clicking on questionnaire{' '}
              <Pressable onPress={() => navigation.navigate('Questionnaire')}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                section
                </Text>
              </Pressable>
            </Text>
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'What is the “tracker” about?'}
          textContent={
            'Itʼs where you log your progress. The tracker will allow you to move across phases. If you are a premium user, this is the data I will use to communicate with you weekly.'
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'How do I get support with my training?'}
          textContent={
            <Text>
              I have added tips on the workout{' '}
              <Pressable
                onPress={() =>
                  navigation.navigate('Workout tips', {title: 'Workout tips'})
                }>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                section
                </Text>
              </Pressable>
              you can also see additional support videos via the learn{'  '}
              <Pressable onPress={() =>{ 
                navigation.navigate('CommunityTab');
                setTimeout(() => {
                  navigation.navigate('Learn')
                },500)
                
                // navigation.navigate('CommunityTab', {
                //   screen: 'CommunityTab',
                //   params: {screen: 'Learn'},
                // })
                
                }}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                  section
                </Text>
              </Pressable>
              If you need further support and you not a premium user, you can
              {' '}
              <Pressable onPress={() => navigation.navigate('Membership')}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                  upgrade
                </Text>
              </Pressable>
              .
            </Text>
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'How do I get support with my nutrition?'}
          textContent={
            <Text>
              I have added tips on the nutrition section{' '}
              <Pressable
                onPress={() =>
                  navigation.navigate('Food tips', {title: 'Food tips'})
                }>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                  food tips,
                </Text>
              </Pressable>
            you can also see additional support videos on the learn {'   '}  
              <Pressable onPress={() => {
                  navigation.navigate('CommunityTab');
                  setTimeout(() => {
                    navigation.navigate('Learn')
                  },500)
              }}>
                <Text style={[styles.aboutDesc, styles.linkDesc, {paddingHorizontal: 0}]}>
                section
                </Text>
              </Pressable>
               If you need further support
              and you not a premium user, you can {' '}
              <Pressable onPress={() => navigation.navigate('Membership')}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                upgrade
                </Text>
              </Pressable>
              .
            </Text>
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'What is the difference between the phases on the programme?'}
          textContent={
            'Not much, just the exercises and the reps you need to complete for each.'
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'I donʼt think my calories are right?'}
          textContent={
            <Text>
              Firstly, make sure your food measurements are accurate. You can
              also change your info via the questionnaire{'  '}
              <Pressable onPress={() => navigation.navigate('Questionnaire')}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                  here
                </Text>
              </Pressable>
              , which will update your calories.
            </Text>
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <View style={{padding: 10, paddingLeft: 0}}>
          <Text style={styles.fitnessTitle}>My account</Text>
        </View>

        <TipsCard
          title={'I have a technical issue, how do I report this?'}
          textContent={
            <Text>
              Please report your issue{' '}
              <Pressable onPress={() => navigation.navigate('Contact')}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>here</Text>
              </Pressable>
              , I will be in touch shortly.
            </Text>
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'Can I access the programme on multiple devices?'}
          textContent={
            'No just the one device. If you want to change device, contact me.'
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />

        <TipsCard
          title={'Can I upgrade from standard to premium?'}
          textContent={
            <Text>
              You can, just click{' '}
              <Pressable onPress={() => navigation.navigate('Membership')}>
                <Text style={[styles.aboutDesc, styles.linkDesc]}>
                  here
                </Text>
              </Pressable>
            </Text>
          }
          backgroundColor={COLORS.light_grey}
          textContentColor={COLORS.grey_3}
          titleColor={COLORS.grey_2}
          dropdownIconColor={COLORS.lightGrey}
        />
      </ScrollView>
    </MainScreen>
  );
})
const styles = StyleSheet.create({
  fitnessTitle: {
    color: COLORS.lightBlue,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  aboutView: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    color: COLORS.grey_2,
  },
  aboutDesc: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    color: COLORS.grey_3,
    paddingHorizontal: 5,
  },
  helpTitles: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    color: COLORS.grey_2,
    width: '90%',
  },
  linkDesc: {
    textDecorationLine: 'underline',
    color: COLORS.lightGreen,
    alignItems: 'center',
    top: Platform.OS === 'android' ? 4 : 2,
  },
});

export default Help;
