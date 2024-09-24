import {commonTypes} from '../_action/CommonAction';

const initialState = {
  collapsibleData: {
    todaysPlanContainer: false,
    dietTypeContainer: false,
    foodPrefrencesContainer: false,
    descriptionContainer: false,
    ingredientsContainer: false,
    methodContainer: false,
  },
  allWorkoutPageName: 'allprograms'
};

export function commonReducer(state = initialState, action) {
  switch (action.type) {
    case commonTypes.UPDATE_COLLAPSABLE_CONTAINER_STATUS:
      const {dataType, value} = action.payload;

      let dummyData = {
        ...state.collapsibleData,
      };
      switch (dataType) {
        case 'todaysPlanContainer':
          dummyData = {
            ...dummyData,
            todaysPlanContainer: value,
          };
          break;
        case 'dietTypeContainer':
          dummyData = {
            ...dummyData,
            dietTypeContainer: value,
          };
          break;
        case 'foodPrefrencesContainer':
          dummyData = {
            ...dummyData,
            foodPrefrencesContainer: value,
          };
          break;
        case 'descriptionContainer':
          dummyData = {
            ...dummyData,
            descriptionContainer: value,
          };
          break;
        case 'ingredientsContainer':
          dummyData = {
            ...dummyData,
            ingredientsContainer: value,
          };
          break;
        case 'methodContainer':
          dummyData = {
            ...dummyData,
            methodContainer: value,
          };
          break;
      }
      return {
        ...state,
        collapsibleData: dummyData,
      };

    case commonTypes.UPDATE_ALL_WORKOUT_PAGE_NAME:
    
    return  {
        ...state,
        allWorkoutPageName: action.payload
      }

    default:
      return state;
  }
}
