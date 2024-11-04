const settingService = require('./setting.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const stringHelper = require('../../common/helpers/string.helper');

var admin = require('firebase-admin');

var serviceAccount = require('./hesman-shopdunk-fb9db-firebase-adminsdk-3k8ip-02ef0ad177.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hesman-shopdunk-fb9db-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const updateBiometric = async (req, res, next) => {
    try {
        const {auth_id, publicKey} = req.body;
        let biometricHash = '';
        if (publicKey) {
            biometricHash = stringHelper.encryptString(publicKey);
        }
        const serviceRes = await settingService.updateBiometric(auth_id, publicKey);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse({biometricKey: biometricHash}, 'Update Biometric Success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'Not update Biometric'));
    }
};

const pushNotification = (req, res, next) => {
    console.log(req.body);
    try {
        admin
            .messaging()
            .send({
                topic: 'to-all',
                ...req.body,
            })
            .then(res => {
                return true;
            })
            .catch(err => {
                return false;
            });
        return res.json(new SingleResponse({status: 200}, 'push success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'push success failed'));
    }
};

module.exports = {
    updateBiometric,
    pushNotification,
};
