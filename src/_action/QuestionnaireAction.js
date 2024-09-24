import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const questTypes = {
    // Quest List
    QUESTIONNAIRE_REQUEST: 'QUESTIONNAIRE_REQUEST',
    QUESTIONNAIRE_SUCCESS: 'QUESTIONNAIRE_SUCCESS',
    QUESTIONNAIRE_ERROR: 'QUESTIONNAIRE_ERROR',

    // Get Questionnaire 
    GET_QUESTIONNAIRE_REQUEST: 'GET_QUESTIONNAIRE_REQUEST',
    GET_QUESTIONNAIRE_SUCCESS: 'GET_QUESTIONNAIRE_SUCCESS',
    GET_QUESTIONNAIRE_ERROR: 'GET_QUESTIONNAIRE_ERROR',
};

export const questionnaireAction = params => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .questionnaire(params)
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
        return {type: questTypes.QUESTIONNAIRE_REQUEST, payload};
    }

    function success(payload) {
        return {type: questTypes.QUESTIONNAIRE_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: questTypes.QUESTIONNAIRE_ERROR, payload};
    }
};

export const getQuestionnaireAction = params => {
    //console.log("dispatch params of getQuestionnaireAction",params)
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .getQuestionnaire(params)
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
        return {type: questTypes.GET_QUESTIONNAIRE_REQUEST, payload};
    }

    function success(payload) {
        return {type: questTypes.GET_QUESTIONNAIRE_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: questTypes.GET_QUESTIONNAIRE_ERROR, payload};
    }
};
