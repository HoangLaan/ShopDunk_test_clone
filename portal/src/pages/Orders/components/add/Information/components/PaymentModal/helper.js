import CryptoJS from 'crypto-js';
import { ONEPAY_ENV } from './constant';
import { getIPAddress as getUserIpAddress } from 'services/auth.service';

const getIPAddress = async () => {
  const res = await getUserIpAddress();
  return res.ip;
};

const createSecureHash = (queryData) => {
  const keyList = Object.keys(queryData)
    .filter((key) => key.includes('vpc_') || key.includes('user_'))
    .sort();

  const queryString = keyList.map((key) => `${key}=${queryData[key]}`).join('&');

  const key = CryptoJS.enc.Hex.parse(ONEPAY_ENV.SECRET_CODE);
  const hash = CryptoJS.HmacSHA256(queryString, key);
  const hashCode = CryptoJS.enc.Hex.stringify(hash).toUpperCase();

  return hashCode;
};

const createPaymentUrl = (url, query) => {
  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  const fullUrl = `${url}?${queryString}`;
  return fullUrl;
};

export { getIPAddress, createSecureHash, createPaymentUrl };
