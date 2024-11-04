import React from 'react';
import { INTERNAL_TRANSFER_TYPE_PERMISSION } from 'pages/InternalTransferType/utils/constants';

const InternalTransferType = React.lazy(() => import('pages/InternalTransferType/pages/InternalTransferType'));
const InternalTransferTypeAdd = React.lazy(() => import('pages/InternalTransferType/pages/InternalTransferTypeAdd'));

const internalTransferTypeRoute = [
  {
    path: '/internal-transfer-type',
    exact: true,
    name: 'Danh sách hình thức chuyển tiền',
    function: INTERNAL_TRANSFER_TYPE_PERMISSION.VIEW,
    component: InternalTransferType,
  },
  {
    path: '/internal-transfer-type/add',
    exact: true,
    name: 'Thêm mới hình thức chuyển tiền',
    function: INTERNAL_TRANSFER_TYPE_PERMISSION.ADD,
    component: InternalTransferTypeAdd,
  },
  {
    path: '/internal-transfer-type/edit/:internalTransferTypeId',
    exact: true,
    name: 'Chỉnh sửa hình thức chuyển tiền',
    function: INTERNAL_TRANSFER_TYPE_PERMISSION.EDIT,
    component: InternalTransferTypeAdd,
  },
  {
    path: '/internal-transfer-type/detail/:internalTransferTypeId',
    exact: true,
    name: 'Chi tiết hình thức chuyển tiền',
    function: INTERNAL_TRANSFER_TYPE_PERMISSION.VIEW,
    component: InternalTransferTypeAdd,
  },
];

export default internalTransferTypeRoute;
