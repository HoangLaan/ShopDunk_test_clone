import React, { useState, useEffect } from 'react';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getStocksTransferTypeOpts, genReviewLevel } from 'pages/StocksTransfer/helpers/call-api';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { TransportPartner, statusTransferOpts } from 'pages/StocksTransfer/helpers/const';
import { msgError } from 'pages/StocksTransfer/helpers/msgError';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import WrapUnregister from 'components/shared/FormZalo/WrapUnregister';

const StocksTransferInfor = ({ disabled, title }) => {
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
    methods.setValue('transfer_type', selectedTransferType?.transfer_type || null);
    if (stocks_transfer_type_id) {
      try {
        const _reviewList = await genReviewLevel(stocks_transfer_type_id);
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
      } catch (error) {
        showToast.error(error?.message || 'Lỗi vui lòng thử lại.');
      }
    }
  };

  return (
    <React.Fragment>
      <BWAccordion title={title} id='information'>
        <div className='bw_row'>
          <WrapUnregister field='transport_partner'>
            <FormItem label='Đơn vị vận chuyển' isRequired className='bw_col_4' disabled={disabled}>
                <FormSelect
                  field='transport_partner'
                  id='transport_partner'
                  placeholder='Chọn đơn vị vận chuyển'
                  list={TransportPartner}
                  allowClear={true}
                  validation={{
                    required: 'Đơn vị vận chuyển là bắt buộc',
                  }}
                />    
            </FormItem>
          </WrapUnregister>
          <WrapUnregister field='transport_vehicle'>
            <FormItem label='Phương tiện vận chuyển' isRequired className='bw_col_4' disabled={disabled}>
              <FormInput
                type='text'
                field='transport_vehicle'
                placeholder='Nhập phương tiện vận chuyển'
                validation={{ required: 'Phương tiện vận chuyển là bắt buộc' }}
              />
            </FormItem>
          </WrapUnregister>
          <WrapUnregister field='transport_user'>
            <FormItem label='Người vận chuyển' className='bw_col_4' disabled={disabled}>
              <FormInput
                type='text'
                field='transport_user'
                placeholder='Nhập người vận chuyển'
                // validation={{ required: 'Người vận chuyển là bắt buộc' }}
              />
            </FormItem>
          </WrapUnregister>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default StocksTransferInfor;
