import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import BudgetPlanListReview from './BudgetPlanListReview';
import { deleteBudgetPlanList } from 'pages/BudgetPlan/helper/call-api';

const BudgetPlanListTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh, onReLoad }) => {
    const dispatch = useDispatch();
    const [isOpenModalReview, setIsOpenModalReview] = useState(false)
    const [item, setItem] = useState({})

    const onClose = () => {
        setIsOpenModalReview(!isOpenModalReview)
    }

    const handleOnChangeReview = (value, is_review) => {
        setItem({ ...value, is_review })
        onClose()
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tên kế hoạch',
                accessor: 'budget_plan_name',
                classNameHeader: 'bw_sticky bw_name_sticky',
                classNameBody: 'bw_sticky bw_name_sticky',
            },
            {
                header: 'Người tạo',
                accessor: 'created_user',
            },
            {
                header: 'Ngày tạo',
                accessor: 'created_date',
            },
            {
                header: 'Trạng thái duyệt',
                accessor: 'is_review',
                formatter: (p) =>
                    p?.is_review === 0 ? (
                        <div className='bw_flex' style={{ justifyContent: 'space-evenly' }}>
                            <button
                                className='bw_btn bw_btn_success'
                                onClick={() => handleOnChangeReview(p, 1)}
                            >
                                Đồng ý
                            </button>
                            <button
                                className='bw_btn bw_btn_danger'
                                onClick={() => handleOnChangeReview(p, 2)}
                            >
                                Từ chối
                            </button>
                        </div>
                    ) : <div>
                        <span className={p.is_review === 1 ? 'bw_label_outline bw_label_outline_success text-center' : 'bw_label_outline bw_label_outline_danger text-center'}
                            style={{ marginLeft: '32px' }}
                        >{p.is_review === 1 ? "Đồng ý" : "Từ chối"}</span>
                        <span style={{ marginLeft: '5px' }}>{p?.note}</span>
                    </div>
            },
            {
                header: 'Trạng thái',
                accessor: 'is_active',
                //classNameBody: "bw_text_center",
                formatter: (p) =>
                    p?.is_active ? (
                        <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
                    ) : (
                        <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
                    ),
            },
        ],
        [],
    );

    const actions = useMemo(() => {
        return [
            {
                icon: 'fi fi-rr-edit',
                color: 'blue',
                permission: 'FI_BUDGETPLAN_EDIT',
                onClick: (p) => {
                    window._$g.rdr(`/budget-plan/edit/${p?.budget_plan_id}`);
                },
                hidden: (p) => { return p?.is_review !== 0 ? true : false }
            },
            {
                icon: 'fi fi-rr-eye',
                color: 'green',
                permission: 'FI_BUDGETPLAN_VIEW',
                onClick: (p) => {
                    window._$g.rdr(`/budget-plan/detail/${p?.budget_plan_id}`);
                },
            },
            {
                icon: 'fi fi-rr-trash',
                color: 'red',
                permission: 'FI_BUDGETPLAN_DEL',
                onClick: (_, d) =>
                    dispatch(
                        showConfirmModal(
                            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                            async () => {
                                await deleteBudgetPlanList(_.budget_plan_id);
                                onRefresh();
                            },
                        ),
                    ),
                hidden: (p) => { return p?.is_review !== 0 ? true : false }
            },
        ];
    }, []);

    return (
        <React.Fragment>
            <DataTable
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
                                await deleteBudgetPlanList(e);
                                onRefresh();
                            },
                        ),
                    );
                }}
                hiddenRowSelect={(p) => p.is_review !== 0}
            />
            {isOpenModalReview &&
                <BudgetPlanListReview
                    onClose={onClose}
                    item={item}
                    onRefresh={onRefresh}
                    onReLoad={onReLoad}
                />
            }
        </React.Fragment>
    )
}

export default BudgetPlanListTable