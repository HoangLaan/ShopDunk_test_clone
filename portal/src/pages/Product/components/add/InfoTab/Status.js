import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

const CustomDiv = styled.div`
  label {
    width: 33.33333%;
    margin: 4px 0;
  }

  .bw_frm_box {
    border: 1px dashed red;
  }

  .bw_frm_box label {
    width: 100%;
  }
`;

const Status = ({ disabled }) => {
  const methods = useFormContext();

  const is_stop_selling = methods.watch('is_stop_selling');

  useEffect(() => {
    if (!is_stop_selling) {
      methods.setValue('stop_selling_from', null);
    }
  }, [is_stop_selling, methods]);

  return (
    <BWAccordion title='Trạng thái'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <CustomDiv className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_stop_selling' />
                <span />
                Sản phẩm ngừng kinh doanh
              </label>
              {is_stop_selling ? (
                <FormItem className='bw_col_4' label='Sản phẩm ngừng kinh doanh từ'>
                  <FormDatePicker
                    field='stop_selling_from'
                    placeholder={'mm/yyyy'}
                    style={{
                      width: '100%',
                    }}
                    format='MM/YYYY'
                    bordered={false}
                    allowClear
                    disabled={disabled}
                    picker='month'
                  />
                </FormItem>
              ) : (
                <label></label>
              )}
              <label></label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_half_link' />
                <span />
                Sản phẩm bán liên kết
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_stock_tracking' />
                <span />
                Là sản phẩm dịch vụ có theo dõi tồn kho
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_hot' />
                <span />
                Sản phẩm hot không giữ hàng
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_active' />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_system' />
                <span />
                Hệ thống
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_show_web' />
                <span />
                Hiển thị web
              </label>
            </CustomDiv>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Status;
