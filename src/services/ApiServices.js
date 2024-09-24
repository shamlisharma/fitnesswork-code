import axios from "axios";
import Api from "../config/Api";
import * as Platform from "react-native";
import { isLoggedIn } from "../common/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usersService = {
  sendOtp,
  verifyOtp,
  signup,
  signin,
  getProfile,
  changePassword,
  getExerciseFilter,
  editUserProfile,
  editUserProfile1,
  getIngredientList,
  forgotPassword,
  resetPassword,
  memberShipGetPlan,
  logout,
  questionnaire,
  saveActivityInfo,
  getActivityInfo,
  saveFcmToken,
  fitbitInfo,
  notification,
  contactUs,
  getQuestionnaire,
  inAppPurchase,
  getDailyFoodTarget,
  setDailyFoodTarget,
  getFoodPreferences,
  updateFoodPreferences,
  getMealPlanByUser,
  getNewMealPlanByUser,
  getDailyFoodPlan,
  updateDailyFoodplan,
  removeDailyFoodPlan,
  getFoodPlanByUser,
  getMealPlanById,
  addFoodPlan,
  addMealPlanToFavourite,
  removeMealPlanFromFavourite,
  getNotification,
  getWorkoutProgrammes,
  setMyWorkoutProgrammes,
  checkInService,
  getAllEquipments,
  getWorkouts,
  getUserWorkout,
  getExerciseByWorkoutId,
  saveExerciseStatistics,
  getMilestoneTrackerData,
  saveMilestoneTrackerData,
  deleteMilestoneTrackerData,
  getWorkoutById,
  addWorkoutInFavourite,
  getFeedByUser,
  addLike,
  getLearn,
  getChatByUser,
  chatFileUpload,
  chatHistory,
  getLeaderBoardData,
  addComment,
  getComment,
  feedShare,
  userList,
  addFriend,
  saveMesurementTrackerData,
  getMeasurementTrackerData,
  deleteMesurementData,
  fitnessGoal,
  getCheckinData,
  getMilestoneExercise,
  updateDiet,
  getLearnCategory,
  workoutGoalUpdate,
  workoutExecrciseNotes,
  deleteUser,
  addWorkoutScore,
  getAllSimilarExercise,
  getWorkoutNotes,
  getWorkoutScores,
  getWorkoutProgrammesNew,
  getAllWorkoutsList,
  setUserReminder,
  getUserReminder,
  getDailyContentToday,
  addWorkoutHistory,
  getWorkoutHistory,
  validatePayment,
  getExerciseCategory,
  createSubscriptionReceipt,
  getSubscriptionReceipt,
  getWorkoutHistoryByWorkoutId,
  setWorkoutHistoryByWorkoutId,
  createWorkoutProgramHistory,
  updateWorkoutProgramHistory,
  getWorkoutProgramHistory
};

const headersApplicationJson = {
  "Content-Type": "multipart/form-data",
};

let accessToken = AsyncStorage.getItem("accessToken"),
  AuthToken = "Bearer " + accessToken;
console.log({ accessToken });
axios.defaults.headers.common.Authorization = `${Api.AUTH}`;
axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
axios.defaults.headers.common["AccessToken"] = isLoggedIn() ? accessToken : "";

axios.interceptors.request.use((config) => {
  config.headers.platform =
    Platform.OS === "ios" ? 1 : 0 || Platform.OS === "android" ? 2 : 0;
  return config;
});

function sendOtp(params) {
  return axios.post(Api.USER_SEND_OTP, params, {});
}

function verifyOtp(params) {
  return axios.post(Api.USER_VERIFY_OTP, params, {});
}

function signup(params) {
  return axios.post(Api.USER_SIGNUP, params, {});
}

function signin(params) {
  console.log("Login Clicked", Api.USER_SIGNIN, params);
  return axios.post(Api.USER_SIGNIN, params, {});
}

async function getProfile(params) {
  return axios.get(Api.USER_GET_PROFILE, {
    headers: {
      ...headersApplicationJson,
      AccessToken: await AsyncStorage.getItem("accessToken"),
    },
  });
}
async function editUserProfile(params) {
  return axios.post(Api.USER_EDIT_PROFILE, params, {
    header: headersApplicationJson,
    AccessToken: await AsyncStorage.getItem("accessToken"),
  });
}
async function editUserProfile1(params) {
  return axios.post(Api.USER_EDIT_PROFILE1, params, {
    header: headersApplicationJson,
    AccessToken: await AsyncStorage.getItem("accessToken"),
  });
}


function getExerciseFilter(params) {
  console.log(Api.EXERCISE_FILTER + params);
  return axios.get(Api.EXERCISE_FILTER + params);
}
function changePassword(params) {
  return axios.post(Api.CHANGE_PASSWORD, params, {});
}

function getIngredientList(params) {
  return axios.post(Api.GET_INGREDIENT, params, {});
}

function forgotPassword(params) {
  return axios.post(Api.FORGOT_PASSWORD, params, {});
}

function resetPassword(params) {
  return axios.post(Api.RESET_PASSWORD, params, {});
}

function memberShipGetPlan(params) {
  return axios.post(Api.MEMBERSHIP_GET_PLAN, params, {});
}
function logout(params) {
  return axios.post(Api.USER_LOGOUT, params);
}

function deleteUser(params) {
  return axios.post(Api.USER_DELETE_ACCOUNT, params);
}

function questionnaire(params) {
  return axios.post(Api.QUESTIONNAIRE_DATA, params, {});
}

//validate payment
function validatePayment(subId, purchaseToken) {
  return axios.post(Api.VALIDATE_PAYMENT + `${subId}/${purchaseToken}`);
}
function createSubscriptionReceipt(params) {
  return axios.post(Api.CREATE_SUBSCRIPTION_RECEIPT, params, {});
}
function getSubscriptionReceipt(userId) {
  return axios.get(Api.GET_SUBSCRIPTION_RECEIPT + `${userId}`);
}

//  health data services

function saveActivityInfo(params) {
  return axios.post(Api.SAVE_ACTIVITY_INFO, params, {});
}
function getActivityInfo(params) {
  return axios.get(
    `${Api.GET_ACTIVITY_INFO}/${params.deviceId}/${params.day}`,
    params,
    {}
  );
}

function saveFcmToken(params) {
  return axios.post(Api.SAVE_FCM_TOKEN, params, {});
}

function fitbitInfo(params) {
  return axios.post(Api.FITBIT_INFO, params, {});
}
function notification(params) {
  return axios.post(Api.NOTIFICATION_SETTINGS, params, {});
}
function contactUs(params) {
  return axios.post(Api.CONTACT_US, params, {});
}
function getQuestionnaire(params) {
  return axios.get(Api.GET_QUEST, params, {});
}

function inAppPurchase(params) {
  return axios.post(Api.IN_APP_PURCHASE, params, {});
}

// daily food target services

function getDailyFoodTarget(params) {
  return axios.get(Api.GET_DAILY_FOOD_TARGET, params);
}

function setDailyFoodTarget(params) {
  return axios.post(Api.SET_DAILY_FOOD_TARGET, params);
}
function setUserReminder(params) {
  return axios.post(Api.SET_USER_REMINDER, params);
}
function getUserReminder(params) {
  return axios.get(Api.GET_USER_REMINDER);
}
function updateDiet(params) {
  return axios.post(Api.UPDATE_DIET, params);
}

// food preferences services

function getFoodPreferences(params) {
  return axios.get(Api.GET_FOOD_PREFERENCES, params);
}

function updateFoodPreferences(params) {
  return axios.post(Api.UPDATE_FOOD_PREFERENCES, params);
}

// meal plan services
function getMealPlanByUser(params) {
  //console.log("user food details url",Api.GET_MEAL_PLAN_BY_USER,params)
  return axios.get(Api.GET_MEAL_PLAN_BY_USER, { params: { ...params } });
}

function getNewMealPlanByUser(params) {
  console.log("getNewMealPlanByUser url", Api.GET_MEAL_NEW_PLAN_BY_USER);
  return axios.post(Api.GET_MEAL_NEW_PLAN_BY_USER, params);
}

function getMealPlanById(params) {
  return axios.get(`${Api.GET_MEAL_PLAN_BY_ID}/${params.foodId}`, params, {});
}

//food plan services
function getDailyFoodPlan(params) {
  return axios.get(Api.GET_DAILY_FOOD_PLAN, params);
}

function removeDailyFoodPlan(params) {
  return axios.delete(
    `${Api.REMOVE_DAILY_FOOD_PLAN}/${params.foodId}/${params.category}`
  );
}

function updateDailyFoodplan(params) {
  return axios.post(Api.UPDATE_DAILY_FOOD_PLAN, params);
}

function getFoodPlanByUser(params) {
  return axios.get(Api.GET_FOOD_PLAN_BY_USER, { params });
}

function addFoodPlan(params) {
  return axios.post(Api.ADD_FOOD_PLAN, params);
}

//favourite meal plans

function addMealPlanToFavourite(params) {
  return axios.post(Api.ADD_MEAL_TO_FAVOURITE, params);
}

function removeMealPlanFromFavourite(params) {
  return axios.delete(
    `${Api.REMOVE_MEAL_FROM_FAVOURITE}/${params.mealId}`,
    params
  );
}
function getNotification(params) {
  return axios.get(Api.GET_NOTIFICATION, params);
}

export function refreshToken() {
  axios.defaults.headers.common["AccessToken"] = isLoggedIn()
    ? accessToken
    : "";
  return "";
}

// Workout

function getWorkoutProgrammes(params) {
  return axios.get(Api.GET_WORKOUT_PROGRAMMES, { params: { ...params } });
}
function getWorkoutProgrammesNew(params) {
  return axios.get(Api.GET_WORKOUT_PROGRAMMESNEW, { params: { ...params } });
}

function setMyWorkoutProgrammes(params) {
  return axios.post(Api.SET_MY_WORKOUT_PROGRAMME, params);
}

function getUserWorkout() {
  return axios.get(Api.GET_USER_WORKOUT_PROGRAMME, {});
}

// Tracking

function checkInService(params) {
  console.log("api got hit with param==", params);
  return axios.post(Api.CHECK_IN_DATA, params);
}

//Equipments

function getAllEquipments() {
  return axios.get(Api.GET_ALL_EQUIPMENTS);
}
function getAllSimilarExercise(exerciseId) {
  return axios.get(
    `${Api.GET_SIMILAR_WORKOUT_PROGRAMMES}&exerciseId=${exerciseId}`
  );
}
function getWorkoutNotes(exerciseId) {
  return axios.get(`${Api.GET_WORKOUT_NOTES}?exerciseId=${exerciseId}`);
}
function getWorkoutScores(exerciseId) {
  return axios.get(`${Api.GET_WORKOUT_SCORES}?exerciseId=${exerciseId}`);
}

function getWorkouts(params) {
  return axios.get(Api.GET_WORKOUTS_LIST, { params: { ...params } });
}

function getWorkoutHistory(params) {
  console.log(`${Api.GET_WORKOUT_HISTORY}?exerciseId=${params}`);
  return axios.get(`${Api.GET_WORKOUT_HISTORY}?exerciseId=${params}`);
}

//Excercises
function getExerciseByWorkoutId(params) {
  // console.log(Api.GET_EXCERCISE_BY_WORKOUT_ID+"?workoutId"+params, "new url created")

  return axios.get(Api.GET_EXCERCISE_BY_WORKOUT_ID, {
    params: { workoutId: params },
  });
}
function getAllWorkoutsList(params) {
  return axios.get(Api.GET_ALL_WORKOUTS_LIST, {
    params: { workoutId: params },
  });
}

async function getExerciseCategory(params) {
  console.log(Api.GET_EXERCISE_CATEGORY + params);
  return axios.get(`${Api.GET_EXERCISE_CATEGORY + params}`, {
    params: { category: params },
    headers: {
      AccessToken: await AsyncStorage.getItem("accessToken"),
    },
  });
}

async function getWorkoutById(params) {
  return await axios.get(`${Api.GET_WORKOUT_BY_ID}/${params}`);
}

function saveExerciseStatistics(params) {
  console.log("excercise data neerajjjjj====", params);
  return axios.post(Api.SAVE_EXERCISE_STATISTICS, params);
}

//Milestone Tracker
function getMilestoneTrackerData(query) {
  console.log(`${Api.GET_MILESTONE_TRACKER_DATA}?type=1&exerciseId=${query}`);
  return axios.get(
    `${Api.GET_MILESTONE_TRACKER_DATA}?type=1&exerciseId=${query}`,
    { params: query }
  );
}

function getMilestoneExercise(params) {
  return axios.get(Api.GET_TRACKER_MILESTONE_EXERCISE, params);
}

function saveMilestoneTrackerData(params) {
  console.log({ params });
  console.log(Api.SAVE_MILESTONE_TRACKER_DATA);
  return axios.post(Api.SAVE_MILESTONE_TRACKER_DATA, params);
}
function deleteMilestoneTrackerData(params) {
  return axios.delete(Api.DELETE_MILESTONE_TRACKER_DATA, { params: params });
}
function addWorkoutInFavourite(params) {
  return axios.post(Api.ADD_WORKOUT_MY_FAVOURITE, params);
}
function saveMesurementTrackerData(params) {
  return axios.post(Api.SAVE_MESUREMENT_TRACKER_DATA, params);
}
function getMeasurementTrackerData(params) {
  return axios.get(Api.GET_MESURMENT_TRACKER_DATA, { params: params });
}
function deleteMesurementData() {
  return axios.delete(Api.DELETE_MESUREMENT_TRACKER_DATA, params);
}

function getCheckinData(params) {
  return axios.get(
    `${Api.TRACKER_GET_CHECKIN}?programmeId=${params.programmeId}&week=${params.week}`,
    params,
    {}
  );
}

// Community

function getFeedByUser(params) {
  return axios.get(Api.GET_FEED_BY_USER, params);
}
function addLike(params) {
  return axios.post(Api.ADD_LIKE, params);
}
function getLearn(params) {
  return axios.get(Api.GET_LEARN, { params: { ...params } });
}
function getChatByUser(params) {
  return axios.get(Api.GET_CHAT_BY_USER, { params: { ...params } });
}

function chatFileUpload(params) {
  return axios.post(Api.CHAT_FILE_UPLOAD, params);
}
function chatHistory(params) {
  return axios.get(Api.GET_CHAT_HISTORY, { params: { ...params } });
}

// leaderboard

function getLeaderBoardData(params) {
  return axios.get(Api.GET_LEADERBOARD_DATA, params);
}

// comment
function addComment(params) {
  return axios.post(Api.ADD_COMMENT, params);
}
function getComment(params) {
  return axios.get(Api.GET_COMMENT, { params: { ...params } });
}
function feedShare(params) {
  return axios.post(Api.FEED_SHARE_COMMUNITY, params);
}

function userList(params) {
  return axios.post(Api.GET_USER_LIST, params);
}
function addFriend(params) {
  return axios.post(Api.ADD_FRIEND, params);
}

function fitnessGoal(params) {
  return axios.post(Api.SET_FITNESS_GOAL, params);
}

function getLearnCategory(params) {
  return axios.get(Api.LEARN_CATEGORY, params);
}
function workoutGoalUpdate(params) {
  return axios.post(Api.UPDATE_WORKOUT_GOAL, params);
}
function workoutExecrciseNotes(params) {
  return axios.post(Api.WORKOUT_EXERCISE_NOTES, params);
}
function addWorkoutScore(params) {
  return axios.post(Api.ADD_WORKOUT_SCORE, params);
}
function getDailyContentToday(params) {
  console.log("dddd", Api.DAILY_CONTENT_TODAY);
  return axios.get(Api.DAILY_CONTENT_TODAY, params);
}
function getWorkoutHistoryByWorkoutId(params) {
  
  return axios.get(`${Api.GET_WORKOUT_HISTORY_BY_WORKOUT_ID}${params}`);
}
function setWorkoutHistoryByWorkoutId(params) {
  return axios.post(Api.SET_WORKOUT_HISTORY_BY_WORKOUT_ID, params);
}
function createWorkoutProgramHistory(params) {
  return axios.post(Api.CREATE_WORKOUT_PROGRAM_HISTORY, params);
}
function updateWorkoutProgramHistory(params) {
  return axios.put(Api.UPDATE_WORKOUT_PROGRAM_HISTORY, params);
}
function getWorkoutProgramHistory(params) {
  return axios.get(`${Api.GET_WORKOUT_PROGRAM_HISTORY}${params}`);
}
function addWorkoutHistory(params) {
  console.log({params});
  console.log(Api.ADD_WORKOUT_HISTORY);
  return axios.post(Api.ADD_WORKOUT_HISTORY, params);
}
