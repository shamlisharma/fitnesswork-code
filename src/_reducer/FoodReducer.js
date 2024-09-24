import {
  dailyFoodTargetActionTypes,
  foodPreferencesActionTypes,
  mealPlanActionType,
  dailyFoodPlanType,
  getFoodPlanType,
} from '../_action/FoodAction';
import {signupTypes} from '../_action/AuthAction';
const initialState = {
  dailyFoodTarget: {},
  foodPreferences: {excludeIngredients: [], favouriteIngredients: []},
  mealPlanByuser: [],
  dailyFoodPlan: null,
  foodPlanByUser: {foodPlanByUser: {dailyFoodPlanId: {food: []}}},
  mealPlanById: [],
  error: {},
  foodList: {
    loading: false,
    data: [],
    error: '',
    filterData: {
      foodTypes: [],
      mealTypes: [],
      mealFoodArray: [
        {
          id: 1,
          name: 'BreakFast',
        },
      ],
      foodPreferenceType: [],
      time: [0, 200],
      cuisionTypes: [],
    },
    filterKey: false,
    searchKey: false,
    favouriteFood: false,
  },
  foodPlanList: {
    loading: false,
    data: [],
    error: '',
    filterData: {
      foodPreferenceType: [],
      time: [0, 200],
      cuisionTypes: [],
    },
    filterKey: false,
    searchKey: false,
    favouriteFood: false,
  },
};

export const foodReducer = (state = initialState, action) => {
  switch (action.type) {
    case dailyFoodTargetActionTypes.GET_DAILY_FOOD_TARGET:
      return {...state};

    case dailyFoodTargetActionTypes.GET_DAILY_FOOD_TARGET_SUCCESS:
      return {...state, dailyFoodTarget: action.payload, error: null};

    case dailyFoodTargetActionTypes.GET_DAILY_FOOD_TARGET_FAILURE:
      return {...state, dailyFoodTarget: null, error: action.payload};

    case dailyFoodTargetActionTypes.SET_DAILY_FOOD_TARGET:
      return {...state};

    case dailyFoodTargetActionTypes.SET_DAILY_FOOD_TARGET_SUCCESS:
      return {
        ...state,
        dailyFoodTarget: {...state.dailyFoodTarget, ...action.payload},
        error: null,
      };

    case dailyFoodTargetActionTypes.SET_DAILY_FOOD_TARGET_FAILURE:
      return {...state, dailyFoodTarget: null, error: action.payload};

    case foodPreferencesActionTypes.GET_FOOD_PREFERENCES:
      return {...state};

    case foodPreferencesActionTypes.GET_FOOD_PREFERENCES_SUCCESS:
      return {...state, foodPreferences: action.payload, error: null};

    case foodPreferencesActionTypes.GET_FOOD_PREFERENCES_FAILURE:
      return {...state, foodPreferences: null, error: action.payload};

    case foodPreferencesActionTypes.UPDATE_FOOD_PREFERENCES:
      return {...state};

    case foodPreferencesActionTypes.UPDATE_FOOD_PREFERENCES_SUCCESS:
      return {...state, foodPreferences: action.payload, error: null};

    case foodPreferencesActionTypes.UPDATE_FOOD_PREFERENCES_FAILURE:
      return {...state, foodPreferences: null, error: action.payload};

    // Meal plan reducer
    case mealPlanActionType.GET_MEAL_PLAN_BY_USER_REQUEST:
      return {
        ...state,
        foodList: {...state.foodList, loading: true, error: '', data: []},
      };

    case mealPlanActionType.GET_MEAL_PLAN_BY_USER_SUCCESS:
      return {
        ...state,
        mealPlanByuser: action.payload,
        foodList: {
          ...state.foodList,
          loading: false,
          data: action.payload,
          error: '',
        },
        error: null,
      };

    case mealPlanActionType.GET_MEAL_PLAN_BY_USER_FAILURE:
      return {
        ...state,
        mealPlanByuser: null,
        foodList: {
          ...state.foodList,
          loading: false,
          data: [],
          error: action.payload,
        },
        error: action.payload,
      };

    case mealPlanActionType.SET_FAVOURITE_STATUS:
      return {
        ...state,
        foodList: {...state.foodList, favouriteFood: action.payload},
      };

    case mealPlanActionType.SET_SEARCH_STATUS:
      return {
        ...state,
        foodList: {...state.foodList, searchKey: action.payload},
      };

    case mealPlanActionType.SET_FILTER_STATUS:
      return {
        ...state,
        foodList: {...state.foodList, filterKey: action.payload},
      };

    case mealPlanActionType.UPDATE_FILTER_DATA: {
      return {
        ...state,
        foodList: {
          ...state.foodList,
          filterData: {...state.foodList.filterData, ...action.payload},
        },
      };
    }

    case mealPlanActionType.RESET_FILTER_DATA: {
      return {
        ...state,
        foodList: {
          ...state.foodList,
          filterData: {
            foodTypes: [],
            mealTypes: [],
            foodPreferenceType: [],
            cuisionTypes: [],
            mealFoodArray: [
              {
                id: 1,
                name: 'BreakFast',
              },
            ],
            time: [0, 200],
          },
        },
        foodPlanList: {
          ...state.foodList,
          filterData: {foodPreferenceType: [], cuisionTypes: []},
        },
      };
    }
    // get daily food plan
    case dailyFoodPlanType.GET_DAILY_FOOD_PLAN_REQUEST:
      return {...state};

    case dailyFoodPlanType.GET_DAILY_FOOD_PLAN_SUCCESS:
      return {...state, dailyFoodPlan: action.payload, error: null};

    case dailyFoodPlanType.GET_DAILY_FOOD_PLAN_FAILURE:
      return {...state, dailyFoodPlan: null, error: action.payload};

    // remove daily food plan
    case dailyFoodPlanType.REMOVE_DAILY_FOOD_PLAN_REQUEST:
      return {...state};

    case dailyFoodPlanType.REMOVE_DAILY_FOOD_PLAN_REQUEST_SUCCESS:
      return {...state, dailyFoodPlan: null, error: null};

    case dailyFoodPlanType.REMOVE_DAILY_FOOD_PLAN_REQUEST_FAILURE:
      return {...state, error: action.payload};

    // get food plan by user
    case getFoodPlanType.GET_FOOD_PLAN_REQUEST:
      return {...state};

    case getFoodPlanType.GET_FOOD_PLAN_SUCCESS:
      return {...state, foodPlanByUser: action.payload, error: null};

    case getFoodPlanType.GET_FOOD_PLAN_FAILURE:
      return {...state, foodPlanByUser: null, error: action.payload};

    case getFoodPlanType.SET_FOOD_FILTER_STATUS:
      return {
        ...state,
        foodPlanList: {...state.foodPlanList, filterKey: action.payload},
      };

    case getFoodPlanType.UPDATE_FOOD_FILTER_DATA:
      return {
        ...state,
        foodPlanList: {
          ...state.foodPlanList,
          filterData: {...state.foodPlanList.filterData, ...action.payload},
        },
      };

    case getFoodPlanType.RESET_FOOD_FILTER_DATA: {
      return {
        ...state,
        foodPlanList: {
          ...state.foodPlanList,
          filterData: {
            foodPreferenceType: [],
            cuisionTypes: [],
            time: [0, 200],
          },
        },
      };
    }
    // get meal plan by id

    case mealPlanActionType.GET_MEAL_PLAN_BY_ID_REQUEST:
      return {...state};

    case mealPlanActionType.GET_MEAL_PLAN_BY_ID_SUCCESS:
      return {...state, mealPlanById: action.payload, error: null};

    case mealPlanActionType.GET_MEAL_PLAN_BY_ID_FAILURE:
      return {...state, mealPlanById: null, error: action.payload};

    case signupTypes.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        dailyFoodTarget: {},
        foodPreferences: {excludeIngredients: [], favouriteIngredients: []},
        mealPlanByuser: [],
        dailyFoodPlan: null,
        foodPlanByUser: {},
        mealPlanById: [],
      };

    default:
      return {...state};
  }
};
