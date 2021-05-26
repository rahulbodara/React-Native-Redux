import * as actionTypes from "./actionTypes";

export const actions = {
  setanimation: (payload) => ({
    type: actionTypes.SET_ANIMATION,
    payload,
  }),
};

const initialState = {
  isAnimation: "0",
};

const AnimationData = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ANIMATION: {
      return {
        ...state,
        isAnimation: action.payload,
      };
    }
  }

  return state;
};

export default AnimationData;
