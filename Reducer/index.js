import { combineReducers } from "redux";
import Auth from "./auth";
import AnimationData from "./animation";
import UpcomingStay from "./upcomingstay";
import UpcomingFeed from "./upcomingfeed";
import authLogin from "./authReducer";
import weatherData from "./weather";
import homeguidedata from "./HomeGuideItem";
import feedItem from "./feedItemList";
import refreshNotification from "./appRefreshNotification";
import getNewNotificationReducer from "./getNewNotificationReducer";
import groupData from "./addRemoveGroup";
import homeControlReducer from "./homeControllerReducer";
import premiumOfferReducer from "./premiumOfferReducer";
import homePropertyReducer from "./homePropertyReducer";
export default combineReducers({
  login: Auth,
  animationdata: AnimationData,
  upcoming_stay: UpcomingStay,
  upcoming_feed: UpcomingFeed,
  authLogin: authLogin,
  weatherData: weatherData,
  homeguidedata: homeguidedata,
  feedItems: feedItem,
  refreshNotification: refreshNotification,
  getNewNotificationReducer: getNewNotificationReducer,
  groupData: groupData,
  homeControlReducer : homeControlReducer,
  premiumOfferReducer : premiumOfferReducer,
  homePropertyReducer : homePropertyReducer
});
