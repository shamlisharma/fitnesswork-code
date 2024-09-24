import {ingTypes} from '../_action/MembershipActions';

const initialState = {
  membershipData: {},
  membershipPriceData: {
    standardPrice: 0,
    premiumPrice: 0,
    freeTrialPrice: 0,
    iapProducts: [],
  },
};
export function membershipReducer(state = initialState, action) {
  switch (action.type) {
    case ingTypes.GET_MEMBERSHIP_REQUEST:
      return {
        ...state,
        membershipData: action.payload,
      };

    case ingTypes.GET_MEMBERSHIP_SUCCESS:
      return {
        ...state,
        membershipData: action.payload,
      };
    case ingTypes.STORE_MEMBERSHIP_PRICE_DATA:
      return {
        ...state,
        membershipPriceData: action.payload,
      };

    default:
      return {...state};
  }
}
