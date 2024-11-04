import React, { useState, useEffect } from 'react';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getStocksTransferTypeOpts, genReviewLevel, getInfoStocks } from 'pages/StocksTransfer/helpers/call-api';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { TRANSFER_TYPE, statusTransferOpts } from 'pages/StocksTransfer/helpers/const';
import { msgError } from 'pages/StocksTransfer/helpers/msgError';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import WrapUnregister from 'components/shared/FormZalo/WrapUnregister';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

const StocksTransferInfor = ({ disabled }) => {
  const [stocksTransferTypeOpts, setStocksTransferTypeOpts] = useState([]);
  const methods = useFormContext();

  useEffect(() => {
    getStocksTransferTypeOpts().then((data) => {
      setStocksTransferTypeOpts(mapDataOptions4Select(data));
    });
  }, []);

  const getStocksTransferTypeReview = async (stocks_transfer_type_id) => {
    const selectedTransferType = stocksTransferTypeOpts?.find((_) => _.value === stocks_transfer_type_id);

    methods.clearErrors('stocks_transfer_type_id');
    methods.setValue('stocks_transfer_type_id', stocks_transfer_type_id);
    methods.setValue('transfer_type', selectedTransferType?.transfer_type ?? null);
    if (stocks_transfer_type_id) {
      try {
        const _reviewList = await genReviewLevel(stocks_transfer_type_id);
        const info_stock = await getInfoStocks();
        // set user duyệt mặc định cho từng mức duyệt
        const _stocksTransferRLUser = _reviewList?.stocksTransferType;

        let stocks_transfer_review_list = _stocksTransferRLUser.map((_user) => {
          return {
            ..._user,
            review_user: _user?.users && _user?.users.length > 0 ? _user?.users[0]?.value : null,
          };
        });
        methods.setValue('is_auto_review_stock_transfer', _reviewList?.is_auto_review_stock_transfer);
        methods.setValue('stocks_transfer_review_list', stocks_transfer_review_list);

        methods.setValue('department_id', +info_stock?.department_id);
        methods.setValue('store_request_id', +info_stock?.store_id);
        methods.setValue('store_import_id', +info_stock?.store_id);
        methods.setValue('business_id', +info_stock?.business_id);

        if (methods.watch('transfer_type') === (TRANSFER_TYPE.OTHER || TRANSFER_TYPE.DIFF_BUSINESS)) {
          console.log('business_import_id');
          if (methods.watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS) {
            methods.setValue('business_import_id', +info_stock?.business_id)
          }
          if (methods.watch('transfer_type') === TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS) {
            methods.setValue('business_export_id', +info_stock?.business_id);
            methods.setValue('store_export_id', +info_stock?.store_id);
          }
        }
        if (methods.watch('transfer_type') === TRANSFER_TYPE.INTERNAL_STORE) {
          methods.setValue('store_id', +info_stock?.store_id);
        }

      } catch (error) {
        showToast.error(error?.message || 'Lỗi vui lòng thử lại.');
      }
    }
  };

  return (
    <React.Fragment>
      <BWAccordion title='Thông tin phiếu chuyển kho' id='information'>
        <div className='bw_row'>
          <FormItem label='Ngày tạo' className='bw_col_4' disabled={true}>
            <FormInput type='text' field='created_date' placeholder='Ngày tạo' />
          </FormItem>
          <FormItem label='Số phiếu chuyển' className='bw_col_4' disabled={true}>
            <FormInput type='text' field='stocks_transfer_code' placeholder='Số phiếu chuyển' />
          </FormItem>
          <FormItem label='Người tạo' className='bw_col_4' disabled={true}>
            <FormInput type='text' field='created_user' placeholder='Người tạo' />
          </FormItem>
          <FormItem label='Trạng thái chuyển' className='bw_col_4' disabled={true}>
            <FormSelect type='text' field='status_transfer' placeholder='Trạng thái chuyển' list={statusTransferOpts} />
          </FormItem>
          <FormItem label='Hình thức phiếu chuyển kho' className='bw_col_4' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stocks_transfer_type_id'
              id='stocks_transfer_type_id'
              list={stocksTransferTypeOpts}
              allowClear={true}
              onChange={getStocksTransferTypeReview}
              validation={msgError['stocks_transfer_type_id']}
            />
          </FormItem>
          {methods.watch('hidden_price') ? (
            <WrapUnregister field='contract_number'>
              <FormItem label='Hợp đồng số' className='bw_col_4' disabled={disabled}>
                <FormInput type='text' field='contract_number' placeholder='Nhập số hợp đồng' />
              </FormItem>
            </WrapUnregister>
          ) : null}
          <FormItem className='bw_col_4' label='Số ngày dự kiến' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='estimate_delivery_day_count'
              validation={{
                required: 'Số ngày dự kiến là bắt buộc !',
                min: { value: 1, message: 'Số ngày dự kiến phải lớn hơn 1' },
                max: { value: 100, message: 'Số ngày dự kiến phải bé hơn 100' },
              }}
            />
          </FormItem>
          <FormItem className='bw_col_4' label='Thời gian hàng về dự kiến' disabled>
            <FormInput type='text' field='estimate_delivery_time' />
          </FormItem>
          <FormItem className='bw_col_4' label='Thời gian hàng về thực tế' disabled>
            <FormInput type='text' field='actual_delivery_time' />
          </FormItem>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default StocksTransferInfor;
