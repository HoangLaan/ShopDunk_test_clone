import moment from 'moment';
export const stepsLazada = [
  {
      title: 'Kết nối gian hàng trên sàn',
      // content: 'First-content',
  },
  {
      title: 'Liên kết hàng hóa trên sàn với hàng hóa',
      // content: 'Second-content',
  },
  {
      title: 'Thiết lập tính năng đồng bộ',
      // content: 'Last-content',
  },
];

export const convertArrayToObjectShopee = (array = []) => {
    return array.reduce((a, v) => ({ ...a, [v?.item_id]: v }), {})
}

export const convertArrayToObjectShopeeOrder = (array = []) => {
    return array.reduce((a, v) => ({ ...a, [v?.order_sn]: v }), {})
}

export const convertArrayToObjectLazadaProduct = (array = []) =>{
    return array.reduce((a,v) => ({...a , [v?.SkuId] : v }), {})
}

export const convertTimeStampToDate = timeStamp => {
    return ` - ${moment.unix(timeStamp).format('DD/MM/YYYY')}`;
};