import {combineReducers} from 'redux';
import {sendOtp} from './SendOtp';
import {profileReducer} from './ProfileReducer'
import {authReducer} from "./AuthReducer";
import {fitbitReducer} from './FitbitReducer';
import { questReducer } from './QuestionnaireReducer';
import { foodReducer } from './FoodReducer';
import { workoutReducer } from './WorkoutReducer';
import { CommunityReducer } from './CommunityReducer';
import { membershipReducer } from './MembershipReducer';
import { commonReducer } from './CommonReducer';
import { graphDataReducer } from './GraphDataReducer';

const rootReducer = combineReducers({
  sendOtp,
  profileReducer,
  graphDataReducer,
  authReducer,
  commonReducer,
  fitbitReducer,
  questReducer,
  membershipReducer,
  food: foodReducer,
  workout: workoutReducer,
  community:CommunityReducer


});
export default rootReducer;
