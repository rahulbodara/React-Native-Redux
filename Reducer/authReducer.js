import * as actionTypes from "./actionTypes";

export const actions = {
  authlogin: (payload) => ({
    type: actionTypes.AUTHLOGINDATA,
    payload,
  }),
};

const initialState = {
  authloggedIn: false,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        authloggedIn: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
export default authReducer;
