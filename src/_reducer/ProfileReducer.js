import { signupTypes } from '../_action/AuthAction';
import {profileTypes} from '../_action/ProfileAction';


const initialState = {
    profile:{},

} ;


export function profileReducer(state = initialState, action) {
    switch (action.type) {
        case profileTypes.GET_PROFILE_REQUEST:
            return {
                ...state,
                profile: action.payload
            };

        case profileTypes.GET_PROFILE_SUCCESS:
            return {
                ...state,
                profile: action.payload
            };

        case signupTypes.USER_LOGOUT_SUCCESS:
            return { profile: {}}

        default:
            return {...state};
    }
}
