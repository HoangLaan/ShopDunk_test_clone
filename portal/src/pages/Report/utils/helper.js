import moment from "moment";

export const dateReport = (obj) => {
    if(obj?.value == null || obj?.value === 1 || obj?.value === 2){
      return `Ngày ${obj?.from_date} - ${obj?.to_date}`
    } else if (obj?.value === 19) { //Nam nay
      return
    } else if (obj?.value === 20) {
      return `Tháng ${moment().format('MM')} năm ${moment().year()}`
    } else if (obj?.value === 21) {
      return `Quý ${moment().quarter()} năm ${moment().year()}`
    } else {
      return `${obj?.label} năm ${moment().year()}`
    }
  }

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };
  
  const getTextAfterLabel = (string, label) => {
    return string.toLowerCase().startsWith(label.toLowerCase()) ? string.slice(label.length).trim() : string;
  };
  
  export const convertedArr = (arr = []) => {
    const regions = [];
    const others = [];
  
    arr.forEach(item => {
      const textBeforeHyphen = item.split('-')[0].trim();
      const textAfterHyphen = item.split('-')[1]?.trim();
      
      const cleanedText = getTextAfterLabel(textBeforeHyphen, 'Chi nhánh');
      
      if (textBeforeHyphen.toLowerCase().startsWith('chi nhánh')) {
        regions.push(capitalizeWords(cleanedText));
      } else {
        others.push(capitalizeWords(textBeforeHyphen));
      }
    });
  
    if (regions.length === 0 && others.length > 0) {
      return `Chi nhánh: ${others.join(', ')}`;
    }
  
    const regionsString = regions.length > 0 ? `Chi nhánh: ${regions.join(', ')}` : '';
    const othersString = others.length > 0 ? `, ${others.join(', ')}` : '';
  
    return `${regionsString}${othersString}`;
  };

export const monthDefault = `Tháng ${moment().format('MM')}`