import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {AppButton, COLORS} from '../../common/Constant';
import {BackArrowIcon} from '../../Svg';
import {hasNotch} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
import RadioButton from '../../components/RadioButton';
import {usersService} from '../../services/ApiServices';
import {useDispatch, useSelector} from 'react-redux';
import {getWorkoutProgramme} from '../../_action/WorkoutAction';
import {getProfileAction} from '../../_action/ProfileAction';
const {height} = Dimensions.get('window');

const PhaseCompleteScreen = React.memo(route => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phase, setPhase] = useState(0);
  const data = useSelector(
    state => state?.workout?.workoutProgramme?.data?.data?.responseData?.result,
  );
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  
  useEffect(() => {
    dispatch(getWorkoutProgramme());
    dispatch(getProfileAction());
  }, [navigation]);

  const onContinue = async () => {
    if (phase === 0) {
      try {
        var param = {
          programmeId: getProfileData?.workoutProgrammeId,
        };
        const res = await usersService.setMyWorkoutProgrammes(param);
        if (res.data.statusCode === 1) {
          dispatch(getWorkoutProgramme());
          dispatch(getProfileAction());
          navigation.navigate('Workout');
        }
      } catch (error) {
        console.error('error ', error);
      }
    } else if (phase === 1) {
      navigation.navigate('Workouts');
    }
  };

  return (
    <View style={styles.bgPhase}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            borderColor: 'white',
            paddingVertical: 5,
            paddingHorizontal: 5,
            width: 30,
            height: 30,
            borderRadius: 20,
            backgroundColor: COLORS.white,
          }}>
          <BackArrowIcon color={'black'} />
        </TouchableOpacity>
      </View>
      {route?.route?.params?.isChallenge == 1 ? (
        <View style={{padding: 15, marginTop: 15}}>
          <Text
            style={{fontSize: 18, fontFamily: 'Manrope-bold', width: '100%'}}>
            Congratulations! you are completed your 60 days challenge
          </Text>
        </View>
      ) : (
        <View style={{padding: 15, marginTop: 15}}>
          <Text
            style={{fontSize: 18, fontFamily: 'Manrope-bold', width: '90%'}}>
            You completed {getProfileData?.duration} Week {data?.programmeName}{' '}
            Challenge
          </Text>
        </View>
      )}

      <View style={{padding: 15, marginTop: 15}}>
        {route?.route?.params?.isChallenge == 1 ? null : (
          <View style={{backgroundColor: COLORS.white, padding: 20}}>
            <RadioButton
              name={`Continue with ${getProfileData?.duration} Week ${data?.title} program`}
              style={styles.radioButtonStyle}
              onSelect={() => setPhase(0)}
              selected={phase === 0}
            />
          </View>
        )}
        <View
          style={{backgroundColor: COLORS.white, padding: 20, marginTop: 15}}>
          <RadioButton
            name="Change your program"
            style={styles.radioButtonStyle}
            onSelect={() => setPhase(1)}
            selected={phase === 1}
          />
        </View>
      </View>
      <View style={{marginTop: height * 0.315}}>
        <AppButton title="Continue" onPress={onContinue} />
      </View>
    </View>
  );
});
export default PhaseCompleteScreen;

const styles = StyleSheet.create({
  bgPhase: {
    flex: 1,
    backgroundColor: COLORS.light_grey,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: hasNotch() ? 80 : 70,
    paddingHorizontal: 15,
  },
  radioButtonStyle: {
    width: '80%',
    marginLeft: '3%',
  },
});
