import httpClient from 'utils/httpClient.js';

const path = '/borrow-type';

export const createBorrowType = (params) => {
  return httpClient.post(`${path}`, params);
};

export const getListBorrowType = (params) => {
  return httpClient.get(`${path}`,{params});
};

export const getDetailBorrowType = borrowTypeID => {
  return httpClient.get(`${path}/${borrowTypeID}`);
};

export const updateBorrowType = (borrowTypeID,params) => {
  return httpClient.put(`${path}/${borrowTypeID}`,params);
};

export const deleteByID = borrowTypeID => {
  return httpClient.delete(`${path}/${borrowTypeID}`);
};

export const deleteListBorrowType = (list_id =[])=> {
  return httpClient.delete(`${path}`,{data:{list_id:list_id} });
};
