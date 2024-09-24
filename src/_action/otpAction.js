import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const otpTypes = {
  // send otp
  SEND_OTP_REQUEST: 'SEND_OTP_REQUEST',
  SEND_OTP_SUCCESS: 'SEND_OTP_SUCCESS',
  SEND_OTP_ERROR: 'SEND_OTP_ERROR',

  //  verify otp
  VERIFY_OTP_REQUEST: 'VERIFY_OTP_REQUEST',
  VERIFY_OTP_SUCCESS: 'VERIFY_OTP_SUCCESS',
  VERIFY_OTP_ERROR: 'VERIFY_OTP_ERROR',
};

export const sendOTPAction = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .sendOtp(params)
        .then(response => {
          console.log('heyas', response);
          resolve(response);
          dispatch(success(response));
        })
        .catch(err => {
          console.log('hbyas', err);
          reject(err);
          dispatch(failure(err));
        });
    });
  };
  function request(payload) {
    return {type: otpTypes.SEND_OTP_REQUEST, payload};
  }

  function success(payload) {
    return {type: otpTypes.SEND_OTP_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: otpTypes.SEND_OTP_ERROR, payload};
  }
};

export const verifyOTPAction = params => {
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .verifyOtp(params)
        .then(response => {
          console.log('response kalra===', response);
          resolve(response);
          dispatch(success(response));
        })
        .catch(err => {
          console.log('neeru---', err.message);
          reject(err);
          dispatch(failure(err));
        });
    });
  };
  function request(payload) {
    return {type: otpTypes.VERIFY_OTP_REQUEST, payload};
  }

  function success(payload) {
    return {type: otpTypes.VERIFY_OTP_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: otpTypes.VERIFY_OTP_ERROR, payload};
  }
};
