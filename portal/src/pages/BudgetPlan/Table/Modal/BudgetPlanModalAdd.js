import React from 'react'
import BudgetPlanModalInfor from './BudgetPlanModalInfor';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import BudgetPlanModalStatus from './BudgetPlanModalStatus';
import { showToast } from 'utils/helpers';
import { updateBudgetPlanDetail } from 'pages/BudgetPlan/helper/call-api';

const BudgetPlanModalAdd = ({ dataDetail, isOpenModal, setIsOpenModal, onRefresh }) => {
    const methods = useForm({
        defaultValues: {
            is_active: 1,
            company_id: dataDetail?.company_id || null,
            budget_plan_name: dataDetail?.budget_plan_name || null,
            budget_plan_id: dataDetail?.budget_plan_id || null,
            departments: [{ label: dataDetail?.department_name, value: dataDetail?.department_id }],

            budget_plan_date_from: dataDetail?.budget_plan_date_from || null,
            budget_plan_date_to: dataDetail?.budget_plan_date_to || null

        },
    });

    const detailForm = [
        {
            title: 'Thông tin kế hoạch ngân sách',
            component: BudgetPlanModalInfor,
            fieldActive: ['company_id', 'budget_plan_name', 'budgets', 'from_month', 'to_month', 'from_year', 'to_year'],
            dataDetail: dataDetail
        },
        {
            title: 'Trạng thái',
            component: BudgetPlanModalStatus,
            fieldActive: ['is_active'],
        },
    ];

    const onSubmit = async (payload) => {
        try {
            await updateBudgetPlanDetail(payload)
            setIsOpenModal(!isOpenModal)
            showToast.success('Thêm mới mã ngân sách thành công');
            onRefresh()
        } catch (error) {
            showToast.error(error.message);
        }
    };

    return (
        <div className='bw_modal bw_modal_open' id='bw_add_budget_plan'>
            <div className='bw_modal_container bw_w900 '>
                <div className='bw_title_modal'>
                    <h3>Thêm mới kế hoạch ngân sách</h3>
                    <span
                        className='fi fi-rr-cross-small bw_close_modal'
                        onClick={() => setIsOpenModal(!isOpenModal)}
                    />
                </div>
                <FormProvider {...methods}>
                    <FormSection
                        detailForm={detailForm}
                        noSideBar={true}
                        noActions={true}
                        style={{
                            paddingBottom: '0px'
                        }}
                    />
                </FormProvider>
                <div className='bw_footer_modal' style={{ marginTop: -20 }}>
                    <button type='button'
                        onClick={methods.handleSubmit(onSubmit)}
                        className='bw_btn bw_btn_success'
                    >
                        Lưu
                    </button>
                    <button
                        onClick={() => setIsOpenModal(!isOpenModal)}
                        className='bw_btn_outline bw_close_modal'>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BudgetPlanModalAdd