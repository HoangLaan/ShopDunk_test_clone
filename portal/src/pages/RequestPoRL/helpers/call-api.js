import httpClient from 'utils/httpClient';

const route = '/request-po-rl'


export const getList = (params) => {
  return httpClient.get(route, { params })
}

export const create = (params) => {
  return httpClient.post(route, params)
}

export const update = (id, params) => {
  return httpClient.put(route + `/${id}`, params)
}

export const read = (id, params) => {
  return httpClient.get(route + `/${id}`, params)
}

export const deleteItem = (list_id) => {
  return httpClient.delete(route + `/delete`, { data: { list_id } })
}

// export const getOffworkRLOptions = (params) => {
//   return httpClient.get(`/${route}/get-options`, { params })
// }

export const getUserReview = (id, params) => {
  return httpClient.get(`${route}/${id}/users`, { params })
}



