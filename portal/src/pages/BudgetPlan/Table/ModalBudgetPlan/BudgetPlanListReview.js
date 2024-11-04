import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem'
import FormTextArea from 'components/shared/BWFormControl/FormTextArea'
import { getOldTotalBudgetPlan, updateReview } from 'pages/BudgetPlan/helper/call-api';
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
const BudgetPlanListReview = ({ onClose, item, onRefresh, onReLoad }) => {
    const methods = useForm();
    const [totalBudgetPlan, setTotalBudgetPlan] = useState([])
    const [department, setDepartment] = useState([])
    const [budget, setBudget] = useState([])
    const [type, setType] = useState(0)

    const onSubmit = async (payload) => {
        try {
            let data = { ...item, ...payload, type, totalBudgetPlan, budgets: budget, departments: department }
            await updateReview(data)
            showToast.success('Duyệt kế hoạch thành công');
            onClose()
            onRefresh()
            onReLoad()
        } catch (error) {
            showToast.error(error.message);
        }
    }

    const formatCurrency = (number) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        return formatter.format(number);
    };

    const initData = async () => {
        try {
            let data = await getOldTotalBudgetPlan({ budget_plan_id: item?.budget_plan_id })
            setTotalBudgetPlan(data?.array_result)

            setDepartment(data?.listDepartments.map(item => ({ id: item.department_id, value: item.department_id, budget_plan_distribution_id: item.budget_plan_distribution_id })))
            setBudget(data?.listBudgets.map(item => item.budget_id))
        } catch (error) {
            showToast.error(error.message);
        }
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <div className='bw_modal bw_modal_open' id='bw_modal_review'>
            <div className='bw_modal_container bw_w500'>
                <div className='bw_title_modal'>
                    <h3>Duyệt kế hoạch ngân sách</h3>
                    <span
                        onClick={onClose}
                        className='fi fi-rr-cross-small bw_close_modal'
                    ></span>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className='bw_main_modal'>
                            <FormItem label='Ghi chú' isRequired={true} style='gray'>
                                <FormTextArea
                                    rows={3}
                                    field='note'
                                    placeholder='Nhập ghi chú '
                                    validation={{
                                        required: 'Vui lòng nhập ghi chú',
                                    }}
                                />
                            </FormItem>
                        </div>
                        {item.is_review === 1 ? (<>
                            <BWAccordion title='Thông tin ngân sách còn lại' id='bw_mores' isRequired={false}>
                                <div className='bw_row'>
                                    <table className='bw_table bw_col_12'>
                                        <thead>
                                            <tr>
                                                <th className='bw_text_center'>STT</th>
                                                <th>Phòng ban</th>
                                                <th>Tổng được cấp</th>
                                                <th>Đã sử dụng</th>
                                                <th>Còn lại</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {totalBudgetPlan && totalBudgetPlan.length ? (
                                                totalBudgetPlan.map((p, index) => {
                                                    return (
                                                        <tr>
                                                            <td className='bw_text_center'>{index + 1}</td>
                                                            <td>
                                                                {p?.department_name}
                                                            </td>
                                                            <td>
                                                                {formatCurrency(p?.total_budget_distribution)}
                                                            </td>
                                                            <td>
                                                                {formatCurrency(p?.total_budget_used)}
                                                            </td>
                                                            <td>
                                                                {formatCurrency(p?.remain)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={50} className='bw_text_center'>
                                                        Không có dữ liệu
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </BWAccordion>
                            <h3 style={{ textAlign: 'right', fontSize: '12px', marginBottom: '10px' }}>Bạn có muốn chuyển ngân sách còn lại sang bảng kế hoạch
                                ngân sách mới không?</h3>
                        </>) : null}

                        <div className='bw_footer_modal'>
                            {item.is_review === 1 ? (
                                <>
                                    <button
                                        className={"bw_btn bw_btn_success"}
                                        type='submit'
                                        onClick={() => setType(1)}
                                    >
                                        Đồng ý
                                    </button>
                                    <button
                                        className={"bw_btn bw_btn_warning"}
                                        type='submit'
                                        onClick={() => setType(2)}
                                    >
                                        Không đồng ý
                                    </button>
                                </>

                            ) : (
                                <button
                                    className={"bw_btn bw_btn_danger"}
                                    type='submit'
                                >
                                    Từ chối
                                </button>)}

                            <button className='bw_btn_outline bw_close_modal' onClick={onClose}>
                                Đóng
                            </button>
                        </div>
                    </form>
                </FormProvider>

            </div>
        </div >
    )
}

export default BudgetPlanListReview