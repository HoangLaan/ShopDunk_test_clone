import { Alert, notification } from 'antd';
import BWAccordion from 'components/shared/BWAccordion';
import BWButton from 'components/shared/BWButton';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import Modal from 'components/shared/Modal';
import { ModalAddStyled } from 'pages/TimeKeeping/helpers/style';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// import TimeKeepingClaimInformation from '../../TimeKeepingClaim/components/TimeKeepingClaimInformation';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { createOderReview, getListImageOrderReview, getUserReviewOptions } from 'pages/Orders/helpers/call-api';
import { getListCoupon } from 'services/coupon.service';
import { formatPrice } from 'utils';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import ReviewVoucherGroupImages from './ReviewVoucherGroupImages';
import { useAuth } from 'context/AuthProvider';


const ReviewVoucherModel = ({ store_id, data, dataOrder, open, onClose }) => {
    const { user } = useAuth();
    const methods = useForm({
        defaultValues: {
            is_explain: true,
            ...data
        },
    });
    const {
        formState: { isValid },
    } = methods;
    const [alerts, setAlerts] = useState([]);
    const isExplain = methods.watch('is_explain');
    const [userReviewOpts, setUserReviewOpts] = useState([]);
    const userReview = methods.watch('review_user')

    const { error } = methods.getFieldState('voucher_request', methods.formState);

    const getInitData = useCallback(async () => {
        try {
            // lấy danh sách người duyệt
            getUserReviewOptions({ store_id: store_id }).then((data) => {
                setUserReviewOpts(mapDataOptions4SelectCustom(data, 'id', 'name'))
            })

            // lấy danh sách hình ảnh
            getListImageOrderReview({ order_detail_id: data?.order_detail_id }).then((data) => {
                methods.setValue('images', data)
            })

            if ((data?.voucher_request && data?.review_user) && data?.is_review !== 0) {
                methods.setValue('is_explain', false)
            }

        } catch (error) {
            notification.error({
                message: 'Đã xảy ra lỗi vui lòng thử lại',
            });
        }
    }, []);

    // useEffect(() => {
    //     methods.register('voucher_request', { required: 'Nhập khuyến mại là bắt buộc' });
    // }, [methods]);

    useEffect(() => {
        getInitData();
    }, [getInitData]);

    useEffect(() => {
        if (userReview) {
            const res = userReviewOpts?.find((val) => String(val?.id) === String(userReview))
            if (res) {
                methods.setValue('review_user', res?.name)
            }
        }
    }, [methods, userReview, userReviewOpts]);


    const onSubmit = async () => {
        let values = methods.getValues();

        const res = userReviewOpts?.find((val) => String(val?.name) === String(values?.review_user))

        let formData = {
            error_des: values?.error_des,
            images: values?.images,
            review_user: res?.id ?? null,
            voucher_request: values?.voucher_request,
            order_detail_id: data?.order_detail_id,
            error_note: values?.error_note,
            order_id: data?.order_id,
        };

        try {
            //goi service tao moi
            await createOderReview(formData).then(() => {
                onClose()
                showToast.success('Thành công.');
                setTimeout(() => window.location.reload(), 1200);
            })
            setAlerts([]);
        } catch (error) {
            showToast.error(error?.message || 'Đã xảy ra lỗi vui lòng thử lại');
        }
    };

    const handleInputCoupon = useCallback(
        (val) => {
            if (val?.target?.value) {
                getListCoupon({
                    search: val?.target?.value,   
                    is_active: 1,
                    page: 1,
                }).then((data) => {
                    if (data?.items?.length === 1) {
                        methods.setValue('voucher_request', data?.items[0]?.coupon_name)
                        showToast.success(`Mã khuyến mại hợp lệ, mã khuyến mại có giá trị ${formatPrice((data?.items[0]?.code_value), true, ',')}`);
                    } else {
                        methods.setValue('voucher_request', null)
                        showToast.error('Mã khuyến mại không hợp lệ'); 
                    }
                })
            } else {
                methods.setValue('voucher_request', null)
                showToast.error('Mã khuyến mại không hợp lệ');
            }
        },
        [methods]
    );

    const handleApprove = async (value) => {
        let values = methods.getValues();

        const res = userReviewOpts?.find((val) => String(val?.name) === String(values?.review_user))

        if (!values?.voucher_request && value !== 2) {
            showToast.error('Mã khuyến mại là bắt buộc.');
        } else if (!values?.images) {
            showToast.error('Ảnh là bắt buộc.'); 
        } else {
            let params = {
                is_review: value,
                voucher_request: values?.voucher_request,
                order_detail_id: data?.order_detail_id,
                error_note: values?.error_note,
                order_id: data?.order_id,
                review_user: res?.id ?? null,
                price_old: data?.price,
                value_vat: data?.value_vat,
                quantity: data?.quantity,
                images: values?.images,
                debt_account_id: values?.debt_account_id,
                revenue_account_id: values?.revenue_account_id,
                tax_account_id: values?.tax_account_id,
                //invoice
                is_invoice: dataOrder?.is_invoice ? 1 : null,
                invoice_company_name: dataOrder?.invoice_company_name,
                invoice_email: dataOrder?.invoice_email,
                invoice_full_name: dataOrder?.invoice_full_name,
                invoice_tax: dataOrder?.invoice_tax,
                invoice_price: dataOrder?.invoice_price,
                invoice_address: dataOrder?.invoice_address,
                //store
                receiving_date: dataOrder?.receiving_date,
                store_id: dataOrder?.store_id,
                is_delivery_type: dataOrder?.is_delivery_type,
                salesassistant: dataOrder?.salesassistant,
                address_id: dataOrder?.address_id
            };

            await createOderReview(params).then(() => {
                onClose()
                showToast.success('Thành công.');
                setTimeout(() => window.location.reload(), 1200);
            })
        }
    };

    return (
        <Modal
            open={open}
            witdh={'50%'}
            footer={
                <>
                    {(data?.review_user === user?.user_name || user?.isAdministrator) && data?.can_review_order && data?.is_review === 0 ?
                        <>
                            <BWButton
                                style={{ color: 'white', backgroundColor: '#6445a3', border: 'red' }}
                                content={'Duyệt đơn'}
                                onClick={() => handleApprove(1)}
                            />
                            <BWButton
                                content={'Không duyệt'}
                                className='bw_btn bw_btn_danger'
                                onClick={() => handleApprove(2)}
                            />
                        </> : null
                    }

                    {(user?.isAdministrator || isExplain) &&  data?.is_review === 0 ?
                        <BWButton
                            content={data?.review_user ? 'Cập nhật đơn' : 'Tạo mới đơn'}
                            onClick={() => methods.handleSubmit(onSubmit)()}
                        /> : null
                    }
                </>
            }
            onClose={onClose}
            lalbelClose={'Đóng'}
            header={
                <div style={{ display: 'flex' }}>
                    <h3>Yêu cầu áp dụng khuyến mại cho đơn hàng</h3>
                    <strong
                        style={{
                            fontSize: '15px',
                            marginTop: '5px',
                            marginLeft: '20px',
                            color:
                                data.is_review === 0 ? 'gray' :
                                    data.is_review === 1 ? '#6445a3' :
                                        data.is_review === 2 ? 'red' : 'inherit'
                        }}
                    >
                        {data.is_review === 0 ? '(Chưa duyệt)' :
                            data.is_review === 1 ? '(Duyệt đồng ý)' :
                                data.is_review === 2 ? '(Duyệt từ chối)' : ''}
                    </strong>
                </div>
            }>
            <FormProvider {...methods}>
                <ModalAddStyled>
                    {alerts.map(({ type, msg }, idx) => {
                        return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
                    })}
                    <BWAccordion hideCollapse={true} title='Nhập thông tin mô tả lỗi'>
                        <div className='bw_row '>
                            <FormItem className='bw_col_12' isRequired label='Mô tả lỗi' disabled={data?.is_review !== 0}>
                                <FormTextArea
                                    placeholder='Mô tả lỗi'
                                    field='error_des'
                                    validation={{ required: 'Mô tả lỗi là bắt buộc' }}
                                />
                            </FormItem>

                            <FormItem className='bw_col_12' label='Hình ảnh bằng chứng' isRequired>
                            {/* || methods.watch('images')?.length > 0 */}
                                <ReviewVoucherGroupImages disabled={data?.is_review !== 0 } />
                            </FormItem>

                            <FormItem className='bw_col_6' label='Nhập mã khuyến mại' disabled={data?.is_review !== 0}>
                                <input
                                    placeholder='Nhập mã khuyến mại'
                                    className='bw_inp'
                                    // validation={{ required: 'Nhập khuyến mại là bắt buộc' }}
                                    field='voucher_request'
                                    onBlur={(val) => handleInputCoupon(val)}
                                    style={{ lineHeight: 1 }}
                                    defaultValue={data?.voucher_request ?? ''}
                                />
                                {error && <ErrorMessage message={error?.message} />}
                            </FormItem>

                            <FormItem className='bw_col_6' isRequired label='Chọn người duyệt' disabled={data?.is_review !== 0}>
                                <FormSelect
                                    field='review_user'
                                    validation={{ required: 'Người duyệt là bắt buộc' }}
                                    list={userReviewOpts}
                                    placeholder='Chọn người duyệt'
                                    onChange={(id) => methods.setValue('review_user', id)}
                                />
                            </FormItem>

                            <FormItem className={data?.user_request ? 'bw_col_6' : 'bw_col_12'} label='Ghi chú lỗi' disabled={data?.is_review !== 0}>
                                <FormTextArea
                                    placeholder='Ghi chú lỗi'
                                    field='error_note'
                                />
                            </FormItem>

                            {data?.user_request ? <FormItem className='bw_col_6' label='Người tạo' disabled={true}>
                                <input
                                    // placeholder='Nhập mã khuyến mại'
                                    disabled
                                    className='bw_inp'
                                    // validation={{ required: 'Nhập khuyến mại là bắt buộc' }}
                                    field='user_request'
                                    // onBlur={(val) => handleInputCoupon(val)}
                                    style={{ lineHeight: 1 }}
                                    defaultValue={data?.user_request ?? ''}
                                />
                                {error && <ErrorMessage message={error?.message} />}
                            </FormItem>
                            : null}

                        </div>
                    </BWAccordion>
                </ModalAddStyled>
            </FormProvider>
        </Modal>
    );
};

export default ReviewVoucherModel;
