import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import { Alert } from 'antd';

// Components
import BWAccordion from 'components/shared/BWAccordion/index';
import ProductsModal from './ProductsModal';
import BWModal from 'components/shared/BWModal/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
// Utils
import { formatCurrency } from 'pages/Product/helpers/index';
import BWButton from 'components/shared/BWButton';
import { useMemo } from 'react';
import ModalImei from './ModalImei';
import { showToast } from 'utils/helpers';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function Products() {
  const {
    watch,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useFormContext();
  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpenImei, setIsOpenImei] = useState(false);
  const [isOpenModalRequired, setOpenModalRequired] = useState(false);
  const [imeiIndex, setImeiIndex] = useState({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
    rules: {
      required: false,
      validate: (field) => {
        if (!field.length) return 'Sản phẩm in mã vạch là bắt buộc.';
        for (let i = 0; i < field.length; i++) {
          if (!field[i].total_barcode) {
            return `Số lượng tem in tại dòng số ${i + 1} là bắt buộc.`;
          } else if (field[i].total_barcode > 500) {
            return `Số lượng tem in tại dòng số ${i + 1} tối đa 500.`;
          }
        }
      },
    },
  });

  const isInfoValid = () => {
    if (
      !watch('stock') ||
      !watch('area') ||
      !watch('business') ||
      !watch('output_type') ||
      !watch('from_date') ||
      !watch('to_date')
    ) {
      return false;
    }
    return true;
  };

  const handleSelectProducts = (products) => {
    append(Object.values(products));
    setOpenModal(false);
    reset({ ...getValues() });
  };

  const isShowImei = (watch('is_show_imei') ?? 1) === 1;

  return (
    <BWAccordion title='Danh sách sản phẩm' id='bw_image' isRequired={true}>
      {errors['products'] && (
        <Alert closable className='bw_mb_2' type='error' message={errors['products']?.root?.message} />
      )}
      <div className='bw_flex bw_align_items_center bw_justify_content_between bw_mb_1'>
        <p>
          <b>{fields.length ?? 0}</b> sản phẩm
        </p>
        <a
          data-href='javascript:void(0)'
          onClick={(e) => {
            e.preventDefault();
            const isValid = isInfoValid();
            if (isValid) setOpenModal(true);
            else setOpenModalRequired(true);
          }}
          className='bw_btn bw_btn_success bw_open_modal'>
          Chọn thêm sản phẩm
        </a>
      </div>

      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className=''>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th className='bw_text_center'>Số lượng tem</th>
            {isShowImei && <th className='bw_text_center'>IMEI</th>}
            <th className='bw_text_center'>Giá sản phẩm (đ)</th>
            <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
          </thead>
          <tbody>
            {watch('products') ? (
              fields.map((product, i) => (
                <tr>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                  <td className=''>
                    <b>{product?.product_code}</b>
                  </td>
                  <td className=''>{product?.product_name}</td>
                  <td className='bw_text_center'>
                    <FormNumber field={`products.${i}.total_barcode`} min={1} max={500} />
                    {/* <input type="number" className="bw_inp bw_mw_2 bw_text_center" {...register(``)} min={1} max={500} pattern="[0-9]{2}" /> */}
                  </td>
                  {isShowImei && (
                    <td className='bw_text_center'>
                      <BWButton
                        icon={'fi fi-rr-barcode'}
                        onClick={() => {
                          if (product.imeis?.length === 0) {
                            return showToast.warning(`Sản phẩm không có imeis`);
                          }
                          setValue(`imeis.${i}`, product.imeis);
                          setImeiIndex(i);
                          setIsOpenImei(true);
                        }}
                      />
                      <p>{watch(`imei_names.${i}`)?.join(', ')}</p>
                    </td>
                  )}

                  <td className='bw_text_center'>{formatCurrency(product.price)}</td>
                  <td className='bw_sticky bw_action_table bw_text_center'>
                    <a
                      href='javascript:void(0)'
                      onClick={() => {
                        setValue(`imei_names.${imeiIndex}`, []);
                        remove(i);
                      }}
                      className='bw_btn_table bw_delete bw_red'
                      title='Xoá'>
                      <i className='fi fi-rr-trash'></i>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='bw_text_center'>
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isOpenModal && <ProductsModal onConfirm={handleSelectProducts} onClose={() => setOpenModal(false)} />}
      {isOpenModalRequired && (
        <BWModal
          onClose={() => setOpenModalRequired(false)}
          open={isOpenModalRequired}
          header={
            <>
              <span className='bw_icon_notice'>
                <i className='fi fi-rr-bell'></i>
              </span>{' '}
              Thông báo
            </>
          }>
          <ModalContent>
            Vui lòng chọn đầy đủ thông tin: `Kho, hình thức xuất, khu vưc, miền và thời gian áp dụng`!{' '}
          </ModalContent>
        </BWModal>
      )}

      {/* Model Imei */}
      {isOpenImei && (
        <ModalImei
          defaultDataSelect={watch(`products.${imeiIndex}.imeis`)}
          data={watch(`imeis.${imeiIndex}`)}
          open={isOpenImei}
          onClose={() => {
            setIsOpenImei(false);
          }}
          onApply={(d) => {
            setValue(`products.${imeiIndex}.imeis`, d);
            setValue(
              `imei_names.${imeiIndex}`,
              d.map((it) => it.imei),
            );
          }}
        />
      )}
    </BWAccordion>
  );
}
