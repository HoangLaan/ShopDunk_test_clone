const Transform = require('../../common/helpers/transform.helper');

const template = {
    user_id: '{{#? USERID}}',
};

let transform = new Transform(template);

const biometricHash = (user) => {
    return user && Object.keys(user).length > 0 ? transform.transform(user, [
        "user_id",
    ]) : null;
};


module.exports = {
    biometricHash,
};
