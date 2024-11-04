import moment from 'moment';

const mapDataCategory = (data = {}) => {
  data.items = data?.items?.map((category) => ({
    category_id: category.product_category_id,
    category_name: category.category_name,
    parent_name: category.parent_name,
  }));

  return data;
};

const mapDataProduct = (data = {}) => {
  data.items = data?.items?.map((category) => ({
    product_id: category.product_id,
    product_code: category.product_code,
    product_name: category.product_name,
    category_name: category.category_name,
    is_active: category.is_active,
  }));

  return data;
};

const mergeArrayData = (data1, data2, uniqueField) => {
  return data1.concat(data2).filter((item, index, self) => {
    return index === self.findIndex((t) => t[uniqueField] === item[uniqueField]);
  });
};

const onUploadProgress = (event, setProgress) => {
  const percent = Math.floor((event.loaded / event.total) * 100);
  setProgress(percent);
  if (percent === 100) {
    setTimeout(() => setProgress(0), 100);
  }
};

const getStartEndDateOfMonth = (monthStart, monthEnd, year = moment().year()) => {
  return {
    startDate: moment(`${monthStart}-${year}`, 'MM-YYYY').startOf('month').format('DD/MM/YYYY'),
    endDate: moment(`${monthEnd ?? monthStart}-${year}`, 'MM-YYYY')
      .endOf('month')
      .format('DD/MM/YYYY'),
  };
};

const convertValueToString = (list) => {
  return list.map((item) => ({ ...item, value: String(item.value) }));
};

export {
  mapDataCategory,
  mergeArrayData,
  mapDataProduct,
  onUploadProgress,
  getStartEndDateOfMonth,
  convertValueToString,
};
