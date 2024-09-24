import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const notificationTypes = {
    // Ingredients List
    NOTIFICATION_REQUEST: 'NOTIFICATION_REQUEST',
    NOTIFICATION_SUCCESS: 'NOTIFICATION_SUCCESS',
    NOTIFICATION_ERROR: 'NOTIFICATION_ERROR',


};

export const notificationAction = params => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .notification(params)
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
        return {type: notificationTypes.NOTIFICATION_REQUEST, payload};
    }

    function success(payload) {
        return {type: notificationTypes.NOTIFICATION_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: notificationTypes.NOTIFICATION_ERROR, payload};
    }
};
