const mongoose = require('mongoose');
const config = require('../../../config/config').mongo;

const connect = options => {
    mongoose.connect(config.url, options);

    mongoose.connection.on('error', error => {
        console.log(`[MongoDB] ${JSON.stringify(error)}`);
    });

    // mongoose.connection.on('connected', () => {
    //     console.log('[MongoDB] Connected');
    // });

    // mongoose.connection.on('disconnected', () => {
    //     console.log('[MongoDB] Disconnected');
    // });
};

// #region --- Plugin ---
const toJSON = schema => {
    let transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            if (schema.options.removePrivatePaths !== false) {
                removePrivatePaths(ret, schema);
            }

            if (schema.options.removeVersion !== false) {
                removeVersion(ret);
            }

            if (schema.options.normalizeId !== false) {
                normalizeId(ret);
            }

            if (transform) {
                return transform(doc, ret, options);
            }

            return ret;
        },
    });

    const normalizeId = ret => {
        if (ret._id && typeof ret._id === 'object' && ret._id.toString) {
            if (typeof ret.id === 'undefined') {
                ret.id = ret._id.toString();
            }
        }
        if (typeof ret._id !== 'undefined') {
            delete ret._id;
        }
    };

    const removePrivatePaths = (ret, schema) => {
        for (const path in schema.paths) {
            if (schema.paths[path].options && schema.paths[path].options.private) {
                if (typeof ret[path] !== 'undefined') {
                    delete ret[path];
                }
            }
        }
    };

    const removeVersion = ret => {
        if (typeof ret.__v !== 'undefined') {
            delete ret.__v;
        }
    };
};

module.exports = {
    toJSON,
    connect,
};
