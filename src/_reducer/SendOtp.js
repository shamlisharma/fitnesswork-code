import {otpTypes} from '../_action/otpAction';

const users = {};

export function sendOtp(state = users, action) {
  switch (action.type) {
    case otpTypes.SEND_OTP_REQUEST:
      return {...action.payload};

    case otpTypes.SEND_OTP_SUCCESS:
      return {...action.payload};

    default:
      return {...state};
  }
}
