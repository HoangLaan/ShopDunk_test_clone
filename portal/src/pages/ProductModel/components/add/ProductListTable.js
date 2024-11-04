import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ProductListTableImages from './ProductListTableImages';
import { Tooltip } from 'antd';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const TableStyed = styled.table`
  thead th {
    border: solid 1px var(--grayColor);
  }

  .bw_bold {
    font-weight: bold;
  }

  .bw_highlight {
    background-color: antiquewhite;
  }

  .bw_radio,
  .bw_checkbox,
  .bw_radio span,
  .bw_checkbox span {
    margin: 0;
  }
`;

const THStyled = styled.th`
  cursor: pointer;
`;

const ProductListTable = ({ disabled }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const { unitData, warrantyPeriodData } = useSelector((state) => state.global);
  const productList = watch('product_list');
  const attributeName1 = watch('attribute_value_1.attibute_name');
  const attributeName2 = watch('attribute_value_2.attibute_name');

  const loadData = useCallback(async () => {
    try {
      dispatch(getOptionsGlobal('unit'));
      dispatch(getOptionsGlobal('warrantyPeriod'));
    } catch (error) {
      showToast.error(error.message || 'Lỗi lấy dữ liệu.');
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderData = useCallback(() => {
    let rowCount = 0;

    return productList?.map((valueRender, keyRender) => {
      rowCount += 1;

      return (
        <tr key={`${keyRender}`}>
          <td className='bw_text_center bw_bold'>{rowCount}</td>

          <td>
            <ProductListTableImages field={`product_list[${keyRender}].images`} disabled={disabled} />
          </td>

          <td className='bw_text_left'>
            <div className='bw_row'>
              <div className='bw_col_12 bw_mb_1'>Mã Sản phẩm</div>
              <div className='bw_col_12 bw_mb_1'>
                <FormInput
                  type='text'
                  field={`product_list[${keyRender}].product_code`}
                  validation={{
                    required: 'Mã sản phẩm là bắt buộc',
                    maxLength: {
                      value: 150,
                      message: !Boolean(disabled) && 'Mã sản phẩm tối đa 150 ký tự.',
                    },
                  }}
                  className='bw_inp'
                  disabled={disabled}
                />
              </div>
              <div className='bw_col_12 bw_mb_1'>Tên sản phẩm</div>
              <div className='bw_col_12 bw_mb_1'>
                <FormTextArea
                  type='text'
                  field={`product_list[${keyRender}].product_name`}
                  validation={{
                    required: 'Tên sản phẩm là bắt buộc',
                    maxLength: {
                      value: 150,
                      message: !Boolean(disabled) && 'Tên sản phẩm tối đa 150 ký tự.',
                    },
                  }}
                  className='bw_inp'
                  disabled={disabled}
                />
              </div>
            </div>
          </td>

          <td>
            <FormSelect
              field={`product_list[${keyRender}].warranty_period_id`}
              disabled={disabled}
              list={mapDataOptions4SelectCustom(warrantyPeriodData) || []}
              allowClear
            />
          </td>

          {/* <td className='bw_text_center'>
            <FormInput
              type='text'
              field={`product_list[${keyRender}].product_name`}
              validation={{
                required: 'Tên sản phẩm là bắt buộc',
                maxLength: {
                  value: 20,
                  message: !Boolean(disabled) && 'Tên sản phẩm tối đa 20 ký tự.',
                },
              }}
              className='bw_inp bw_mw_2'
              disabled={disabled}
            />
          </td> */}

          {Boolean(valueRender.rowSpan) && (
            <td className='bw_text_center' rowSpan={valueRender.rowSpan}>
              {valueRender.value_name_1}
            </td>
          )}

          <td className='bw_text_center'>{valueRender.value_name_2}</td>

          <td className='bw_text_center'>
            <FormSelect
              field={`product_list[${keyRender}].unit_id`}
              list={mapDataOptions4Select(unitData)}
              disabled={disabled}
              validation={{
                required: !Boolean(disabled) && 'ĐVT phẩm là bắt buộc',
              }}
            />
          </td>

          <td className='bw_text_center'>
            <FormInput type='checkbox' field={`product_list[${keyRender}].is_active`} disabled={disabled} />
          </td>

          <td className='bw_text_center'>
            <label className='bw_radio'>
              <input
                disabled={disabled}
                type='radio'
                name={`is_default`}
                value={keyRender}
                style={{ lineHeight: '1' }}
                checked={watch(`product_list[${keyRender}].is_default`)}
                onChange={(e) => {
                  for (let i = 0; i < productList.length; i++) {
                    setValue(`product_list[${i}].is_default`, false);
                  }
                  setValue(`product_list[${keyRender}].is_default`, true);
                }}
              />
              <span></span>
            </label>
          </td>
        </tr>
      );
    });
  }, [productList, unitData, setValue, watch, disabled]);

  const jsx_tbody =
    productList?.length > 0 ? (
      <tbody>{renderData()}</tbody>
    ) : (
      <tbody>
        <tr>
          <td colSpan={9}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
          </td>
        </tr>
      </tbody>
    );

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <div className='bw_box_card bw_mt_2'>
          <div className='bw_table_responsive'>
            <TableStyed className='bw_table'>
              <thead>
                <tr>
                  <th className='bw_text_center bw_bold'>STT</th>
                  <th className='bw_text_center'>Hình ảnh</th>
                  <th className='bw_text_center'>Mã SP/Tên SP</th>
                  <th className='bw_text_center'>Thời gian bảo hành</th>
                  {/* <th className='bw_text_center'>{attributeName1}</th>
                  <th className='bw_text_center'>{attributeName2}</th> */}
                  <THStyled className='bw_text_center'>
                    <Tooltip placement='top' title={`${attributeName1 || ''}`}>
                      Phân loại 1
                    </Tooltip>
                  </THStyled>
                  <THStyled className='bw_text_center'>
                    <Tooltip placement='top' title={`${attributeName2 || ''}`}>
                      Phân loại 2
                    </Tooltip>
                  </THStyled>
                  <th className='bw_text_center'>ĐVT</th>
                  <th className='bw_text_center'>Kích hoạt</th>
                  <th className='bw_text_center'>Mặc định</th>
                </tr>
              </thead>

              {jsx_tbody}
            </TableStyed>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ProductListTable.propTypes = {
  /** Indicate table's loading state */
  loading: PropTypes.bool,
};

ProductListTable.defaultProps = {
  loading: false,
};

export default ProductListTable;
