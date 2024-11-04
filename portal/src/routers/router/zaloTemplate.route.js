import React from 'react';
import { ZALO_TEMPLATE_PERMISSION } from 'pages/ZaloTemplate/utils/constants';

const ZaloTemplate = React.lazy(() => import('pages/ZaloTemplate/pages/ZaloTemplate'));
const ZaloTemplateAdd = React.lazy(() => import('pages/ZaloTemplate/pages/ZaloTemplateAdd'));

const zaloTemplateRoute = [
  {
    path: '/zalo-template',
    exact: true,
    name: 'Danh sách mẫu tin nhắn',
    function: ZALO_TEMPLATE_PERMISSION.VIEW,
    component: ZaloTemplate,
  },
  {
    path: '/zalo-template/add',
    exact: true,
    name: 'Thêm mới mẫu tin nhắn',
    function: ZALO_TEMPLATE_PERMISSION.ADD,
    component: ZaloTemplateAdd,
  },
  {
    path: '/zalo-template/edit/:zaloTemplateId',
    exact: true,
    name: 'Chỉnh sửa mẫu tin nhắn',
    function: ZALO_TEMPLATE_PERMISSION.EDIT,
    component: ZaloTemplateAdd,
  },
  {
    path: '/zalo-template/detail/:zaloTemplateId',
    exact: true,
    name: 'Chi tiết mẫu tin nhắn',
    function: ZALO_TEMPLATE_PERMISSION.VIEW,
    component: ZaloTemplateAdd,
  },
];

export default zaloTemplateRoute;
