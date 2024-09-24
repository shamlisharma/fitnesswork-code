import React, {useState, useEffect} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector, connect} from 'react-redux';
import {COLORS} from '../../common/Constant';
import InlineError from '../../common/InlineError';
import CustomModal from '../../components/CustomModal';
import GradientButton from '../../components/GradientButton';
import {usersService} from '../../services/ApiServices';
import {setFitnessTarget} from '../../_action/FoodAction';
import {getProfileAction} from '../../_action/ProfileAction';
import {getWorkoutProgramme} from '../../_action/WorkoutAction';

const UpdateWorkoutModal = React.memo(props => {
  const dispatch = useDispatch();
  const {visible, onRequestClose, setModalVisible} = props;
  const [workoutTarget, setWorkoutTarget] = useState();

  const onUpdate = async () => {
    let request = {
      goal: parseInt(workoutTarget),
    };
    const res = await usersService.workoutGoalUpdate(request);
    if (res?.data?.statusCode === 1) {
      dispatch(getWorkoutProgramme());
      if (res?.data?.statusCode === 1) {
        dispatch(getProfileAction());
      }
    }
    setModalVisible(false);
  };

  const handleNumbers = (text, actualValue) => {
    let prevText = actualValue;
    const regex = /^[0-9]*$/;
    if (regex.test(text)) {
      return text;
    }
    return prevText;
  };

  const handleValueChange = async text => {
    let handleValueData = await handleNumbers(text, workoutTarget);
    setWorkoutTarget(handleValueData);
  };

  useEffect(() => {
    setWorkoutTarget(props?.weekGoalData || '');
  }, [props?.goalData?.weekGoal]);

  // console.log('workout target---', props);

  return (
    <CustomModal
      visible={visible}
      onRequestClose={onRequestClose}
      modalTitle={'Your Goal'}>
      <View style={{paddingVertical: 10}}>
        <Text style={styles.textStyle}>Goal</Text>
        <TextInput
          onChangeText={text => handleValueChange(text)}
          maxLength={5}
          value={`${workoutTarget}`}
          placeholder={'Enter your goal'}
          keyboardType="number-pad"
          style={styles.textInputStyle}
        />
      </View>
      <View style={styles.buttonContainer}>
        <GradientButton title="Update" onPress={onUpdate} />
      </View>
    </CustomModal>
  );
});
const mapStateToProps = state => {
  return {
    goalData:
      state?.workout?.workoutProgramme?.data?.data?.responseData
        ?.userWorkoutInfo,
  };
};
export default connect(mapStateToProps)(UpdateWorkoutModal);

const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
    paddingLeft: 5,
    paddingVertical: 3,
    fontSize: 16,
    marginHorizontal: 4,
    fontFamily: 'Manrope-Medium',
    color: 'black',
  },
  textStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: COLORS.grey_2,
    marginHorizontal: 10,
  },

  buttonContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
});
