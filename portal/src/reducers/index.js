import authReducer from 'pages/LoginPage/slice/authSlice';
import coupon from 'pages/Coupon/reducers';
import global from 'reducers/global';
import position from 'pages/Position/reducers';
import timeKeeping from 'pages/TimeKeeping/reducers';
import stocksTakeRequest from 'pages/StocksTakeRequest/reducers';
import pricesReducer from 'pages/Prices/reducers/index';
import ordersReducer from 'pages/Orders/reducers/index';
import reviewReducer from 'pages/ReviewList/reducers/index';
import { mailbox } from 'pages/Mail/reducers/index';
//import { mailbox } from 'pages/Mail/reducers/index';
import { announce } from 'pages/Announce/reducers/index';
import fileManager from 'pages/FileManager/reducers/file-manager';
import voidIp from 'pages/VoidIp/reducers';
import shopProfile from 'pages/SellerStore/reducers';
import { scfacebook } from 'pages/SaleChannelFacebook/reducers';
import { scFacebookPerTist } from 'pages/SaleChannelFacebook/reducers/scfacebook-pertist';
import webSiteReducer from 'pages/websiteDirectory/reducers/index';
const reducers = {
  global: global,
  auth: authReducer,
  position: position,
  timeKeeping: timeKeeping,
  coupon: coupon,
  stocksTakeRequest: stocksTakeRequest,
  prices: pricesReducer,
  orders: ordersReducer,
  review: reviewReducer,
  mailbox: mailbox,
  //mailbox: mailbox,
  announce: announce,
  website: webSiteReducer,
  fileManager: fileManager,
  voidIp: voidIp,
  shopProfile: shopProfile,
  scfacebook: scfacebook,
  scFacebookPerTist: scFacebookPerTist,
};

export default reducers;
