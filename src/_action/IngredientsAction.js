import promise from 'bluebird';
import {usersService} from '../services/ApiServices';

export const ingTypes = {
    // Ingredients List
    GET_INGREDIENT_REQUEST: 'GET_INGREDIENT_REQUEST',
    GET_INGREDIENT_SUCCESS: 'GET_INGREDIENT_SUCCESS',
    GET_INGREDIENT_ERROR: 'GET_INGREDIENT_ERROR',


};

export const getIngListAction = params => {
    return function (dispatch) {
        return new promise(function (resolve, reject) {
            dispatch(request(params));
            usersService
                .getIngredientList(params)
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
        return {type: ingTypes.GET_INGREDIENT_REQUEST, payload};
    }

    function success(payload) {
        return {type: ingTypes.GET_INGREDIENT_SUCCESS, payload};
    }

    function failure(payload) {
        return {type: ingTypes.GET_INGREDIENT_ERROR, payload};
    }
};
