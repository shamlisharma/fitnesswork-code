import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const contactTypes = {
    // Ingredients List
    CONTACT_US_REQUEST: 'CONTACT_US_REQUEST',
    CONTACT_US_SUCCESS: 'CONTACT_US_SUCCESS',
    CONTACT_US_ERROR: 'CONTACT_US_ERROR',


};

export const contactUsAction = params => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .contactUs(params)
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
        return {type: contactTypes.CONTACT_US_REQUEST, payload};
    }

    function success(payload) {
        return {type: contactTypes.CONTACT_US_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: contactTypes.CONTACT_US_ERROR, payload};
    }
};
