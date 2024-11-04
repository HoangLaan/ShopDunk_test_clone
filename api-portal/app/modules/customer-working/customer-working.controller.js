const customerWorkingService = require('./customer-working.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

const getList = async (req, res, next) => {
  try {
      const serviceRes = await customerWorkingService.getList(req.query);

      const { data, total, page, limit } = serviceRes.getData();
      return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
      const customerWorkingId = req.params.customerWorkingId;
      const serviceRes = await customerWorkingService.getById(customerWorkingId);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};

const createOrUpdate = async (req, res, next) => {
  try {
      const serviceRes = await customerWorkingService.createOrUpdate(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};

/**
 * delete
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteTask = async (req, res, next) => {
  try {
      // Delete
      const serviceRes = await customerWorkingService.deleteTask(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getStoreByUser = async (req, res, next) => {
  try {
      const serviceRes = await customerWorkingService.getStoreByUser(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
    getList,
    getById,
    createOrUpdate,
    deleteTask,
    getStoreByUser,
};
