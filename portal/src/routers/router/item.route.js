import React from 'react'

const DefaultItemPage = React.lazy(() => import('pages/Item/pages/DefaultItemPage'));
const AddItemPage = React.lazy(() => import('pages/Item/pages/AddItemPage'));
const EditItemPage = React.lazy(() => import('pages/Item/pages/EditItemPage'));
const DetailItemPage = React.lazy(() => import('pages/Item/pages/DetailItemPage'));

const OffWorkRoutes = [
    {
        path: '/item',
        exact: true,
        name: 'Danh sách khoản mục',
        function: 'FI_ITEM_VIEW',
        component: DefaultItemPage,
    },
    {
        path: '/item/edit/:id',
        exact: true,
        name: 'Chỉnh sửa khoản mục',
        function: 'FI_ITEM_EDIT',
        component: EditItemPage,
    },
    {
        path: '/item/add',
        exact: true,
        name: 'Thêm mới khoản mục',
        function: 'FI_ITEM_ADD',
        component: AddItemPage,
    },
    {
        path: '/item/detail/:id',
        exact: true,
        name: 'Chi tiết khoản mục',
        function: 'FI_ITEM_VIEW',
        component: DetailItemPage,
    }
]

export default OffWorkRoutes
