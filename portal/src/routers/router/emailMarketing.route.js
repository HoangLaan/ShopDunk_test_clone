import React from 'react';

const EmailHistoryListPage = React.lazy(() => import('pages/EmailMarketing/pages/index'));
const EmailHistoryDetailPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailHistory/pages/DetailPage'));

const EmailListAddPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailList/pages/AddPage'));
const EmailListEditPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailList/pages/EditPage'));
const EmailListDetailPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailList/pages/DetailPage'));

const EmailTemplateAddPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailTemplate/pages/AddPage'));
const EmailTemplateEditPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailTemplate/pages/EditPage'));
const EmailTemplateDetailPage = React.lazy(() => import('pages/EmailMarketing/tabs/EmailTemplate/pages/DetailPage'));

const EmailMarketing = [
  {
    path: '/email-marketing',
    exact: true,
    name: 'Danh sách email marketing',
    function: 'EMAIL_MARKETING_VIEW',
    component: EmailHistoryListPage,
  },
  {
    path: '/email-history/detail/:id',
    exact: true,
    name: 'Chi tiết gửi mail',
    function: 'CRM_EMAILHISTORY_VIEW',
    component: EmailHistoryDetailPage,
  },
  {
    path: '/email-list/add',
    exact: true,
    name: 'Thêm mới danh sách gửi mail',
    function: 'CRM_EMAILLIST_ADD',
    component: EmailListAddPage,
  },
  {
    path: '/email-list/edit/:id',
    exact: true,
    name: 'Chỉnh sửa danh sách gửi mail',
    function: 'CRM_EMAILLIST_EDIT',
    component: EmailListEditPage,
  },
  {
    path: '/email-list/detail/:id',
    exact: true,
    name: 'Chi tiết danh sách gửi mail',
    function: 'CRM_EMAILLIST_VIEW',
    component: EmailListDetailPage,
  },
  {
    path: '/email-template/add',
    exact: true,
    name: 'Thêm mẫu mail',
    function: 'CRM_EMAILTEMPLATE_ADD',
    component: EmailTemplateAddPage,
  },
  {
    path: '/email-template/edit/:id',
    exact: true,
    name: 'Sửa mẫu mail',
    function: 'CRM_EMAILTEMPLATE_EDIT',
    component: EmailTemplateEditPage,
  },
  {
    path: '/email-template/detail/:id',
    exact: true,
    name: 'Chi tiết mẫu mail',
    function: 'CRM_EMAILTEMPLATE_VIEW',
    component: EmailTemplateDetailPage,
  },
];

export default EmailMarketing;
