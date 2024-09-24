import {usersService} from '../services/ApiServices';

export const workoutProgrammeActionTypes = {
  GET_WORKOUT_PROGRAMME: 'GET_WORKOUT_PROGRAMME',
  GET_WORKOUT_PROGRAMME_SUCCESS: 'GET_WORKOUT_PROGRAMME_SUCCESS',
  GET_WORKOUT_PROGRAMME_FAILURE: 'GET_WORKOUT_PROGRAMME_FAILURE',

  SET_WORKOUT_PROGRAMME: 'SET_WORKOUT_PROGRAMME',
  SET_WORKOUT_PROGRAMME_SUCCESS: 'SET_WORKOUT_PROGRAMME_SUCCESS',
  SET_WORKOUT_PROGRAMME_FAILURE: 'SET_WORKOUT_PROGRAMME_FAILURE',

  GET_WORKOUT_LIST: 'GET_WORKOUT_LIST',
  GET_WORKOUT_LIST_SUCCESS: 'GET_WORKOUT_LIST_SUCCESS',
  GET_WORKOUT_LIST_FAILURE: 'GET_WORKOUT_LIST_FAILURE',

  SET_FILTER_STATUS: 'SET_FILTER_STATUS',
  SET_SEARCH_STATUS: 'SET_SEARCH_STATUS',
  SET_FAVOURITE_STATUS: 'SET_FAVOURITE_STAUS',

  UPDATE_FILTER_DATA: 'UPDATE_FILTER_DATA',
  RESET_FILTER_DATA: 'RESET_FILTER_DATA',

  GET_EXERCISE_BY_WORKOUT_ID: 'GET_EXERCISE_BY_WORKOUT_ID',
  GET_EXERCISE_BY_WORKOUT_ID_SUCCESS: 'GET_EXERCISE_BY_WORKOUT_ID_SUCCESS',
  GET_EXERCISE_BY_WORKOUT_ID_FAILURE: 'GET_EXERCISE_BY_WORKOUT_ID_FAILURE',

  GET_WORKOUT_DURATION: 'GET_WORKOUT_DURATION',
  UPDATE_WORKOUT_DURATION: 'UPDATE_WORKOUT_DURATION',
  RESET_WORKOUT_DURATION: 'RESET_WORKOUT_DURATION',
  WORKOUT_DURARATION_ACTIVE: 'WORKOUT_DURARATION_ACTIVE',
  
  GET_WORKOUT_DURATION_REST: 'GET_WORKOUT_DURATION_REST',
  UPDATE_WORKOUT_DURATION_REST: 'UPDATE_WORKOUT_DURATION_REST',
  RESET_WORKOUT_DURATION_REST: 'RESET_WORKOUT_DURATION_REST',
  WORKOUT_DURARATION_ACTIVE_REST: 'WORKOUT_DURARATION_ACTIVE_REST',

  APPLE_HEALTH: 'APPLE_HEALTH',
  APPLE_HEALTH_SUCCESS: 'APPLE_HEALTH_SUCCESS',
  APPLE_HEALTH_FAILURE: 'APPLE_HEALTH_FAILURE',

  SET_WORKOUT_ACTIVITY_COUNT: 'SET_WORKOUT_ACTIVITY_COUNT',
};

function initialize(type) {
  return {
    type: type,
  };
}

function success(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}

export const setWorkoutActivityCount = value => dispatch => {
  dispatch({
    type: workoutProgrammeActionTypes.SET_WORKOUT_ACTIVITY_COUNT,
    payload: value,
  });
};

function failure(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}
export const getWorkoutProgramme = () => {
  return async dispatch => {
    dispatch(initialize());
    try {
      // hit api here
      let response = await usersService.getUserWorkout();
      console.log('response getWorkoutProgramme in workout actions',JSON.stringify(response.data))
      dispatch(success(response));
    } catch (e) {
      dispatch(failure(response));
    }
  };

  function initialize() {
    return {
      type: workoutProgrammeActionTypes.GET_WORKOUT_PROGRAMME,
    };
  }

  function success(payload) {
    return {
      type: workoutProgrammeActionTypes.GET_WORKOUT_PROGRAMME_SUCCESS,
      payload,
    };
  }

  function failure(payload) {
    return {
      type: workoutProgrammeActionTypes.GET_WORKOUT_PROGRAMME_FAILURE,
      payload,
    };
  }
};

export const setWorkoutProgramme = params => {
  return async dispatch => {
    dispatch(initialize(workoutProgrammeActionTypes.SET_WORKOUT_PROGRAMME));
    try {
      dispatch(
        success(
          workoutProgrammeActionTypes.SET_WORKOUT_PROGRAMME_SUCCESS,
          params,
        ),
      );
    } catch (e) {
      dispatch(
        failure(
          workoutProgrammeActionTypes.SET_WORKOUT_PROGRAMME_FAILURE,
          params,
        ),
      );
    }
  };
};

export const getWorkoutList = params => async dispatch => {
  console.log("FAV_HIT_SCREEN")
  dispatch(initialize(workoutProgrammeActionTypes.GET_WORKOUT_LIST));
  try {
    let response = await usersService.getWorkouts(params);
console.log({response})
    dispatch(
      success(
        workoutProgrammeActionTypes.GET_WORKOUT_LIST_SUCCESS,
        response.data.responseData.result,
      ),
    );
  } catch (err) {
    dispatch(
      failure(workoutProgrammeActionTypes.GET_WORKOUT_LIST_FAILURE, err),
    );
  }
};

export const getExcercisesByWorkoutId = params => async dispatch => {
  dispatch(initialize(workoutProgrammeActionTypes.GET_EXERCISE_BY_WORKOUT_ID));
  try {
    let response = await usersService.getExerciseByWorkoutId(params);

    dispatch(
      success(
        workoutProgrammeActionTypes.GET_EXERCISE_BY_WORKOUT_ID_SUCCESS,
        response.data.responseData.result,
      ),
    );
  } catch (err) {
    dispatch(
      failure(workoutProgrammeActionTypes.GET_WORKOUT_LIST_FAILURE, err),
    );
  }
};

export const setSearchKeyStatus = value => dispatch => {
  dispatch({
    type: workoutProgrammeActionTypes.SET_SEARCH_STATUS,
    payload: value,
  });
};

export const setFavouriteKeyStatus = value => dispatch => {
  dispatch({
    type: workoutProgrammeActionTypes.SET_FAVOURITE_STATUS,
    payload: value,
  });
};

export const setFilterKeyStatus = value => dispatch => {
  dispatch({
    type: workoutProgrammeActionTypes.SET_FILTER_STATUS,
    payload: value,
  });
};

export const updateFilterData = data => dispatch => {
  dispatch({
    type: workoutProgrammeActionTypes.UPDATE_FILTER_DATA,
    payload: data,
  });
};

export const resetFilterData = () => dispatch => {
  dispatch({type: workoutProgrammeActionTypes.RESET_FILTER_DATA});
};

export const appleHealthWorkout = data => dispatch => {
  dispatch({
    type: workoutProgrammeActionTypes.APPLE_HEALTH_SUCCESS,
    payload: data,
  });
};
