import promise, {reject} from 'bluebird';
import {usersService} from '../services/ApiServices';
import {authAction, logoutAction} from './AuthAction';

export const profileTypes = {
  //  profile Types
  GET_PROFILE_REQUEST: 'GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS: 'GET_PROFILE_SUCCESS',
  GET_PROFILE_ERROR: 'GET_PROFILE_ERROR',

  // edit user profile
  EDIT_PROFILE_REQUEST: 'EDIT_PROFILE_REQUEST',
  EDIT_PROFILE_SUCCESS: 'EDIT_PROFILE_SUCCESS',
  EDIT_PROFILE_ERROR: 'EDIT_PROFILE_ERROR',
  //  change password types
  CHANGE_PASSWORD_REQUEST: 'CHANGE_PASSWORD_REQUEST',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_ERROR: 'CHANGE_PASSWORD_ERROR',
};

export const getProfileAction = params => async dispatch => {

  dispatch(request(params));
  try {
    let response = await usersService.getProfile();
console.log('resposne ids', response);
    dispatch(success(response));
  } catch (e) {
    console.log({"error in get profile":e});
    dispatch(failure(e));
    dispatch(logoutAction());
  }

  function request(payload) {
    return {type: profileTypes.GET_PROFILE_REQUEST, payload};
  }

  function success(payload) {
    return {type: profileTypes.GET_PROFILE_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: profileTypes.GET_PROFILE_ERROR, payload};
  }
};

export const editProfileAction = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .editUserProfile(params)
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
    return {type: profileTypes.EDIT_PROFILE_REQUEST, payload};
  }

  function success(payload) {
    return {type: profileTypes.EDIT_PROFILE_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: profileTypes.EDIT_PROFILE_ERROR, payload};
  }
};

// edit user profile

// change password

export const changePassword = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .changePassword(params)
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
    return {type: profileTypes.CHANGE_PASSWORD_REQUEST, payload};
  }

  function success(payload) {
    return {type: profileTypes.CHANGE_PASSWORD_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: profileTypes.CHANGE_PASSWORD_ERROR, payload};
  }
};
