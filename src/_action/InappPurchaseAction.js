import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const iapTypes = {
    // Ingredients List
    IAP_REQUEST: 'IAP_REQUEST',
    IAP_SUCCESS: 'IAP_SUCCESS',
    IAP_ERROR: 'IAP_ERROR',


};

export const iapAction = params => {

    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .inAppPurchase(params)
                .then(response => {
                    console.log({response});
                    resolve(response);
                    dispatch(success(response));
                })
                .catch(err => {
                    console.log('eerrr', err);
                    reject(err);
                    dispatch(failure(err));
                
                });
        });
    };
    function request(payload) {
        return {type: iapTypes.IAP_REQUEST, payload};
    }

    function success(payload) {
        return {type: iapTypes.IAP_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: iapTypes.IAP_ERROR, payload};
    }
};
