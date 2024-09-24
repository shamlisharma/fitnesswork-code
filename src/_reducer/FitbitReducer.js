import {ingTypes} from '../_action/FitnessAction';


const initialState = {
fitbitGetData:{},

} ;


export function fitbitReducer(state = initialState, action) {
    switch (action.type) {
        case ingTypes.GET_ACTIVITY_REQUEST:
            return {
                ...state,
                fitbitGetData: action.payload
            };

        case ingTypes.GET_ACTIVITY_SUCCESS:
            return {
                ...state,
                fitbitGetData: action.payload
            };

        default:
            return {...state};
    }
}
