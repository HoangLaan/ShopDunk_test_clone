const excelHeaderStyle = {
    font: {
        bold: true,
        color: '#FFFFFF',
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#0b2447',
    },
};

const exampleImportData = [
    {
        type_name: 'Chăm sóc KH tại cửa hàng',
        description: 'Mo ta cong viec',
        add_function_id: '21',
        edit_function_id: '21',
        delete_function_id: '21',
        is_active: 'Có',
        'task_wflow_list.1.task_work_flow_id': 33,
        'task_wflow_list.1.type_purchase': 'Có',
        'task_wflow_list.1.is_complete': 'Có',
        'task_wflow_list.2.task_work_flow_id': 32,
        'task_wflow_list.2.type_purchase': 'Không',
        'task_wflow_list.2.is_complete': 'Không',
    },
];

const exampleImportDataHeader = {
    type_name: 'Tên loại công việc *',
    description: 'Mô tả công việc *',
    add_function_id: 'Quyền thêm mới *',
    edit_function_id: 'Quyền chỉnh sửa *',
    delete_function_id: 'Quyền xóa *',
    is_active: 'Kích hoạt',
    'task_wflow_list.1.task_work_flow_id': 'Bước xử lý 1 - Mã',
    'task_wflow_list.1.type_purchase': 'Bước xử lý 1 - Đồng ý?',
    'task_wflow_list.1.is_complete': 'Bước xử lý 1 - Là bước hoàn thành?',
    'task_wflow_list.2.task_work_flow_id': 'Bước xử lý 2 - Mã',
    'task_wflow_list.2.type_purchase': 'Bước xử lý 2 - Đồng ý?',
    'task_wflow_list.2.is_complete': 'Bước xử lý 2 - Là bước hoàn thành?',
};

const transformDataHeader = {
  'Tên loại công việc *': 'type_name',
  'Mô tả công việc *': 'description',
  'Quyền thêm mới *': 'add_function_id',
  'Quyền chỉnh sửa *': 'edit_function_id',
  'Quyền xóa *': 'delete_function_id',
  'Kích hoạt': 'is_active',
}

module.exports = {
    excelHeaderStyle,
    exampleImportData,
    exampleImportDataHeader,
    transformDataHeader,
};
