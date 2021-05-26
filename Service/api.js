import axios from "axios";
import { baseURL } from "../Utils/apiconf";
import AsyncStorage from "@react-native-async-storage/async-storage";

let userToken = "";
export const getToken = async () => {
  userToken = await AsyncStorage.getItem("@user_token");
};
getToken();
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `${userToken}`,
  },
});

api.interceptors.request.use(function (config) {
  config.headers.Authorization = userToken ? `${userToken}` : "";
  return config;
});

export const checkEmail = async (email) => {
  try {
    const { data } = await api.get(`/user/${email}`);
    console.log("Email address in API", data);
    return data;
  } catch (e) {
    return e.message;
  }
};

export const userRegister = async (postData = {}) => {
  try {
    const { data } = await api.post("/user", { ...postData });
    return data;
  } catch (e) {
    console.log(e.response.data);
    return false;
  }
};

export const userLogin = async (postData = {}) => {
  try {
    const { data } = await api.post("/user/login", { ...postData });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const userLoginHistory = async (postData = {}) => {
  try {
    const { data } = await api.post("/user/loginHistory", { ...postData });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const upcomingStay = async (userID) => {
  try {
    await getToken();
    const { data } = await api.get(`/upcomingStay/${userID}`);
    console.log("Valu of data in upcoming stay is", data);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const upcomingGuideitem = async (propertyId) => {
  try {
    await getToken();
    const { data } = await api.get(`/upcomingStayGuideItems/${propertyId}`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const weatherDataAPI = async (zipcode) => {
  try {
    await getToken();
    const { data } = await api.get(`upcomingStayWeather/${zipcode}`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const upcomingFeed = async (propertyId) => {
  try {
    await getToken();
    const { data } = await api.get(`/upcomingStayFeed/${propertyId}`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const upcomingFeedListItem = async (marketId) => {
  try {
    await getToken();
    const { data } = await api.get(`/upcomingStayListItems/${marketId}/1`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const upcomingFeedDetail = async (bookingID) => {
  try {
    await getToken();
    const { data } = await api.get(`/upcomingFeedDetail/${bookingID}`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const appRefreshtoken = async (propertyId, userId) => {
  try {
    await getToken();
    const { data } = await api.get(
      `/appRefreshNotifications/${propertyId}/${userId}`
    );
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const clearrefreshNotification = async (propertyId, userId) => {
  try {
    await getToken();
    const { data } = await api.get(
      `/clearAppRefreshNotifications/${propertyId}/${userId}`
    );
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const getNewnotification = async (userID) => {
  try {
    await getToken();
    const { data } = await api.get(`getNewNotifications/${userID}/1`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const setClearNotification = async (userID) => {
  try {
    await getToken();
    const { data } = await api.get(`/setClearNewNotifications/${userID}`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const setMarkNotification = async (postData = {}) => {
  try {
    const { data } = await api.post("setMarkNotificationsAsRead", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const sendTFACode = async (postData = {}) => {
  try {
    const { data } = await api.post("/user/sendTFA_Code", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export const verifyCode = async (postData = {}) => {
  try {
    const { data } = await api.post("/user/sendTFA_Code", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getGroupList = async (bookingId) => {
  try {
    await getToken();
    const { data } = await api.get(`/getGroups/${bookingId}`);
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const getuserList = async () => {
  try {
    await getToken();
    const { data } = await api.get("user");
    return data;
  } catch (e) {
    return e.response.data;
  }
};

export const addUpdateUserInfo = async (postData = {}) => {
  try {
    const { data } = await api.post("/addUpdateUserInfo", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addRemoveUser = async (postData = {}) => {
  try {
    const { data } = await api.post("/addRemoveUsersToBookings", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const createTicket = async (postData = {}) => {
  try {
    const { data } = await api.post("/createTicket", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const HomeControlData = async (propertyId) => {
  try {
    const { data } = await api.get(`homeControls/${propertyId}`);
   // console.log("Email address in API", data);
    return data;
  } catch (e) {
    return e.message;
  }
};

export const PremiumOffer = async (propertyId,bookingID) => {
  try {
    const { data } = await api.get(`premiumOffers/${propertyId}/${bookingID}`);
   // console.log("Email address in API", data);
    return data;
  } catch (e) {
    return e.message;
  }
};

export const purchasePremiumOffer = async (postData = {}) => {
  try {
    const { data } = await api.post("/purchasePremiumOffers", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const paymentToken = async () => {
  try {
    const { data } = await api.get('getToken');
   // console.log("Email address in API", data);
    return data;
  } catch (e) {
    return e.message;
  }
};

// Bind API for payments

export const makePayment = async (postData = {}) => {
  try {
    const { data } = await api.post("/makePayment", {
      ...postData,
    });
    return data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const propertyRoom = async (propertyId) => {
  try {
    const { data } = await api.get(`propertyRoom/${propertyId}`);
   // console.log("Email address in API", data);
    return data;
  } catch (e) {
    return e.message;
  }
};