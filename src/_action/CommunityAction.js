import { usersService } from "../services/ApiServices";
import setting from "../config/settings";
import convertToCache from "react-native-video-cache";
let cdnPath = setting.cdnUrl.url,
  index = 0,
  dummyData = [];
export const communityTypes = {
  FEED_GET_REQUEST: "FEED_GET_REQUEST",
  FEED_GET_SUCCESS: "FEED_GET_SUCCESS",
  FEED_GET_ERROR: "FEED_GET_ERROR",

  GET_LEARN_REQUEST: "GET_LEARN_REQUEST",
  GET_LEARN_SUCCESS: "GET_LEARN_SUCCESS",
  GET_LEARN_ERROR: "GET_LEARN_ERROR",

  SET_FILTER_STATUS: "SET_FILTER_STATUS",
  SET_SEARCH_STATUS: "SET_SEARCH_STATUS",

  UPDATE_FILTER_DATA: "UPDATE_FILTER_DATA",
  RESET_FILTER_DATA: "RESET_FILTER_DATA",

  GET_CHAT_REQUEST: "GET_CHAT_REQUEST",
  GET_CHAT_SUCCESS: "GET_CHAT_SUCCESS",
  GET_CHAT_ERROR: "GET_CHAT_ERROR",

  CHAT_HISTORY_REQUEST: "CHAT_HISTORY_REQUEST",
  CHAT_HISTORY_SUCCESS: "CHAT_HISTORY_SUCCESS",
  CHAT_HISTORY_ERROR: "CHAT_HISTORY_ERROR",

  GET_COMMENT_REQUEST: "GET_COMMENT_REQUEST",
  GET_COMMENT_SUCCESS: "GET_COMMENT_SUCCESS",
  GET_COMMENT_ERROR: "GET_COMMENT_ERROR",

  ADD_COMMENT_REQUEST: "ADD_COMMENT_REQUEST",
  ADD_COMMENT_SUCCESS: "ADD_COMMENT_SUCCESS",
  ADD_COMMENT_ERROR: "ADD_COMMENT_ERROR",

  USER_LIST_REQUEST: "USER_LIST_REQUEST",
  USER_LIST_SUCCESS: "USER_LIST_SUCCESS",
  USER_LIST_ERROR: "USER_LIST_ERROR",
};
function initialize(type) {
  return {
    type: type,
  };
}

function success(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}

function failure(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}
export const getFeedByUser = (params) => async (dispatch) => {
  dispatch(initialize(communityTypes.FEED_GET_REQUEST));
  try {
    let response = await usersService.getFeedByUser(params);
    dispatch(
      success(
        communityTypes.FEED_GET_SUCCESS,
        response.data.responseData.result
      )
    );
  } catch (err) {
    dispatch(failure(communityTypes.FEED_GET_ERROR, err));
  }
};

export const getLearnAction = (params, getFirstIndexId) => async (dispatch) => {
  dispatch(initialize(communityTypes.GET_LEARN_REQUEST));
  try {
    let response = await usersService.getLearn(params);
    getFirstIndexId &&
      response?.data?.responseData?.result?.length > 0 &&
      getFirstIndexId(response.data.responseData.result[0]._id);
    dispatch(
      success(
        communityTypes.GET_LEARN_SUCCESS,
        response.data.responseData.result
      )
    );
    console.log(
      "videos coming neeraj--------s",
      response.data.responseData.result
    );
    index = 0;
    let data = {};

    dummyData = [...response.data.responseData.result];
    while (index <= dummyData.length - 1) {
      if (dummyData[index].video.includes(cdnPath)) {
        data = convertToCache(dummyData[index].video);
      } else {
        data = convertToCache(cdnPath + dummyData[index].video);
      }

      dummyData[index].video = data;

      index++;
    }

    dispatch(success(communityTypes.GET_LEARN_SUCCESS, dummyData));
  } catch (err) {
    dispatch(failure(communityTypes.GET_LEARN_ERROR, err));
  }
};

export const getChat = (params) => async (dispatch) => {
  console.log("CHAT_DATA")
  dispatch(initialize(communityTypes.GET_CHAT_REQUEST));
  try {
    let response = await usersService.getChatByUser(params);
    dispatch(
      success(communityTypes.GET_CHAT_SUCCESS, response.data.responseData)
    );
  } catch (err) {
    dispatch(failure(communityTypes.GET_CHAT_ERROR, err));
  }
};

export const communitySearchKeyStatus = (value) => (dispatch) => {
  dispatch({ type: communityTypes.SET_SEARCH_STATUS, payload: value });
};

export const communityFilterKeyStatus = (value) => (dispatch) => {
  dispatch({ type: communityTypes.SET_FILTER_STATUS, payload: value });
};

export const communityFilterData = (data) => (dispatch) => {
  dispatch({ type: communityTypes.UPDATE_FILTER_DATA, payload: data });
};

export const resetCommunityFilterData = () => (dispatch) => {
  dispatch({ type: communityTypes.RESET_FILTER_DATA });
};

export const getChatHistory = (params) => async (dispatch) => {

  dispatch(initialize(communityTypes.CHAT_HISTORY_REQUEST));
  try {
    console.log({params})
    let response = await usersService.chatHistory(params);
console.log({response})
    dispatch(
      success(communityTypes.CHAT_HISTORY_SUCCESS, response.data.responseData)
    );
  } catch (err) {
    dispatch(failure(communityTypes.CHAT_HISTORY_ERROR, err));
  }
};

export const getCommentAction = (params) => async (dispatch) => {
  dispatch(initialize(communityTypes.GET_COMMENT_REQUEST));
  try {
    let response = await usersService.getComment(params);
    dispatch(
      success(communityTypes.GET_COMMENT_SUCCESS, response.data.responseData)
    );
  } catch (err) {
    dispatch(failure(communityTypes.GET_COMMENT_ERROR, err));
  }
};

export const addCommentAction = (params) => async (dispatch) => {
  dispatch(initialize(communityTypes.ADD_COMMENT_REQUEST));
  try {
    let response = await usersService.addComment(params);
    dispatch(
      success(communityTypes.ADD_COMMENT_SUCCESS, response.data.responseData)
    );
  } catch (err) {
    dispatch(failure(communityTypes.ADD_COMMENT_ERROR, err));
  }
};

export const getUserList = (params) => async (dispatch) => {
  dispatch(initialize(communityTypes.USER_LIST_REQUEST));
  try {
    let response = await usersService.userList(params);
    dispatch(
      success(communityTypes.USER_LIST_SUCCESS, response.data.responseData)
    );
  } catch (err) {
    dispatch(failure(communityTypes.USER_LIST_ERROR, err));
  }
};
