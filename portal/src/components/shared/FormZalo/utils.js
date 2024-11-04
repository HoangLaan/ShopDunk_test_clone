import _ from 'lodash';

const READY_FIELDS = [
  'FULLNAME',
  'EMAIL',
  'PHONENUMBER',
  'BIRTHDAY',
]

const SMS_MAP_FIELDS = {
  'FULLNAME': 'full_name',
  'EMAIL': 'email',
  'PHONENUMBER': 'phone_number',
  'BIRTHDAY': 'birthday',
}

export const TEMPLATE_PARAMS = [
  {
    label: 'Sinh nhật (BIRTHDAY)',
    value: 'birthday',
  },
  {
    label: 'Tên khách hàng (FULLNAME)',
    value: 'full_name',
  },
  {
    label: 'Số điện thoại (PHONENUMBER)',
    value: 'phone_number',
  },
  {
    label: 'Email (EMAIL)',
    value: 'email',
  },
];

export const TEMPLATE_PARAMS_ZALO_PAY = [
  {
    label: 'Tên khách hàng (FULLNAME)',
    value: 'full_name',
  },
  // {
  //   label: 'Tên sản phẩm (PRODUCTNAME)',
  //   value: 'product_name',
  // },
  {
    label: 'Ngày mua hàng (DATE)',
    value: 'date_order',
  },
  {
    label: 'Hóa đơn (BILL)',
    value: 'bill_id',
  }
];

export const getTemplateFields = (templateString = '') => {
  const regex = /<%=\s*(\w+)\s*%>/g;
  const matches = templateString?.matchAll(regex) || [];
  const results = [];
  for (const match of matches) {
    const variableName = match[1];
    results.push(variableName);
  }
  return results
};

export const compliedSMSTemplate = (template = '', dataToComplied) => {
  const templateFields = getTemplateFields(template)
  const compliedObj = {};
  templateFields.forEach((field) => {
    if (!READY_FIELDS.includes(field)) {
      compliedObj[field] = field;
    }
  })

  const compiled = _.template(template);
  READY_FIELDS.forEach((field) => {
    if (template.includes(`<%= ${field} %>`)) {
      compliedObj[field] = dataToComplied?.[SMS_MAP_FIELDS[field]] || field;
    }
  })
  if (template.includes(`<%= INTERESTID %>`)) {
    compliedObj['INTERESTID'] = btoa(`ZALO_${dataToComplied?.customer_code}`);
  }
  const compliedResult = compiled(compliedObj);
  return compliedResult;
};

export const compliedTemplate = (template = '', dataToComplied) => {
  const templateFields = getTemplateFields(template)
  const compliedObj = { ...dataToComplied };
  templateFields.forEach((field) => {
    if (!Object.keys(dataToComplied).includes(field)) {
      compliedObj[field] = `<%= ${field} %>`;
    }
  })

  const compiled = _.template(template);
  const compliedResult = compiled(compliedObj);
  return compliedResult;
};

export const convertToArray = (data) => {
  const stringArray = data.replace(/([{,])\s*(\w+):/g, '$1"$2":');
  return JSON.parse(stringArray);
}