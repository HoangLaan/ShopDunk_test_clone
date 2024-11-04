function isPlainObject(data, rtnData) {
  let rs = '[object Object]' === Object.prototype.toString.call(data);
  return undefined !== rtnData ? (rs ? data : rtnData) : rs;
}

function Lang(text, params) {
  let data = params instanceof Array || isPlainObject(params) ? params : [];
  let str = text;
  for (let key in data) {
    let val = data[key];
    str = str.replace('%' + key + '$', val);
  }
  return str;
}
export default Lang;
