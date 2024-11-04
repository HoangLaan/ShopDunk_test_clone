const cache = require('../classes/cache.class');

const removeByKey = async (key) => {
    return new Promise((resolve, reject) => {
        cache.del(key, (err) => {
            if (err) {
                return resolve(false);
            }

            return resolve(true);
        });
    });
};

module.exports = {
    removeByKey,
};
