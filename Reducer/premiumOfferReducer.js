import * as actionTypes from "./actionTypes";

export const actions = {
  premiumOfferAction: (payload) => ({
    type: actionTypes.PREMIUMOFFER,
    payload,
  }),
};

const initialState = {
  premiumData : []
  
};

const premiumOfferReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PREMIUMOFFER: {
      return {
        premiumData : action.payload,
      };
    }
  }

  return state;
};

export default premiumOfferReducer;