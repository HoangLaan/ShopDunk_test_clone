import React from 'react';

const DocumentTypePage = React.lazy(() => import('pages/DocumentType/DocumentTypePage'));
const DocumentTypeAddPage = React.lazy(() => import('pages/DocumentType/DocumentTypeAddPage'));

const documentType = [
  {
    path: '/document-type',
    exact: true,
    name: 'Danh sách loại hồ sơ',
    function: 'MD_DOCUMENTTYPE_VIEW',
    component: DocumentTypePage,
  },
  {
    path: '/document-type/add',
    exact: true,
    name: 'Thêm mới loại hồ sơ',
    function: 'MD_DOCUMENTTYPE_ADD',
    component: DocumentTypeAddPage,
  },
  {
    path: '/document-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại hồ sơ',
    function: 'MD_DOCUMENTTYPE_VIEW',
    component: DocumentTypeAddPage,
  },
  {
    path: '/document-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại hồ sơ',
    function: 'MD_DOCUMENTTYPE_EDIT',
    component: DocumentTypeAddPage,
  },
];

export default documentType;
