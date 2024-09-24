import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const ingTypes = {
    // save Activity
    SAVE_ACTIVITY_REQUEST: 'SAVE_ACTIVITY_REQUEST',
   SAVE_ACTIVITY_SUCCESS: 'SAVE_ACTIVITY_SUCCESS',
   SAVE_ACTIVITY_ERROR: 'SAVE_ACTIVITY_ERROR',

    //   get activity 
   GET_ACTIVITY_REQUEST: 'GET_ACTIVITY_REQUEST',
   GET_ACTIVITY_SUCCESS: 'GET_ACTIVITY_SUCCESS',
   GET_ACTIVITY_ERROR: 'GET_ACTIVITY_ERROR',

    //  fitbit activity 
    FITBIT_ACTIVITY_REQUEST: 'FITBIT_ACTIVITY_REQUEST',
    FITBIT_ACTIVITY_SUCCESS: 'FITBIT_ACTIVITY_SUCCESS',
    FITBIT_ACTIVITY_ERROR: 'FITBIT_ACTIVITY_ERROR',
};

export const saveActivityAction = (params) => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .saveActivityInfo(params)
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
        return {type: ingTypes.SAVE_ACTIVITY_REQUEST, payload};
    }

    function success(payload) {
        return {type: ingTypes.SAVE_ACTIVITY_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: ingTypes.SAVE_ACTIVITY_ERROR, payload};
    }
};


export const getActivityAction = (params) => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .getActivityInfo(params)
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
        return {type: ingTypes.GET_ACTIVITY_REQUEST, payload};
    }

    function success(payload) {
        return {type: ingTypes.GET_ACTIVITY_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: ingTypes.GET_ACTIVITY_ERROR, payload};
    }
};

export const fitbitInfoAction = (params) => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .fitbitInfo(params)
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
        return {type: ingTypes.FITBIT_ACTIVITY_REQUEST, payload};
    }

    function success(payload) {
        return {type: ingTypes.FITBIT_ACTIVITY_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: ingTypes.FITBIT_ACTIVITY_ERROR, payload};
    }
};
