//
import Model from "../Model"
// Entities
import ModelEntity from "../ModelEntity"

/**
 * @class ModelModel
 */
export default class ModelModel extends Model {
    /** @var {String} redux store::state key */
    _stateKeyName = "model"

    /** @var {Ref} */
    _entity = ModelEntity

    /** @var {String} */

    static API_MODEL_LIST = "model"
    static API_MODEL_CATEGORY_GET_OPTION = "product-category/get-options-for-list"
    static API_MODEL_OPTION_ATTRIBUTE = "model/attribute"
    static API_MODEL_CREATE = "model"
    static API_MODEL_DETAIL = "model/:id" //GET
    static API_MODEL_COUNT_BY_CODE = "model/count-by-code" //GET

    static API_MODEL_GET_NUMBER_CODE = "model/code" //GET

    static API_MODEL_DELETE = "model/:id"
    static API_MODEL_READ = "model/:id"
    /**
     *
     * @var {String} Primary Key
     */
    primaryKey = "model-id"

    /**
     * Column datafield prefix
     * @var {String}
     */
    static columnPrefix = ""

    /**
     * jqx's grid columns & datafields!
     * @var {Array}
     */
    static _jqxGridColumns = []

    /**
     * @return {Object}
     */
    fillable = () => ({})

    /**
     *
     * @param {object} data
     */
    /**
     * Get options (list opiton)
     * @param {Object} _opts
     * @returns Promise
     */

    getOptionsCategory(_opts = {}) {
        let opts = Object.assign({}, _opts)
        return this._api.get(_static.API_MODEL_CATEGORY_GET_OPTION, opts)
    }

    getListModel(_opts = {}) {
        // Get, format input
        let opts = Object.assign({}, _opts)
        return this._api.get(_static.API_MODEL_LIST, opts)
    }
    getOptionsAttribute(_opts = {}) {
        // Get, format input
        let opts = Object.assign({}, _opts)
        return this._api.get(_static.API_MODEL_OPTION_ATTRIBUTE, opts)
    }

    create(_data = {}) {
        // Validate data?!
        let data = Object.assign({}, _data)
        //
        return this._api.post(_static.API_MODEL_CREATE, data)
    }
    update(id, _data) {
        // Validate data?!
        let data = Object.assign({}, _data)
        //
        return this._api.put(_static.API_MODEL_DETAIL.replace(":id", id), data)
    }
    getCountByCode(_opts) {
        let opts = Object.assign({}, _opts)
        return this._api.get(_static.API_MODEL_COUNT_BY_CODE, opts)
    }

    delete(id, _data = {}) {
        // Validate data?!
        let data = Object.assign({}, _data)
        //
        return this._api.delete(_static.API_MODEL_DELETE.replace(":id", id), data)
    }

    readVer1(id, _data = {}) {
        // Validate data?!
        let data = Object.assign({}, _data)
        //
        return this._api.get(_static.API_MODEL_READ.replace(":id", id), data)
    }


    readVer1(id, _data = {}) {
        // Validate data?!
        let data = Object.assign({}, _data)
        //
        return this._api.get(_static.API_MODEL_READ.replace(":id", id), data)
    }

    getNumberCode(_data = {}) {
        // Validate data?!
        let data = Object.assign({}, _data);
        // console.log(data)
        return this._api.get('/model/code', data);
    }

    getWaperiodOptions(_data = {}) {
        let data = Object.assign({}, _data);
        return this._api.get('/model/options-waperiod', data);
    }
}
// Make alias
const _static = ModelModel
