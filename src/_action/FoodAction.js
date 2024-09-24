import {usersService} from '../services/ApiServices';
import {useNavigation} from '@react-navigation/core';

export const dailyFoodTargetActionTypes = {
  // get daily food target
  GET_DAILY_FOOD_TARGET: 'GET_DAILY_FOOD_TARGET',
  GET_DAILY_FOOD_TARGET_SUCCESS: 'GET_DAILY_FOOD_TARGET_SUCCESS',
  GET_DAILY_FOOD_TARGET_FAILURE: 'GET_DAILY_FOOD_TARGET_FAILURE',

  // set daily food target
  SET_DAILY_FOOD_TARGET: 'SET_DAILY_FOOD_TARGET',
  SET_DAILY_FOOD_TARGET_SUCCESS: 'SET_DAILY_FOOD_TARGET_SUCCESS',
  SET_DAILY_FOOD_TARGET_FAILURE: 'SET_DAILY_FOOD_TARGET_FAILURE',

  SET_FITNESS_TARGET: 'SET_FITNESS_TARGET',
  SET_FITNESS_TARGET_SUCCESS: 'SET_FITNESS_TARGET_SUCCESS',
  SET_FITNESS_TARGET_FAILURE: 'SET_FITNESS_TARGET_FAILURE',
};

export const foodPreferencesActionTypes = {
  // get food preferences
  GET_FOOD_PREFERENCES: 'GET_FOOD_PREFERENCES',
  GET_FOOD_PREFERENCES_SUCCESS: 'GET_FOOD_PREFERENCES_SUCCESS',
  GET_FOOD_PREFERENCES_FAILURE: 'GET_FOOD_PREFERENCES_FAILURE',

  // update food preferences
  UPDATE_FOOD_PREFERENCES: 'UPDATE_FOOD_PREFERENCES',
  UPDATE_FOOD_PREFERENCES_SUCCESS: 'UPDATE_FOOD_PREFERENCES_SUCCESS',
  UPDATE_FOOD_PREFERENCES_FAILURE: 'UPDATE_FOOD_PREFERENCES_FAILURE',
};

export const mealPlanActionType = {
  GET_MEAL_PLAN_BY_USER_REQUEST: 'GET_MEAL_PLAN_BY_USER_REQUEST',
  GET_MEAL_PLAN_BY_USER_SUCCESS: 'GET_MEAL_PLAN_BY_USER_SUCCESS',
  GET_MEAL_PLAN_BY_USER_FAILURE: 'GET_MEAL_PLAN_BY_USER_FAILURE',

  GET_MEAL_PLAN_BY_ID_REQUEST: 'GET_MEAL_PLAN_BY_ID_REQUEST',
  GET_MEAL_PLAN_BY_ID_SUCCESS: 'GET_MEAL_PLAN_BY_ID_SUCCESS',
  GET_MEAL_PLAN_BY_ID_FAILURE: 'GET_MEAL_PLAN_BY_ID_FAILURE',

  SET_FILTER_STATUS: 'SET_FILTER_STATUS',
  SET_SEARCH_STATUS: 'SET_SEARCH_STATUS',
  SET_FAVOURITE_STATUS: 'SET_FAVOURITE_STAUS',

  UPDATE_FILTER_DATA: 'UPDATE_FILTER_DATA',
  RESET_FILTER_DATA: 'RESET_FILTER_DATA',
};

export const dailyFoodPlanType = {
  GET_DAILY_FOOD_PLAN_REQUEST: 'GET_DAILY_FOOD_PLAN_REQUEST',
  GET_DAILY_FOOD_PLAN_SUCCESS: 'GET_DAILY_FOOD_PLAN_SUCCESS',
  GET_DAILY_FOOD_PLAN_FAILURE: 'GET_DAILY_FOOD_PLAN_FAILURE',

  UPDATE_DAILY_FOOD_PLAN_REQUEST: 'UPDATE_DAILY_FOOD_PLAN_REQUEST',
  UPDATE_DAILY_FOOD_PLAN_SUCCESS: 'UPDATE_DAILY_FOOD_PLAN_SUCCESS',
  UPDATE_DAILY_FOOD_PLAN_FAILURE: 'UPDATE_DAILY_FOOD_PLAN_FAILURE',

  REMOVE_DAILY_FOOD_PLAN_REQUEST: 'REMOVE_DAILY_FOOD_PLAN_REQUEST',
  REMOVE_DAILY_FOOD_PLAN_REQUEST_SUCCESS:
    'REMOVE_DAILY_FOOD_PLAN_REQUEST_SUCCESS',
  REMOVE_DAILY_FOOD_PLAN_REQUEST_FAILURE:
    'REMOVE_DAILY_FOOD_PLAN_REQUEST_FAILURE',
};

export const getFoodPlanType = {
  GET_FOOD_PLAN_REQUEST: 'GET_FOOD_PLAN_REQUEST',
  GET_FOOD_PLAN_SUCCESS: 'GET_FOOD_PLAN_SUCCESS',
  GET_FOOD_PLAN_FAILURE: 'GET_FOOD_PLAN_FAILURE',

  SET_FOOD_FILTER_STATUS: 'SET_FOOD_FILTER_STATUS',
  SET_FOOD_SEARCH_STATUS: 'SET_FOOD_SEARCH_STATUS',
  UPDATE_FOOD_FILTER_DATA: 'UPDATE_FOOD_FILTER_DATA',
  RESET_FOOD_FILTER_DATA: 'RESET_FOOD_FILTER_DATA',
};

export const addFoodPlanActionTypes = {
  ADD_FOOD_PLAN: 'ADD_FOOD_PLAN',
  ADD_FOOD_PLAN_SUCCESS: 'ADD_FOOD_PLAN_SUCCESS',
  ADD_FOOD_PLAN_FAILURE: 'ADD_FOOD_PLAN_FAILURE',
};

function initialize(type) {
  return {type: type};
}

function success(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}

function failure(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}

export const getDailyFoodTarget = params => {
  return async dispatch => {
    dispatch(initialize(dailyFoodTargetActionTypes.GET_DAILY_FOOD_TARGET));

    try {
      const response = await usersService.getDailyFoodTarget(params);
      console.log("usersService.getDailyFoodTarget",response);
      dispatch(
        success(
          dailyFoodTargetActionTypes.GET_DAILY_FOOD_TARGET_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      dispatch(
        failure(dailyFoodTargetActionTypes.GET_DAILY_FOOD_TARGET_FAILURE, e),
      );
    }
  };
};

export const setDailyFoodTarget = params => {
  return async dispatch => {
    dispatch(initialize(dailyFoodTargetActionTypes.SET_DAILY_FOOD_TARGET));

    try {
      await usersService.setDailyFoodTarget(params);
      dispatch(
        success(
          dailyFoodTargetActionTypes.SET_DAILY_FOOD_TARGET_SUCCESS,
          params,
        ),
      );
    } catch (e) {
      dispatch(
        failure(dailyFoodTargetActionTypes.SET_DAILY_FOOD_TARGET_FAILURE, e),
      );
    }
  };
};

// Fitness target
export const setFitnessTarget = params => {
  return async dispatch => {
    dispatch(initialize(dailyFoodTargetActionTypes.SET_FITNESS_TARGET));

    try {
      await usersService.fitnessGoal(params);
      dispatch(
        success(dailyFoodTargetActionTypes.SET_FITNESS_TARGET_SUCCESS, params),
      );
    } catch (e) {
      dispatch(
        failure(dailyFoodTargetActionTypes.SET_FITNESS_TARGET_FAILURE, e),
      );
    }
  };
};

export const getFoodPreferences = params => {
  return async dispatch => {
    dispatch(initialize(foodPreferencesActionTypes.GET_FOOD_PREFERENCES));

    try {
      const response = await usersService.getFoodPreferences(params);
      dispatch(
        success(
          foodPreferencesActionTypes.GET_FOOD_PREFERENCES_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      dispatch(
        failure(foodPreferencesActionTypes.GET_FOOD_PREFERENCES_FAILURE, e),
      );
    }
  };
};

export const updateFoodPreferences = params => {
  return async dispatch => {
    dispatch(initialize(foodPreferencesActionTypes.UPDATE_FOOD_PREFERENCES));

    try {
      const res = await usersService.updateFoodPreferences(params);
      if (res.data.statusCode === 1)
        dispatch(
          success(
            foodPreferencesActionTypes.UPDATE_FOOD_PREFERENCES_SUCCESS,
            params,
          ),
        );
    } catch (e) {
      dispatch(
        failure(foodPreferencesActionTypes.UPDATE_FOOD_PREFERENCES_FAILURE, e),
      );
    }
  };
};

export const getMealPlanByUserAction = params => {
  console.log('get meal play by user request', params);
  let reqParams = params === undefined ? {} : params;
  //let responseData;
  return async dispatch => {
    dispatch(initialize(mealPlanActionType.GET_MEAL_PLAN_BY_USER_REQUEST));
    try {
      // console.time('a');
      const response = await usersService.getMealPlanByUser(reqParams);
      // console.timeEnd('a');
      console.log('get meal play by user response', response);
      dispatch(
        success(
          mealPlanActionType.GET_MEAL_PLAN_BY_USER_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      console.log('get meal play by user error', e);
      dispatch(failure(mealPlanActionType.GET_MEAL_PLAN_BY_USER_FAILURE, e));
    }
  };
};

export const getNewMealPlanByUserAction = params => {
  console.log('get meal play by user request', params);
  let reqParams = params === undefined ? {} : params;
  //let responseData;
  return async dispatch => {
    dispatch(initialize(mealPlanActionType.GET_MEAL_PLAN_BY_USER_REQUEST));
    try {
      // console.time('a');
      const response = await usersService.getMealPlanByUser(reqParams);
      // console.timeEnd('a');
      console.log('get meal play by user response', response);
      dispatch(
        success(
          mealPlanActionType.GET_MEAL_PLAN_BY_USER_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      console.log('get meal play by user error', e);
      dispatch(failure(mealPlanActionType.GET_MEAL_PLAN_BY_USER_FAILURE, e));
    }
  };
};

export const getDailyFoodPlanAction = params => {
  return async dispatch => {
    dispatch(initialize(dailyFoodPlanType.GET_DAILY_FOOD_PLAN_REQUEST));

    try {
      const response = await usersService.getDailyFoodPlan(params);
    
      dispatch(
        success(
          dailyFoodPlanType.GET_DAILY_FOOD_PLAN_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      dispatch(failure(dailyFoodPlanType.GET_DAILY_FOOD_PLAN_FAILURE, e));
    }
  };
};

export const updateDailyFoodPlanAction = params => {
  return function (dispatch) {
    return new Promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .updateDailyFoodplan(params)
        .then(response => {
          resolve(response);
          dispatch(success(response));
        })
        .catch(err => {
          reject(err);
          dispatch(failure(err));
        });
    });
  };
  function request(payload) {
    return {type: dailyFoodPlanType.UPDATE_DAILY_FOOD_PLAN_REQUEST, payload};
  }

  function success(payload) {
    return {type: dailyFoodPlanType.UPDATE_DAILY_FOOD_PLAN_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: dailyFoodPlanType.UPDATE_DAILY_FOOD_PLAN_FAILURE, payload};
  }
};

export const removeDailyFoodPlan = params => {
  return async dispatch => {
    dispatch(initialize(dailyFoodPlanType.REMOVE_DAILY_FOOD_PLAN_REQUEST));

    try {
      const res = await usersService.removeDailyFoodPlan(params);
      dispatch(
        success(dailyFoodPlanType.REMOVE_DAILY_FOOD_PLAN_REQUEST_SUCCESS, res),
      );
    } catch (e) {
      dispatch(
        failure(dailyFoodPlanType.REMOVE_DAILY_FOOD_PLAN_REQUEST_FAILURE, e),
      );
    }
  };
};

export const getFoodPlanAction = params => {
  return async dispatch => {
    dispatch(initialize(getFoodPlanType.GET_FOOD_PLAN_REQUEST));

    try {
      const response = await usersService.getFoodPlanByUser(params);

      dispatch(
        success(
          getFoodPlanType.GET_FOOD_PLAN_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      dispatch(failure(getFoodPlanType.GET_FOOD_PLAN_FAILURE, e));
    }
  };
};

export const updateFoodFilter = data => dispatch => {
  dispatch({type: getFoodPlanType.UPDATE_FOOD_FILTER_DATA, payload: data});
};

export const FoodFilterKeyStatus = value => dispatch => {
  dispatch({type: getFoodPlanType.SET_FOOD_FILTER_STATUS, payload: value});
};

export const getMealPlanByIdAction = params => {
  return async dispatch => {
    dispatch(initialize(mealPlanActionType.GET_MEAL_PLAN_BY_ID_REQUEST));

    try {
      const response = await usersService.getMealPlanById(params);
      dispatch(
        success(
          mealPlanActionType.GET_MEAL_PLAN_BY_ID_SUCCESS,
          response.data.responseData.result,
        ),
      );
    } catch (e) {
      dispatch(failure(mealPlanActionType.GET_MEAL_PLAN_BY_ID_FAILURE, e));
    }
  };
};
export const setFoodSearchKeyStatus = value => dispatch => {
  dispatch({type: mealPlanActionType.SET_SEARCH_STATUS, payload: value});
};

export const setFoodFavouriteKeyStatus = value => dispatch => {
  dispatch({type: mealPlanActionType.SET_FAVOURITE_STATUS, payload: value});
};

export const setFoodFilterKeyStatus = value => dispatch => {
  dispatch({type: mealPlanActionType.SET_FILTER_STATUS, payload: value});
};
export const updateFoodFilterData = data => dispatch => {
  dispatch({type: mealPlanActionType.UPDATE_FILTER_DATA, payload: data});
};

export const resetFoodFilterData = () => dispatch => {
  dispatch({type: mealPlanActionType.RESET_FILTER_DATA});
};

export const addFoodPlan = params => {
  const navigation = useNavigation();
  return async dispatch => {
    dispatch(initialize(addFoodPlanActionTypes.ADD_FOOD_PLAN));

    try {
      const response = await usersService.addFoodPlan(params);
      dispatch(success(addFoodPlanActionTypes.ADD_FOOD_PLAN_SUCCESS, response));
    } catch (error) {
      dispatch(failure(addFoodPlanActionTypes.ADD_FOOD_PLAN_FAILURE, error));
    }
  };
};
