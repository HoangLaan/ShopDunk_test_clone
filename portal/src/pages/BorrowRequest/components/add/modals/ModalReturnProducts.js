import React, { useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Tooltip } from 'antd';

import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import { returnRequest } from 'services/borrow-request.service';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import ModalAddReturnProduct from './ModalAddReturnProduct';
import BWButton from 'components/shared/BWButton';

const ModalWrapper = styled.div`
  .bw_modal_wrapper {
    max-height: 80vh;
    max-width: 80vw;
  }
`;

const styleModal = { marginLeft: '300px' };

const headerStyles = {
  backgroundColor: 'white',
  borderBottom: '#ddd 1px solid',
  position: 'sticky',
  marginTop: '-20px',
  // zIndex: '1',
  top: '-2rem',
  width: '74rem',
  marginLeft: '-20px',
  height: '4rem',
  zIndex: 2,
};

const titleModal = {
  marginLeft: '2rem',
  marginTop: '1rem',
};

const closeModal = {
  marginRight: '2rem',
  marginTop: '1rem',
};

function ModalReturnProducts({ borrowRequestId, setIsOpenModal, getData }) {
  const [isOpenSelectModal, setIsOpenSelectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      list_product_return: [],
      borrow_request_id: borrowRequestId,
    },
  });
  const {
    formState: { errors },
    clearErrors,
    watch,
    control,
    handleSubmit,
  } = methods;

  const { remove } = useFieldArray({
    control,
    name: 'list_product_return',
    rules: {
      required: false,
      validate: (field) => {
        let msg = field?.length ? '' : 'Vui lòng chọn sản phẩm mượn';
        if (msg) return msg;
        else {
          if (errors['list_product_return']) clearErrors('list_product_return');
        }
      },
    },
  });

  const onSubmit = async (dataSubmit) => {
    try {
      setLoading(true);

      await returnRequest(dataSubmit.borrow_request_id, dataSubmit);
      showToast.success('Trả hàng thành công');
      getData();
      setIsOpenModal(false);
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, i) => {
          return i + 1;
        },
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <Tooltip title={p?.product_name}>
            {p?.product_name?.length > 43 ? p?.product_name.slice(0, 40) + '...' : p?.product_name}
          </Tooltip>
        ),
      },
      {
        header: 'Tên nhà sản xuất',
        accessor: 'manufacture_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số lượng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <div className=' bw_col_12'>
              <FormNumber
                className='bw_frm_box'
                // min={1}
                style={{ width: '100%' }}
                field={`list_product_return.${index}.quantity_return`}
                validation={{
                  required: 'Số lượng là bắt buộc',
                  validate: (value, data) => {
                    if (typeof +value === 'number') {
                      if (value < 1) {
                        return 'Số lượng phải lớn hơn 0';
                      }

                      if (value > data.list_product_return[index].total_inventory) {
                        return 'Số lượng không vượt quá tồn';
                      }

                      if (
                        value >
                        data.list_product_return[index].borrow_quantity - data.list_product_return[index].total_returned
                      ) {
                        return 'Số lượng không vượt quá cần trả';
                      }
                    }

                    return true;
                  },
                }}
                placeholder='Nhập số lượng mượn'
                // disabled={disabled}
              />
            </div>
          );
        },
      },
      {
        header: 'Cần trả',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'total_inventory',
        formatter: (v) => +v.borrow_quantity - +v.total_returned || 0,
      },
      {
        header: 'Tổng tồn',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'total_inventory',
        formatter: (v) => v.total_inventory || 0,
      },
      {
        header: 'Lý do mượn',
        formatter: (_, index) => {
          return (
            <div className='bw_col_12'>
              <FormInput
                className='bw_frm_box'
                field={`list_product_return.${index}.reason`}
                style={{ width: '100%' }}
                placeholder='Nhập lý do mượn'
                // disabled={disabled}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn sản phẩm',
        permission: 'SL_BORROWREQUEST_ADD',
        onClick: () => setIsOpenSelectModal(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'SL_BORROWREQUEST_DEL',
        onClick: (p, index) => remove(index),
      },
    ];
  }, [remove]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalWrapper>
          <div className='bw_modal bw_modal_open' id='bw_addProduct'>
            <div class='bw_modal_container bw_w1200 bw_modal_wrapper' style={styleModal}>
              <div class='bw_title_modal' style={headerStyles}>
                <h3 style={titleModal}>Trả hàng</h3>
                <span
                  class='fi fi-rr-cross-small bw_close_modal'
                  onClick={() => setIsOpenModal(false)}
                  style={closeModal}></span>
              </div>
              <div>
                <div>
                  <div className='bw_main_wrapp'>
                    <DataTable
                      columns={columns}
                      data={watch('list_product_return')}
                      noSelect={true}
                      noPaging={true}
                      actions={actions}
                    />
                    {errors['list_product_return'] && (
                      <ErrorMessage message={errors.list_product_return?.root?.message} />
                    )}
                  </div>
                  <div className='bw_footer_modal bw_flex bw_justify_content_right'>
                    <BWButton submit={true} className='bw_btn bw_btn_success' content={'Trả hàng'} loading={loading} />
                    <button onClick={() => setIsOpenModal(false)} className='bw_btn_outline bw_close_modal'>
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isOpenSelectModal && (
            <ModalAddReturnProduct setIsOpenModal={setIsOpenSelectModal} borrowRequestId={watch('borrow_request_id')} />
          )}
        </ModalWrapper>
      </form>
    </FormProvider>
  );
}

export default ModalReturnProducts;
