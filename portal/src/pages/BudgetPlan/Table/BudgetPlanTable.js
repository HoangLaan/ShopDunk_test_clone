import { showConfirmModal } from 'actions/global';
import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { deleteBudgetPlanApi } from '../helper/call-api';
import Table from './Table';
import BudgetPlanList from './ModalBudgetPlan/BudgetPlanList';

const BudgetPlanTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh, companyOpts, methods, totalNotYetReview }) => {

    const [isOpenBudgetPlanList, setIsOpenBudgetPlanList] = useState(false)
    const dispatch = useDispatch();
    const columns = useMemo(
        () => [
            {
                header: 'Tên phòng ban',
                accessor: 'department_name',
                classNameHeader: 'bw_sticky bw_name_sticky',
                classNameBody: 'bw_sticky bw_name_sticky',
                style: {
                    zIndex: '2'
                },
                default: 1,
                buttonAdd: true
            },
            {
                header: 'Mã ngân sách',
                accessor: 'budget_code',
                default: 1,
                buttonDelete: true
            },
            {
                header: 'Tên ngân sách',
                accessor: 'budget_name',
                default: 1
            },
            {
                header: 'Mã khoản mục',
                accessor: 'created_date',
                default: 1
            },
            {
                header: 'Kế hoạch T1',
                classNameBody: "bw_text_center",
            },
            {
                header: 'Kế hoạch T2',
                classNameBody: "bw_text_center",

            },
            {
                header: 'Kế hoạch T3',
                classNameBody: "bw_text_center",
            },
            {
                header: 'Kế hoạch T4',
                classNameBody: "bw_text_center",
            },
            {
                header: 'Kế hoạch T5',
                classNameBody: "bw_text_center",

            },
            {
                header: 'Kế hoạch T6',
                classNameBody: "bw_text_center",
            },
            {
                header: 'Kế hoạch T7',
                classNameBody: "bw_text_center",

            },
            {
                header: 'Kế hoạch T8',
                classNameBody: "bw_text_center",

            },
            {
                header: 'Kế hoạch T9',
                classNameBody: "bw_text_center",

            },
            {
                header: 'Kế hoạch T10',
                classNameBody: "bw_text_center",

            },
            {
                header: 'Kế hoạch T11',
                classNameBody: "bw_text_center",
            },
            {
                header: 'Kế hoạch T12',
                classNameBody: "bw_text_center",

            },
        ],
        [],
    );

    const actions = useMemo(() => {
        return [
            {
                globalAction: true,
                icon: 'fi fi-rr-add',
                type: 'success',
                content: 'Tạo lập',
                permission: 'FI_BUDGETPLAN_ADD',
                onClick: () => window._$g.rdr(`/budget-plan/add`),
            },
            {
                globalAction: true,
                icon: 'fi fi-rr-inbox-in',
                type: 'warning',
                content: 'Nhập Excel',
                permission: 'FI_BUDGETPLAN_ADD',
                // onClick: () => window._$g.rdr(`/budget-plan/add`),
            },
            {
                globalAction: true,
                icon: 'fi fi-rr-inbox-out',
                type: 'primary',
                content: 'Xuất Excel',
                permission: 'FI_BUDGETPLAN_ADD',
                // onClick: () => window._$g.rdr(`/budget-plan/add`),
            },
            {
                globalAction: true,
                icon: 'fi fi fi-rr-copy-alt',
                type: 'blue',
                content: 'Sao chép',
                permission: 'FI_BUDGETPLAN_ADD',
                // onClick: () => window._$g.rdr(`/budget-plan/add`),
                style: {
                    marginLeft: '3px',
                    backgroundColor: '#bf3eb1',
                    color: 'white'
                }
            },
            {
                globalAction: true,
                icon: 'fa fa-arrows-h',
                type: 'danger',
                content: 'Chuyển NS',
                permission: 'FI_BUDGETPLAN_ADD',
                // onClick: () => window._$g.rdr(`/budget-plan/add`),
            },
            {
                globalAction: true,
                icon: 'fa fa-arrows-h',
                type: 'danger',
                content: 'Xem danh sách kế hoạch ngân sách',
                permission: 'FI_BUDGETPLAN_ADD',
                onClick: () => setIsOpenBudgetPlanList(!isOpenBudgetPlanList),
                right: true,
                style: { fontWeight: 'bold', textDecorationLine: 'underline', cursor: 'pointer' },
                totalNotYetReview: totalNotYetReview,
                isReviewList: true,
                title: 'kế hoạch chờ duyệt',
                styleCustom: { color: 'blue', textDecorationLine: 'underline', textDecorationColor: 'blue' }
            },
            {
                globalAction: true,
                content: 'ĐVT: triệu đồng',
                permission: 'FI_BUDGETPLAN_VIEW',
                right: true,
                style: { marginLeft: '20px' }
            },
        ];
    }, [totalNotYetReview]);

    const deleteBudgetPlan = (value) => {
        dispatch(
            showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                    await deleteBudgetPlanApi(value)
                    onRefresh();
                },
            ),
        )
    }

    return (
        <React.Fragment>
            <Table
                loading={loading}
                columns={columns}
                data={data}
                actions={actions}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                page={page}
                totalItems={totalItems}
                onChangePage={onChangePage}
                handleBulkAction={(e) => {
                    dispatch(
                        showConfirmModal(
                            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                            async () => {
                                await deleteBudgetPlanApi(e);
                                onRefresh();
                            },
                        ),
                    );
                }}
                deleteBudgetPlan={deleteBudgetPlan}
                onRefresh={onRefresh}
                methods={methods}
            />
            {isOpenBudgetPlanList && (
                <BudgetPlanList
                    setIsOpenBudgetPlanList={setIsOpenBudgetPlanList}
                    isOpenBudgetPlanList={isOpenBudgetPlanList}
                    companyOpts={companyOpts}
                    onReLoad={onRefresh}
                />
            )}
        </React.Fragment>
    )
}

export default BudgetPlanTable