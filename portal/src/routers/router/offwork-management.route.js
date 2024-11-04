import React from 'react'

const OffWorkManagementPage = React.lazy(() => import('pages/OffworkManagement/pages/OffworkManagement'));
const OffWorkManagementPageAdd = React.lazy(() => import('pages/OffworkManagement/pages/OffworkManagementAdd'));


const OffWorkManagementRoutes = [
    {
        path: '/off-work-management',
        exact: true,
        name: 'Chính sách quản lý phép tồn',
        function: 'HR_OFFWORK_MANAGEMENT_VIEW',
        component: OffWorkManagementPage,
    },
    {
        path: '/off-work-management/edit/:id',
        exact: true,
        name: 'Chỉnh sửa',
        function: 'HR_OFFWORK_MANAGE_EDIT',
        component: OffWorkManagementPageAdd,
    },
    {
        path: '/off-work-management/add',
        exact: true,
        name: 'Thêm mới chính sách quản lý phép tồn',
        function: 'HR_OFFWORK_MANAGEMENT_ADD',
        component: OffWorkManagementPageAdd,
    },
    {
        path: '/off-work-management/detail/:id',
        exact: true,
        name: 'Chi tiết chính sách quản lý phép tồn',
        function: 'HR_OFFWORK_MANAGEMENT_ADD',
        component: OffWorkManagementPageAdd,
    },
    {
        path: '/off-work-management/review/:id',
        exact: true,
        name: 'Duyệt nghỉ phép',
        function: 'HR_OFFWORK_MANAGEMENT_REVIEW',
        component: OffWorkManagementPageAdd,
    },
]

export default OffWorkManagementRoutes
