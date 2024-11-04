import React from 'react';

const AnnounceTypeAddPage = React.lazy(() => import('pages/AnnounceType/AnnounceTypeAddPage'));
const AnnounceTypePage = React.lazy(() => import('pages/AnnounceType/AnnounceTypePage'));

const announceTypeRoute = [
    {
        path: '/announce-type',
        exact: true,
        name: 'Danh sách loại thông báo nhân viên',
        function: 'SYS_ANNOUNCETYPE_VIEW',
        component: AnnounceTypePage,
    },
    {
        path: '/announce-type/add',
        exact: true,
        name: 'Thêm mới loại thông báo nhân viên',
        function: 'SYS_ANNOUNCETYPE_ADD',
        component: AnnounceTypeAddPage,
    },
    {
        path: '/announce-type/edit/:announce_type_id',
        exact: true,
        name: 'Chỉnh sửa loại thông báo nhân viên',
        function: 'SYS_ANNOUNCETYPE_EDIT',
        component: AnnounceTypeAddPage,
    },
    {
        path: '/announce-type/view/:announce_type_id',
        exact: true,
        name: 'Xem loại thông báo nhân viên',
        function: 'SYS_ANNOUNCETYPE_VIEW',
        component: AnnounceTypeAddPage,
    },
];

export default announceTypeRoute;
