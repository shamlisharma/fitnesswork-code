import {questTypes} from '../_action/QuestionnaireAction';


const initialState = {
    QuestionnaireData:{},

} ;


export function questReducer(state = initialState, action) {
    switch (action.type) {
        case questTypes.GET_QUESTIONNAIRE_REQUEST:
            return {
                ...state,
                QuestionnaireData: action.payload
            };

        case questTypes.GET_QUESTIONNAIRE_SUCCESS:
            return {
                ...state,
                QuestionnaireData: action.payload
            };

        default:
            return {...state};
    }
}
