import mapKeys from 'lodash/mapKeys';
import lodashTemplate from 'lodash/template';

export const changeKeyInArray = (arr, oldKey, newKey) => {
  return arr.map((item) => {
    return mapKeys(item, (value, keyItem) => {
      return keyItem === oldKey ? newKey : keyItem;
    });
  });
};

export const compliedTemplate = (template, data) => {
  const compiled = lodashTemplate(template);
  const compliedObj = {};
  if (template.includes('<%= FULLNAME %>')) {
    compliedObj['FULLNAME'] = data?.full_name || '';
  }
  if (template.includes('<%= EMAIL %>')) {
    compliedObj['EMAIL'] = data?.email || '';
  }
  if (template.includes('<%= PHONENUMBER %>')) {
    compliedObj['PHONENUMBER'] = data?.phone_number || '';
  }
  if (template.includes('<%= BIRTHDAY %>')) {
    compliedObj['BIRTHDAY'] = data?.birthday || '';
  }
  const compliedResult = compiled(compliedObj);
  return compliedResult;
};
