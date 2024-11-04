const {default: axios} = require('axios');
var crypto = require('crypto');
var moment = require('moment');
const {set, get, getByHash, delHash, del, setV2} = require('../../common/helpers/redis.helper');
const querystring = require('qs');

const configLazada = {
    app_key: process.env.LAZADA_PARTNER_ID,
    secret_key: process.env.LAZADA_SERECT_KEY,
    linkAuth: process.env.LAZADA_AUTH_URL,
    linkApi: process.env.LAZADA_API_URL,
    sign_method: process.env.LAZADA_METHOD,
};

const sortObject = obj => {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] =obj[str[key]]
    }
    return sorted;
};


// const sortObjectString = obj => {
//   var sorted = {};
//   var str = [];
//   var key;
//   for (key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         str.push(encodeURIComponent(key));
//       }
//   }
//   // str.sort();
//   for (key = 0; key < str.length; key++) {
//       if(Array.isArray(obj[str[key]])){
//         sorted[str[key]] = encodeURIComponent(JSON.stringify(obj[str[key]]))
//       }else{
//         sorted[str[key]] = obj[str[key]]
//       }
//   }
//   return sorted;
// };

const getSignLazada = (apiName, request = {}, body = '') => {
    request = sortObject(request);
    let query = `${apiName}`;
    for (let key in request) {
        query += `${key}${request[key]}`;
    }
    if (body) {
        query += body;
    }
    var hmac = crypto.createHmac('sha256', configLazada.secret_key);
    var signed = hmac.update(new Buffer(query, 'utf-8')).digest('hex').toUpperCase();
    return signed;
};

const buildParamater = (request = {}, apiName) => {
    let value = {
        app_key: configLazada.app_key,
        timestamp: moment.utc().valueOf(),
        sign_method: configLazada.sign_method,
    };
    let valueSign = Object.assign({}, value, request);
    let sign = getSignLazada(apiName, valueSign);
    valueSign.sign = sign;
    return valueSign;
};

const doGetLazada = async (apiName, params, isAuth = false, sellerId = null) => {
    try {
        const headers =  {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        let url = (isAuth ? configLazada.linkAuth : configLazada.linkApi) + apiName;
        let {data} = await axios.get(url, {params} , {headers});
        let {code} = data || {};
        if (data.code == '0') return data;
        else if (code == 'IllegalAccessToken') {
            //Refresh Token
            if (sellerId) {
                let token = await refreshTokenLazada(sellerId);
                let re_params = buildParamater(
                    {
                        access_token: token.access_token,
                    },
                    apiName,
                );
                //Recall api
                let {data: _data} = await axios.get(url, {params: re_params});
                return _data;
            } else return data;
        } else {
            return data;
        }
    } catch (error) {
        console.log({error});
        throw error;
    }
};

const doGetLazadaQueryString = async (apiName, params, isAuth = false, sellerId = null) => {
  try {
      const headers =  {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
      let url = (isAuth ? configLazada.linkAuth : configLazada.linkApi) + apiName;
      let res = await axios.get(url, {params} , {headers});
      let {data} = res
      let {code} = data || {};
      if (data.code == '0') return data;
      else if (code == 'IllegalAccessToken') {
          //Refresh Token
          if (sellerId) {
              let token = await refreshTokenLazada(sellerId);
              let re_params = buildParamater(
                  {
                      access_token: token.access_token,
                  },
                  apiName,
              );
              //Recall api
              let {data: _data} = await axios.get(url, {params: re_params});
              return _data;
          } else return data;
      } else {
          return data;
      }
  } catch (error) {
      console.log({error});
      throw error;
  }
};




const doPostLazada = async (apiName, params, isAuth = false, sellerId = null) => {
  try {
      let url = (isAuth ? configLazada.linkAuth : configLazada.linkApi) + apiName;
      const _queryString = querystring.stringify(params, { encode: true });
      const headers =  {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
      let {data} = await axios.post(url, _queryString , {headers});
      let {code} = data || {};
      if (data.code == '0') return data;
      else if (code == 'IllegalAccessToken') {
          //Refresh Token
          if (sellerId) {
              let token = await refreshTokenLazada(sellerId);
              let _params = buildParamater(
                  {
                      access_token: token.access_token,
                  },
                  apiName,
              );
              //Recall api
              let {data: _data} = await axios.post(url,_params);
              return _data;
          } else return data;
      } else {
          return data;
      }
  } catch (error) {
      console.log({error});
      throw error;
  }
};
// const doPostLazada = async (apiName, params, isAuth = false, sellerId = null) => {
//     try {
//         let url = (isAuth ? configLazada.linkAuth : configLazada.linkApi) + apiName;
//         let {data} = await axios.post(url, {params});
//         let {code = ''} = data || {};
//         if (code == '0') return data;
//         else if (code == 'IllegalAccessToken') {
//             //Refresh Token
//             if (sellerId) {
//                 let token = await refreshTokenLazada(sellerId);
//                 let {access_token} = token;
//                 let _params = buildParamater(
//                     {
//                         access_token,
//                     },
//                     apiName,
//                 );
//                 //Recall api
//                 let {data: _data} = await axios.post(url, _params);
//                 return _data;
//             } else return data;
//         } else {
//             return data;
//         }
//     } catch (error) {
//         throw error;
//     }
// };

const refreshTokenLazada = async (sellerId = null) => {
    try {
        let apiName = '/auth/token/refresh';
        let stringToken = await get(`LAZADA-TOKEN:${sellerId}`);
        let dataToken = JSON.parse(`${JSON.parse(stringToken)}`);
        let {refresh_token = ''} = dataToken || {};
        let params = buildParamater({refresh_token}, apiName);
        let {data} = await axios.get(`${configLazada.linkAuth}${apiName}`, {params});
        let {code = '0'} = data || {};
        if (code == '0') {
            //SetRedis
            setV2(`LAZADA-TOKEN:${sellerId}`, data);
            return data;
        }
        throw new Error('Error Refresh Token');
    } catch (error) {
        throw error;
    }
};

module.exports = {
    configLazada,
    sortObject,
    getSignLazada,
    buildParamater,
    doPostLazada,
    doGetLazada,
    doGetLazadaQueryString
};
