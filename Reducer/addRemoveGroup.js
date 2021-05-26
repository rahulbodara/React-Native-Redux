import * as actionTypes from "./actionTypes";

export const actions = {
  groupDataAction: (payload) => ({
    type: actionTypes.ADDREMOVEGROUP,
    payload,
  }),
};

const initialState = {
  addRemove: [],
};

const groupData = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADDREMOVEGROUP: {
      return {
        addRemove: action.payload,
      };
    }
  }

  return state;
};

export default groupData;
