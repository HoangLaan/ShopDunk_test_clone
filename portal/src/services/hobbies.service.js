import httpClient from 'utils/httpClient.js';

const getList = (params) => {
  return httpClient.get('/hobbies', { params });
};

const create = (payload) => {
  return httpClient.post('/hobbies', payload);
};

const HobbiesService = {
  getList,
  create
};

export default HobbiesService;
