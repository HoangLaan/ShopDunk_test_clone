const mongoose = require('mongoose');
// const mongooseDelete = require('mongoose-delete');
const paginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const coMessage = new Schema(
    {
        cId: {
            type: Number,
            default: null,
        },
        message: {
            files: [
                {
                    path: {
                        type: String,
                        default: null,
                    },
                    name: {
                        type: String,
                        default: null,
                    },
                },
            ],
            text: {
                type: String,
                default: null,
            },
        },
        isPin: {
            type: Boolean,
            default: false,
        },
        pinUser: {
            type: String,
            default: null,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        createdUser: {
            type: String,
            default: null,
        },
    },
    {
        collection: 'message',
        timestamps: true,
    },
);

// Add plugin
// coMessage.plugin(mongooseDelete, {deleteAt: true, overrideMethods: 'all'});
coMessage.plugin(paginate);

module.exports = mongoose.model('Message', coMessage);
