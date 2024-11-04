import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion';
import DiscountProgramProductTable from './product/DiscountProgramProductTable';
import DiscountProgramModal from './product/DiscountProgramModal';
import FormInput from 'components/shared/BWFormControl/FormInput';

const Wrapper = styled.div`
  .bw_lb_sex label {
    width: 100%;
  }
`;

const DiscountProgramProduct = ({ title, disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const is_apply_all_product = watch('is_apply_all_product');
  const product_list = watch('product_list');

  const [modalDiscount, setModalDiscount] = useState(undefined);

  return (
    <React.Fragment>
      <BWAccordion title={title} isRequired>
        <Wrapper className='bw_frm_box'>
          <div className='bw_col_12'>
            <label className='bw_checkbox bw_col_12'>
              <FormInput disabled={disabled} type='checkbox' field='is_apply_all_product' />
              <span />
              Áp dụng cho tất cả sản phẩm
            </label>
          </div>
          {!Boolean(is_apply_all_product) && (
            <DiscountProgramProductTable
              handleOpenModal={() => setModalDiscount(true)}
              contentCreate='Chọn sản phẩm'
              noLoadData
              fieldProduct='product_list'
              disabled={disabled}
              hiddenDeleteBtn={false}
            />
          )}

          <FormInput
            hidden={true}
            disabled={disabled}
            type='text'
            field='check_product_list'
            style={{ lineHeight: 1, display: 'none' }}
            validation={{
              validate: (value) => {
                if (!product_list?.length && !is_apply_all_product) {
                  return 'Sản phẩm áp dụng là bắt buộc';
                }

                return true;
              },
            }}
          />
        </Wrapper>
      </BWAccordion>
      {modalDiscount && <DiscountProgramModal manufacture_id={watch('manufacture_id')} fieldProduct='product_list' onClose={() => setModalDiscount(false)} />}
    </React.Fragment>
  );
};

DiscountProgramProduct.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramProduct;
