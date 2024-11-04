const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    created_date: '{{#? CREATEDDATE}}',
    customer_id: '{{#? CUSTOMERID}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    full_name_so: '{{#? FULLNAMESO}}',
    gender: '{{GENDER ? 1 : 0}}',
    birthday: '{{#? BIRTHDAY}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    address: '{{#? ADDRESS}}',
    description: '{{#? DESCRIPTION}}',
    task_type_id: '{{#? TASKTYPEID}}',
    task_type_name: '{{#? TASKTYPENAME}}',
    store_code: '{{#? STORECODE}}',
    store_name: '{{#? STORENAME}}',
    order_no: '{{#? ORDERNO}}',
    order_date: '{{#? ORDERDATE}}',
    source_name: '{{#? SOURCENAME}}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    work_flow_name: '{{#? WORKFLOWNAME}}',
    TASKWORKFLOW: '{{#? TASKWORKFLOW}}',
    task_detail_id: '{{#? TASKDETAILID}}',
    task_id: '{{#? TASKID}}',
    source_id: '{{#? SOURCEID}}',
    store_id: '{{#? STOREID}}',
    member_id: '{{#? MEMBERID}}',
    dataleads_id: '{{#? DATALEADSID}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    value: '{{#? VALUE}}',
    label: '{{#? LABEL}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    employee: '{{#? EMPLOYEE}}',
    his_change_date: '{{#? HISCHANGEDATE}}',
    tranfer_date: '{{#? TRANSFERDATE}}',
    tranfer_user: '{{#? TRANSFERUSER}}',
    order_category_name: '{{#? ORDERCATEGORYNAME}}',
    order_note: '{{#? ORDERNOTE}}',
    model_name: '{{#? MODELNAME}}',
    store_name_order: '{{#? STORENAMEORDER}}',
    favorite_category_name: '{{#? FAVORITECATEGORYNAME}}',
    favorite_product_name: '{{#? FAVORITEPRODUCTNAME}}',
    brand_name: '{{#? BRANDNAME}}',
    id_lienhe: '{{#? IDLIENHE}}',
    ngay_tao: '{{#? NGAYTAO}}',
    khach_hang: '{{#? CUSTOMERNAME}}',
    sdt: '{{#? PHONENUMBER}}',
    buoc_cu: '{{#? BUOCCU}}',
    buoc_moi: '{{#? BUOCMOI}}',
    ngay_chuyen: '{{#? NGAYCHUYEN}}',
    nguoi_chuyen: '{{#? NGUOICHUYEN}}',
    type_purchase: '{{TYPEPURCHASE}}',
    order_id: '{{ORDERID}}'
};

let transform = new Transform(template);

const customerOfTaskList = (list = []) => {
    return transform.transform(list, [
        'created_date',
        'customer_id',
        'customer_code',
        'customer_name',
        'full_name_so',
        'gender',
        'birthday',
        'phone_number',
        'email',
        'address',
        'description',
        'task_type_id',
        'task_type_name',
        'store_code',
        'store_name',
        'order_no',
        'order_date',
        'source_name',
        'task_work_flow_id',
        'TASKWORKFLOW',
        'task_detail_id',
        'task_id',
        'source_id',
        'store_id',
        'is_active',
        'his_change_date',
        'tranfer_date',
        'tranfer_user',
        'type_purchase',
        'order_id'
    ]);
};

const customerOfTaskListExportExcel = (list = []) => {
    return transform.transform(list, [
        'created_date',
        'customer_id',
        'customer_code',
        'customer_name',
        'full_name_so',
        'gender',
        'birthday',
        'phone_number',
        'email',
        'address',
        'description',
        'task_type_id',
        'task_type_name',
        'store_code',
        'store_name',
        'order_no',
        'order_date',
        'source_name',
        'task_work_flow_id',
        'work_flow_name',
        'TASKWORKFLOW',
        'task_detail_id',
        'task_id',
        'source_id',
        'store_id',
        'is_active',
        'his_change_date',
        'tranfer_date',
        'tranfer_user',
        'order_category_name',
        'order_note',
        'model_name',
        'store_name_order',
        'favorite_category_name',
        'favorite_product_name',
        'brand_name',
    ]);
};

const customerOfTaskHisExportExcel = (list = []) => {
    return transform.transform(list, [
        'id_lienhe',
        'ngay_tao',
        'khach_hang',
        'sdt',
        'buoc_cu',
        'buoc_moi',
        'ngay_chuyen',
        'nguoi_chuyen',
    ]);
};

const customerOfTaskDetail = (list = []) => {
    return transform.transform(list, [
        'task_work_flow_id',
        'task_detail_id',
        'task_type_name',
        'store_id',
        'store_code',
        'store_name',
        'order_no',
        'order_date',
        'source_name',
        'is_active',
        'source_id',
        'customer_id',
        'task_type_id',
        'member_id',
        'dataleads_id',
        'description',
        'employee',
        'tranfer_date',
        'tranfer_user'
    ]);
};

const optionsTask = (users = []) => {
    return transform.transform(users, ['id', 'name']);
};

const tabTaskWorkFlow = (users = []) => {
    return transform.transform(users, ['value', 'label']);
};

const optionsTaskWorkFlow = (users = []) => {
    return transform.transform(users, ['id', 'name']);
};

module.exports = {
    customerOfTaskList,
    customerOfTaskDetail,
    optionsTask,
    optionsTaskWorkFlow,
    tabTaskWorkFlow,
    customerOfTaskListExportExcel,
    customerOfTaskHisExportExcel
};