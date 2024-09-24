import {signupTypes} from '../_action/AuthAction';

const initialState = {
  loggedIn: false,
  userLoggedIn: {},
  googleLoggedIn: false,
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case signupTypes.SIGNIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        userLoggedIn: action.payload,
      };

    case signupTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        userLoggedIn: action.payload,
      };
    case signupTypes.USER_LOGOUT_SUCCESS: {
      console.log('action.payload======', action.payload);
      return {
        ...state,
        loggedIn: false,
        userLoggedIn: {},
      };
    }
    case signupTypes.GOOGLE_SIGNIN:
      return {
        ...state,
        loggedIn: true,
        googleLoggedIn: true,
      };
    default:
      return {...state};
  }
}
