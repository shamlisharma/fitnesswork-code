import promise from 'bluebird';
import {refreshToken, usersService} from '../services/ApiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getOr} from 'lodash/fp';

export const signupTypes = {
  //  Signup Types
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_ERROR: 'SIGNUP_ERROR',
  GOOGLE_SIGNIN: 'GOOGLE_SIGNIN',

  //  Signin types
  SIGNIN_REQUEST: 'SIGNIN_REQUEST',
  SIGNIN_SUCCESS: 'SIGNIN_SUCCESS',
  SIGNIN_ERROR: 'SIGNIN_ERROR',

  //  Forgot types
  FORGOT_PASSWORD_REQUEST: 'FORGOT_PASSWORD_REQUEST',
  FORGOT_PASSWORD_SUCCESS: 'FORGOT_PASSWORD_SUCCESS',
  FORGOT_PASSWORD_ERROR: 'FORGOT_PASSWORD_ERROR',

  //  Reset types
  RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERROR: 'RESET_PASSWORD_ERROR',

  //  logout
  USER_LOGOUT_REQUEST: 'USER_LOGOUT_REQUEST',
  USER_LOGOUT_SUCCESS: 'USER_LOGOUT_SUCCESS',
  USER_LOGOUT_ERROR: 'USER_LOGOUT_ERROR',
};

export const authAction = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .signup(params)
        .then(async response => {
          let status = getOr('', 'data.statusCode', response);
          if (status) {
            let accessToken = getOr(
              '',
              'data.responseData.accessToken',
              response,
            );
            await AsyncStorage.setItem('accessToken', accessToken);
            refreshToken();
            resolve(response);
            dispatch(success(response));
          } else {
            reject(err);
            dispatch(failure(err));
          }
        })
        .catch(err => {
          reject(err);
          dispatch(failure(err));
        });
    });
  };
  function request(payload) {
    return {type: signupTypes.SIGNUP_REQUEST, payload};
  }

  function success(payload) {
    return {type: signupTypes.SIGNUP_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: signupTypes.SIGNUP_ERROR, payload};
  }
};

//login action

export const loginAction = (params, callback) => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .signin(params)
        .then(async response => {

          console.log(response.data,"LOGIN_RESPONSE_API");
          callback();

          let status = getOr('', 'data.statusCode', response);

          if (status) {
            if (response?.data?.responseData) {
              let accessToken = getOr(
                '',
                'data.responseData.accessToken',
                response,
              );
              await AsyncStorage.setItem('accessToken', accessToken);
              await refreshToken();
              resolve(response);
              dispatch(success(response));
            } else {
              let errorMesg = getOr(
                '',
                'data.error.errors.responseMessage',
                response,
              );
              reject(errorMesg);
              dispatch(failure(errorMesg));
            }
          } else {
            let errorMesg = getOr(
              '',
              'data.error.errors.responseMessage',
              response,
            );
            reject(errorMesg);
            dispatch(failure());
          }
        })
        .catch(err => {
          
          callback();
          reject(err);
          dispatch(failure(err));
        });
    });
  };
  function request(payload) {
    return {type: signupTypes.SIGNIN_REQUEST, payload};
  }

  function success(payload) {
    return {type: signupTypes.SIGNIN_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: signupTypes.SIGNIN_ERROR, payload};
  }
};

export const googleVarification = () => {
  return function (dispatch) {
    dispatch({type: signupTypes.GOOGLE_SIGNIN});
  };
  // function request() {
  //   console.log('dfdsfsdfdsfdsfsdfsdfsd00000000')
  //   return {type: signupTypes.GOOGLE_SIGNIN};
  // }
};

// forgot password
export const forgotPassword = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .forgotPassword(params)
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
    return {type: signupTypes.FORGOT_PASSWORD_REQUEST, payload};
  }

  function success(payload) {
    return {type: signupTypes.FORGOT_PASSWORD_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: signupTypes.FORGOT_PASSWORD_ERROR, payload};
  }
};

// Reset password

export const resetPassword = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .resetPassword(params)
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
    return {type: signupTypes.RESET_PASSWORD_REQUEST, payload};
  }

  function success(payload) {
    return {type: signupTypes.RESET_PASSWORD_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: signupTypes.RESET_PASSWORD_ERROR, payload};
  }
};

export const logoutAction = params => async dispatch => {
  dispatch(request(params));
  try {
    AsyncStorage.removeItem('accessToken');
    dispatch(success(res));
    let res = await usersService.logout(params);
    if (res.data.statusCode === 1) {
    }
    dispatch(success(res));
  } catch (err) {
    console.error(err);
    dispatch(failure(err));
  }
  function request(payload) {
    return {type: signupTypes.USER_LOGOUT_REQUEST, payload};
  }

  function success(payload) {
    return {type: signupTypes.USER_LOGOUT_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: signupTypes.USER_LOGOUT_ERROR, payload};
  }
};

export const deleteUserAction = params => async dispatch => {
  dispatch(request(params));
  try {
    AsyncStorage.removeItem('accessToken');
    dispatch(success(res));
    let res = await usersService.deleteUser(params);
    if (res.data.statusCode === 1) {
    }
    dispatch(success(res));
  } catch (err) {
    console.error(err);
    dispatch(failure(err));
  }
  function request(payload) {
    return {type: signupTypes.USER_LOGOUT_REQUEST, payload};
  }

  function success(payload) {
    return {type: signupTypes.USER_LOGOUT_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: signupTypes.USER_LOGOUT_ERROR, payload};
  }
};
