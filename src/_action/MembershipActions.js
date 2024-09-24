import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const ingTypes = {
  // Ingredients List
  GET_MEMBERSHIP_REQUEST: 'GET_MEMBERSHIP_REQUEST',
  GET_MEMBERSHIP_SUCCESS: 'GET_MEMBERSHIP_SUCCESS',
  GET_MEMBERSHIP_ERROR: 'GET_MEMBERSHIP_ERROR',

  STORE_MEMBERSHIP_PRICE_DATA: 'STORE_MEMBERSHIP_PRICE_DATA',
};

export const getMembershipPlan = params => {
  // console.log('eqwqwe');
  return function (dispatch) {
    return new promise(function (resolve, reject) {
      dispatch(request(params));
      usersService
        .memberShipGetPlan(params)
        .then(response => {
          console.log('kulu', JSON.stringify(response));
          resolve(response);
          dispatch(success(response));
        })
        .catch(err => {
          console.log('eaea', err);
          reject(err);
          dispatch(failure(err));
        });
    });
  };
  function request(payload) {
    return {type: ingTypes.GET_MEMBERSHIP_REQUEST, payload};
  }

  function success(payload) {
    return {type: ingTypes.GET_MEMBERSHIP_SUCCESS, payload};
  }

  function failure(payload) {
    return {type: ingTypes.GET_MEMBERSHIP_ERROR, payload};
  }
};

export const storeMembershipPriceData = data => ({
  type: ingTypes.STORE_MEMBERSHIP_PRICE_DATA,
  payload: data,
});
