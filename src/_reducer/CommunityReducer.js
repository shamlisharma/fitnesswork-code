import {communityTypes} from '../_action/CommunityAction';

const initialState = {
  getFeedByUser: [],
  getLearn: [],
  getChat: [],
  getCommentData: [],
  chatHistory: [],
  communityList: {
    loading: false,
    data: [],
    error: '',
    filterData: {
      category: [],
      sortValue: '',
    },
    filterKey: false,
    searchKey: false,
  },
};

export const CommunityReducer = (state = initialState, action) => {
  switch (action.type) {
    case communityTypes.FEED_GET_REQUEST:
      return {...state};

    case communityTypes.FEED_GET_SUCCESS:
      return {...state, getFeedByUser: action.payload, error: null};

    case communityTypes.FEED_GET_ERROR:
      return {...state, getFeedByUser: null, error: action.payload};

    // Learn
    case communityTypes.GET_LEARN_REQUEST:
      return {
        ...state,
        communityList: {
          ...state.communityList,
          loading: true,
          error: '',
          data: [],
        },
      };

    case communityTypes.GET_LEARN_SUCCESS:
    
    return {
        ...state,
        getLearn: action.payload,
        communityList: {
          ...state.communityList,
          loading: false,
          data: action.payload,
          error: '',
        },
        error: null,
      };

    case communityTypes.GET_LEARN_ERROR:
      return {
        ...state,
        getLearn: null,
        communityList: {
          ...state.communityList,
          loading: false,
          data: [],
          error: action.payload,
        },
        error: action.payload,
      };

    // chat
    case communityTypes.GET_CHAT_REQUEST:
      return {...state};

    case communityTypes.GET_CHAT_SUCCESS:
      return {...state, getChat: action.payload, error: null};

    case communityTypes.GET_CHAT_ERROR:
      return {...state, getChat: null, error: action.payload};

    case communityTypes.CHAT_HISTORY_REQUEST:
      return {...state};

    case communityTypes.CHAT_HISTORY_SUCCESS:
      return {...state, chatHistory: action.payload, error: null};

    case communityTypes.CHAT_HISTORY_ERROR:
      return {...state, chatHistory: null, error: action.payload};

    case communityTypes.SET_FILTER_STATUS:
      return {
        ...state,
        communityList: {...state.communityList, filterKey: action.payload},
      };

      // comment
    case communityTypes.GET_COMMENT_REQUEST:
      return {...state};

    case communityTypes.GET_COMMENT_SUCCESS:
      return {...state, getCommentData: action.payload, error: null};

    case communityTypes.GET_COMMENT_ERROR:
      return {...state, getCommentData: null, error: action.payload};
    case communityTypes.SET_SEARCH_STATUS:
      return {
        ...state,
        communityList: {...state.communityList, searchKey: action.payload},
      };
    case communityTypes.UPDATE_FILTER_DATA: {
      return {
        ...state,
        communityList: {
          ...state.communityList,
          filterData: {...state.communityList.filterData, ...action.payload},
        },
      };
    }

    case communityTypes.RESET_FILTER_DATA: {
      return {
        ...state,
        communityList: {
          ...state.communityList,
          filterData: {category: [], sortValue: ''},
        },
      };
    }

    default:
      return {...state};
  }
};
