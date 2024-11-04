import React from 'react'
import { PERMISSION } from 'pages/BankUser/utils/constants';

const BankUser = React.lazy(() => import('pages/BankUser/pages/BankUser'));
const BankUserAdd = React.lazy(() => import('pages/BankUser/pages/BankUserAdd'));

const bankUserRoute = [
    {
        path: '/bank-user',
        exact: true,
        name: 'Danh sách tài khoản ngân hàng',
        function: PERMISSION.VIEW,
        component: BankUser,
    },
    {
        path: '/bank-user/add',
        exact: true,
        name: 'Thêm mới tài khoản ngân hàng',
        function: PERMISSION.ADD,
        component: BankUserAdd,
    },
    {
        path: '/bank-user/edit/:bank_user_id',
        exact: true,
        name: 'Chỉnh sửa tài khoản ngân hàng',
        function: PERMISSION.EDIT,
        component: BankUserAdd,
    },
    {
        path: '/bank-user/detail/:bank_user_id',
        exact: true,
        name: 'Chi tiết tài khoản ngân hàng',
        function: PERMISSION.VIEW,
        component: BankUserAdd,
    },
]

export default bankUserRoute
