import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import { notification } from 'antd';
import FormSection from 'components/shared/FormSection/index';
import Modal from 'components/shared/Modal/index';
import BWButton from 'components/shared/BWButton/index';
import {STATUS_TYPES} from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import {showToast} from 'utils/helpers';
import BorrowRequestInfo from "../components/Section/BorrowRequestInfo";
import BorrowRequestProduct from "../components/Section/BorrowDetail";
import BorrowRequestReview from "../components/Section/BorrowRequestReview";
import { createBorrowRequest,updateBorrowRequest, getDetailBorrowRequest } from "services/borrow-request.service";
import { confirmTranfer } from 'pages/StocksTransfer/helpers/call-api';

function BorrowRequestAdd({id = null, disabled = false}) {
  const methods = useForm();
  const {reset, handleSubmit,formState:{errors}} = methods;

  const [loading, setLoading] = useState(false);
  const [isConfirmTransfer, setIsConfirmTransfer] = useState(false)

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getDetailBorrowRequest(id);
        reset({...data});
      } else {
        reset({
            is_active: STATUS_TYPES.ACTIVE,
            is_system: STATUS_TYPES.HIDDEN,
          }
        );
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (dataSubmit) => {
    
    try {
      setLoading(true);
      if (id) {
        await updateBorrowRequest(dataSubmit);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await createBorrowRequest(dataSubmit);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin đề xuất mượn hàng',
      component: BorrowRequestInfo,
      fieldActive: ['borrow_type_id',"company_id","borrow_request_code",
                    'store_borrow_id','stock_borrow_id','employee_borrow',
                    'stock_out_id','stock_out_name']
    },
    {
      title: 'Thông tin sản phẩm mượn',
      component: BorrowRequestProduct,
      fieldActive: null,
    },
    {
      title: 'Thông tin duyệt',
      component: BorrowRequestReview,
      fieldActive: null,
    }
  ];

  const handleConfirmTranfer = async () => {
    try {

      await confirmTranfer(id);
      notification.success({
        message: 'Xác nhận điều chuyển thành công. Chờ duyệt phiếu chuyển.'
      })

    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra vui lòng thử lại.'
      })

    } finally {
      setIsConfirmTransfer(false)
      await initData();
    }
  }

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/borrow-type/edit/' + id);
        else handleSubmit(onSubmit);
      },
    },
    {
      type: 'warning',
      icon: 'fi-rr-inbox-out',
      content: 'Điều chuyển',
      onClick: () => setIsConfirmTransfer(true),
      hidden: methods.watch('reviewed_status') == 1 && methods.watch('is_can_transfer') ? false : true
    },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection
          loading={loading}
          detailForm={detailForm}
          onSubmit={onSubmit}
          disabled={disabled}
          actions={actions}
        />
      </FormProvider>
      {isConfirmTransfer ? (
        <Modal
          open={isConfirmTransfer}
          onClose={() => setIsConfirmTransfer(false)}
          header="Xác nhận điều chuyển"
          footer={
            <BWButton
              type='success'
              icon={'fi-rr-inbox-out'}
              content={'Xác nhận chuyển'}
              onClick={() => {
                handleConfirmTranfer()

              }}
            />
          }
        >
          <div className=' bw_text_center'>
            <p>Bạn có muốn xác nhận điều chuyển kho</p>
            <p>Chuyển từ <b>{methods.watch('stocks_export_name')}</b> đến <b>{methods.watch('stocks_import_name')}</b></p>
          </div>

        </Modal>

      ) : null}
      </React.Fragment>
  );
}

export default BorrowRequestAdd;
