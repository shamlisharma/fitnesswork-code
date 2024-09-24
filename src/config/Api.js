import settings, { envV2 } from "./settings";
import setting from "./settings";

export default (() => {
  return {
    // AUTH: 'Basic Zml0bmVzc3Z3b3JrOmZpdG5lc3N2d29yaw==',   //dEV
    AUTH: "Basic Zml0bmVzc3Z3b3JrOmZpdG5lc3N2d29yaw==",
    USER_SEND_OTP: setting.api.url + "user/send-otp",
    USER_VERIFY_OTP: setting.api.url + "user/verify-otp",
    USER_SIGNUP: setting.api.url + "user/signup",
    USER_SIGNIN: setting.api.url + "user/login",
    USER_GET_PROFILE: setting.api.url + "user/profile",
    USER_EDIT_PROFILE: setting.api.url + "user/profile/edit",
    USER_EDIT_PROFILE1: setting.api.url + "user/updateUserWeek",
    CHANGE_PASSWORD: setting.api.url + "user/change-password",
    GET_INGREDIENT: setting.api.url + "food/searchIngredients",
    FORGOT_PASSWORD: setting.api.url + "user/forgot/password",
    RESET_PASSWORD: setting.api.url + "user/reset/password",
    MEMBERSHIP_GET_PLAN: setting.api.url + "membership/allPlansByUser",
    USER_LOGOUT: setting.api.url + "user/logout",
    USER_DELETE_ACCOUNT: setting.api.url + "user/removeUser",
    QUESTIONNAIRE_DATA: setting.api.url + "user/add/questionnaire",
    SAVE_ACTIVITY_INFO: setting.api.url + "device/saveActivityData",
    GET_ACTIVITY_INFO: setting.api.url + "device/getActivityData",
    SAVE_FCM_TOKEN: setting.api.url + "user/updateDeviceToken",
    FITBIT_INFO: setting.api.url + "device/saveFitbitDeviceInfo",
    NOTIFICATION_SETTINGS: setting.api.url + "user/updateNotification",
    GET_NOTIFICATION: setting.api.url + "user/getNotification",
    CONTACT_US: setting.api.url + "user/contact-us",
    GET_QUEST: setting.api.url + "user/getQuestionnaireData",
    IN_APP_PURCHASE: setting.api.url + "payment/savePaymentInfo",
    GET_DAILY_FOOD_TARGET: setting.api.url + "user/getDailyFoodTarget",
    SET_DAILY_FOOD_TARGET: setting.api.url + "user/setDailyFoodTarget",
    GET_FOOD_PREFERENCES: setting.api.url + "user/getFoodPreferences",
    UPDATE_FOOD_PREFERENCES: setting.api.url + "user/updateFoodPreferences",
    GET_MEAL_PLAN_BY_USER: setting.api.url + "food/getMealPlansByUser",
    GET_MEAL_NEW_PLAN_BY_USER: setting.api.url + "food/getNewMealPlansByUser",
    GET_DAILY_FOOD_PLAN: setting.api.url + "user/getDailyFoodPlan",
    UPDATE_DAILY_FOOD_PLAN: setting.api.url + "user/addDailyFoodPlan",
    REMOVE_DAILY_FOOD_PLAN: setting.api.url + "user/removeDailyFoodPlan",
    GET_FOOD_PLAN_BY_USER: setting.api.url + "food/getFoodPlansByUser",
    GET_MEAL_PLAN_BY_ID: setting.api.url + "food/getMealPlansByFoodId",
    ADD_FOOD_PLAN: setting.api.url + "food/addFoodPlanByUser",
    ADD_MEAL_TO_FAVOURITE: setting.api.url + "user/addToFavourite",
    REMOVE_MEAL_FROM_FAVOURITE: setting.api.url + "user/removeFromFavourite",
    SET_MY_WORKOUT_PROGRAMME: setting.api.url + "workout/setMyWorkoutProgramme",
    SET_MY_WORKOUT_PROGRAMME: setting.api.url + "workout/setMyWorkoutProgramme",
    CHECK_IN_DATA: setting.api.url + "tracker/saveCheckInData",
    ADD_WORKOUT_HISTORY: settings.api.url + "workout/add-workout-history",
    GET_WORKOUT_PROGRAMMES: setting.api.url + "workout/getAllWorkoutProgrammes",
    GET_WORKOUT_PROGRAMMESNEW: setting.api.url + "workout/getWorkoutprogrammes",
    GET_SIMILAR_WORKOUT_PROGRAMMES:
      setting.api.url + "workout/getAllExercises?search=&page=1&limit=20",
    GET_ALL_EQUIPMENTS: setting.api.url + "workout/getAllEquipments",
    GET_WORKOUTS_LIST: setting.api.url + "workout/getAllWorkoutsByUser",
    GET_ALL_WORKOUTS_LIST: setting.api.url + "workout/getAllWorkouts",
    GET_USER_WORKOUT_PROGRAMME: setting.api.url + "workout/getDailyWorkouts",
    GET_EXCERCISE_BY_WORKOUT_ID:
      setting.api.url + "workout/getAllWorkoutsByUser",
    GET_WORKOUT_BY_ID: setting.api.url + "workout/getExerciseByWorkoutId",
    GET_WORKOUT_SCORES: setting.api.url + "workout/workout-score",
    GET_WORKOUT_NOTES: setting.api.url + "workout/workout-notes",
    SAVE_EXERCISE_STATISTICS:
      setting.api.url + "workout/saveExerciseStatistics",
    SAVE_MILESTONE_TRACKER_DATA:
      setting.api.url + "tracker/saveMilestoneTrackerData",
    GET_MILESTONE_TRACKER_DATA:
      setting.api.url + "tracker/getMilestoneTrackerData",
    DELETE_MILESTONE_TRACKER_DATA:
      setting.api.url + "tracker/deleteMilestoneTrackerData",
    DELETE_MESUREMENT_TRACKER_DATA:
      setting.api.url + "tracker/deleteMesurementTrackerData",
    ADD_WORKOUT_MY_FAVOURITE:
      setting.api.url + "workout/addWorkoutInMyFavourite",
    GET_FEED_BY_USER: setting.api.url + "feed/getArticleListByUser",
    ADD_LIKE: setting.api.url + "feed/addLike",
    GET_LEARN: setting.api.url + "learn/getAllTips",
    GET_CHAT_BY_USER: setting.api.url + "group/inbox",
    GET_CHAT_HISTORY: setting.api.url + "message/chatHistory",
    CHAT_FILE_UPLOAD: setting.api.url + "message/uploadFile",
    GET_LEADERBOARD_DATA: setting.api.url + "device/getLeaderboardData",
    ADD_COMMENT: setting.api.url + "feed/addComment",
    GET_COMMENT: setting.api.url + "feed/getComments",
    FEED_SHARE_COMMUNITY: setting.api.url + "feed/shareViaCommunity",
    GET_USER_LIST: setting.api.url + "user/getUserList",
    ADD_FRIEND: setting.api.url + "user/addFriend",
    SAVE_MESUREMENT_TRACKER_DATA:
      setting.api.url + "tracker/saveMesurementTrackerData",
    GET_MESURMENT_TRACKER_DATA:
      setting.api.url + "tracker/getMesurementTrackerData",
    DELETE_MESURMENT_TRACKER_DATA:
      setting.api.url + "tracker/deleteMesurementTrackerData",
    GET_CHECKIN_DATA_BY_USERID:
      setting.api.url + "tracker/getCheckinDataByUserId",
    SET_FITNESS_GOAL: setting.api.url + "user/setStepsAndSleepGoal",
    TRACKER_GET_CHECKIN: setting.api.url + "tracker/getCheckInData",
    GET_TRACKER_MILESTONE_EXERCISE:
      setting.api.url + "tracker/getMilestoneExercise",
    UPDATE_DIET: setting.api.url + "user/updateMyDiet",
    LEARN_CATEGORY: setting.api.url + "category/getAll",
    UPDATE_WORKOUT_GOAL: setting.api.url + "user/updateWorkoutGoal",
    WORKOUT_EXERCISE_NOTES: setting.api.url + "workout/add-Exercise-notes",
    ADD_WORKOUT_SCORE: setting.api.url + "workout/add-workout-score",
    // ADD_WORKOUT_HISTORY: settings.api.url+'workout/add-workout-history',
    SET_USER_REMINDER: setting.api.url + "user/notification-reminder",
    GET_USER_REMINDER: setting.api.url + "user/getNotification-reminder",
    DAILY_CONTENT_TODAY: setting.api.url + "dailyContent/today",
    EXERCISE_FILTER:
      setting.api.url + "workout/getWorkoutProgrammes?dayFilter=",
    GET_WORKOUT_HISTORY: setting.api.url + "workout/workout-history",
    VALIDATE_PAYMENT: setting.api.url + "payment/getSubscriptionStatus/",
    GET_EXERCISE_CATEGORY:
      setting.api.url + "/workout/get-exercise-by-category/",
    CREATE_SUBSCRIPTION_RECEIPT:
      setting.api.url + "payment/createSubscriptionReceipt",
    GET_SUBSCRIPTION_RECEIPT:
      setting.api.url + "payment/getSubscriptionReceipt/",
    SET_WORKOUT_HISTORY_BY_WORKOUT_ID:
    envV2.apiV2.url+"workoutHistory/createWorkoutHistory",
    GET_WORKOUT_HISTORY_BY_WORKOUT_ID:
    envV2.apiV2.url+"workoutHistory/getWorkoutHistory/",
    CREATE_WORKOUT_PROGRAM_HISTORY:
    envV2.apiV2.url+"workoutProgrammeHistory/createWorkoutHistory",
    UPDATE_WORKOUT_PROGRAM_HISTORY:
    envV2.apiV2.url+"workoutProgrammeHistory/updateWorkoutHistory",
    GET_WORKOUT_PROGRAM_HISTORY:
    envV2.apiV2.url+"workoutProgrammeHistory/getWorkoutHistory/"
  };
})();
