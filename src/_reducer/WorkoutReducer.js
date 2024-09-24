import {workoutProgrammeActionTypes} from '../_action/WorkoutAction';

const initalState = {
  workoutProgramme: {
    loading: false,
    data: {},
    error: '',
  },
  workoutList: {
    loading: false,
    data: [],
    error: '',
    filterData: {
      bodyParts: [],
      time: [0, 120],
      equipments: [],
      strength: [{id: 1, name: 'NewBeginner'}],
    },
    filterKey: false,
    searchKey: false,
    favouriteKey: false,
  },
  healthData: {
    workoutLength: 0,
  },
  workoutData: {
    loading: false,
    data: {},
    error: '',
  },
  workoutDuration: {
    seconds: 0,
  },
  workoutActivityCount: 0,
  workoutDurationCheck: {
    active: false,
    previousTime: 0,
    previousDateTime: 0,
  },
  workoutDurationCheck1: {
    active: false,
    previousTime: 0,
    previousDateTime: 0,
  },
};

export const workoutReducer = (state = initalState, action) => {
  switch (action.type) {
    case workoutProgrammeActionTypes.SET_WORKOUT_ACTIVITY_COUNT:
      return {...state, workoutActivityCount: action.payload};

    case workoutProgrammeActionTypes.GET_WORKOUT_PROGRAMME:
      return {
        ...state,
        workoutProgramme: {
          ...state.workoutProgramme,
          loading: true,
          data: {},
          error: '',
        },
      };

    case workoutProgrammeActionTypes.GET_WORKOUT_PROGRAMME_SUCCESS:
      return {
        ...state,
        workoutProgramme: {
          ...state.workoutProgramme,
          loading: false,
          data: action.payload,
          error: '',
        },
      };

    case workoutProgrammeActionTypes.GET_WORKOUT_PROGRAMME_FAILURE:
      return {
        ...state,
        workoutProgramme: {
          ...state.workoutProgramme,
          loading: false,
          data: {},
          error: action.payload,
        },
      };

    case workoutProgrammeActionTypes.SET_WORKOUT_PROGRAMME:
      return {...state};

    case workoutProgrammeActionTypes.SET_WORKOUT_PROGRAMME_SUCCESS:
      return {...state, ...action.payload};

    case workoutProgrammeActionTypes.SET_WORKOUT_PROGRAMME_FAILURE:
      return {...state};

    case workoutProgrammeActionTypes.GET_WORKOUT_LIST:
      return {
        ...state,
        workoutList: {...state.workoutList, loading: true, error: '', data: []},
      };

    case workoutProgrammeActionTypes.GET_WORKOUT_LIST_SUCCESS:
      return {
        ...state,
        workoutList: {
          ...state.workoutList,
          loading: false,
          data: action.payload,
          error: '',
        },
      };

    case workoutProgrammeActionTypes.GET_WORKOUT_LIST_FAILURE:
      return {
        ...state,
        workoutList: {
          ...state.workoutList,
          loading: false,
          data: [],
          error: action.payload,
        },
      };

    case workoutProgrammeActionTypes.SET_FILTER_STATUS:
      return {
        ...state,
        workoutList: {...state.workoutList, filterKey: action.payload},
      };

    case workoutProgrammeActionTypes.SET_SEARCH_STATUS:
      return {
        ...state,
        workoutList: {...state.workoutList, searchKey: action.payload},
      };

    case workoutProgrammeActionTypes.SET_FAVOURITE_STATUS:
      return {
        ...state,
        workoutList: {...state.workoutList, favouriteKey: action.payload},
      };

    case workoutProgrammeActionTypes.GET_EXERCISE_BY_WORKOUT_ID:
      return {
        ...state,
        workoutData: {
          ...state.workoutData,
          loading: true,
          data: null,
          error: '',
        },
      };

    case workoutProgrammeActionTypes.GET_EXERCISE_BY_WORKOUT_ID_SUCCESS:
      return {
        ...state,
        workoutData: {
          ...state.workoutData,
          loading: false,
          data: action.payload[0],
          error: '',
        },
      };

    case workoutProgrammeActionTypes.GET_EXERCISE_BY_WORKOUT_ID_FAILURE:
      return {
        ...state,
        workoutData: {
          ...state.workoutData,
          loading: false,
          data: null,
          error: action.payload,
        },
      };

    case workoutProgrammeActionTypes.GET_WORKOUT_DURATION:
      return {...state};
    case workoutProgrammeActionTypes.GET_WORKOUT_DURATION_REST:
      return {...state};

    case workoutProgrammeActionTypes.UPDATE_WORKOUT_DURATION: {
      let sec = action.payload;
      return {...state, workoutDuration: {seconds: sec}};
    }
    case workoutProgrammeActionTypes.UPDATE_WORKOUT_DURATION_REST: {
      let sec = action.payload;
      return {...state, workoutDuration: {seconds: sec}};
    }

    case workoutProgrammeActionTypes.RESET_WORKOUT_DURATION: {
      return {...state, workoutDuration: {seconds: 0}};
    }
    case workoutProgrammeActionTypes.RESET_WORKOUT_DURATION_REST: {
      return {...state, workoutDuration: {seconds: 0}};
    }

    case workoutProgrammeActionTypes.UPDATE_FILTER_DATA: {
      return {
        ...state,
        workoutList: {
          ...state.workoutList,
          filterData: {...state.workoutList.filterData, ...action.payload},
        },
      };
    }

    case workoutProgrammeActionTypes.WORKOUT_DURARATION_ACTIVE: {
      console.log('Payload timer data', action.payload);
      return {
        ...state,
        workoutDurationCheck: {
          ...state.workoutDurationCheck,
          active: action.payload.active,
          previousTime: action.payload.previousTime,
          previousDateTime: action.payload.previousDateTime,
        },
      };
    }
    case workoutProgrammeActionTypes.WORKOUT_DURARATION_ACTIVE_REST: { 
      console.log('Payload timer data', action.payload);
      return {
        ...state,
        workoutDurationCheck1: {
          ...state.workoutDurationCheck1,
          active: action.payload.active,
          previousTime: action.payload.previousTime,
          previousDateTime: action.payload.previousDateTime,
        },
      };
    }

    case workoutProgrammeActionTypes.RESET_FILTER_DATA: {
      return {
        ...state,
        workoutList: {
          ...state.workoutList,
          filterData: {
            bodyParts: [],
            time: [0, 200],
            equipments: [],
            strength: [
              // { id: 1, name: 'Beginner'}
            ],
          },
        },
      };
    }
    case workoutProgrammeActionTypes.APPLE_HEALTH_SUCCESS: {
      return {...state, healthData: {workoutLength: action.payload}};
    }

    default:
      return {...state};
  }
};
