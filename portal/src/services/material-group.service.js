import httpClient from "utils/httpClient";
import {login} from "./auth.service";

const path = '/material-group';

export const createMaterialGroup = (params = {}) => {
  return httpClient.post(`${path}`, params);
};

export const updateMaterialGroup = (id, params = {}) => {
  return httpClient.put(`${path}/${id}`, params);
};

export const getListMaterialGroup = (params) => {
  return httpClient.get(`${path}`, {params});
};

export const getById = (id) => {
  return httpClient.get(`${path}/${id}`);
};

export const getOptionsTreeView = (params) => {
  return httpClient.get(`${path}/get-options-tree`, { params });
};

export const deleteMaterialGrByID = (id, params = {}) => {
  return httpClient.delete(`${path}/${id}`);
};

export const deleteListMaterialGr = (list_id = []) => {
  return httpClient.delete(`${path}`, {data: {list_id}});
};

export const generateCode = (params) =>{
  return httpClient.get(`${path}/generate-code`, { params });
};
