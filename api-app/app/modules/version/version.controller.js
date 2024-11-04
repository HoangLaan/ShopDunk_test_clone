const SingleResponse = require('../../common/responses/single.response');
const versionService = require ('./version.service');
/**
 * Get getVersion
 */
const getVersion = async (req, res, next) => {
  try {
    const serviceRes = await versionService.getVersion(req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
    getVersion
};
