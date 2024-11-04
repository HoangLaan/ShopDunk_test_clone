const hobbiesService = require('./hobbies.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');

const createOrUpdate = async (req, res, next) => {
  try {
      const serviceRes = await hobbiesService.createOrUpdate(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const getList = async (req, res, next) => {
  try {
      const serviceRes = await hobbiesService.getList(req.query);
      const {data, total, page, limit} = serviceRes.getData();
      return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};


module.exports = {
    createOrUpdate,
    getList,
};
