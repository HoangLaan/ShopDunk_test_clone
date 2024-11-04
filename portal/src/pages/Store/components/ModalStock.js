import DataTable from 'components/shared/DataTable/index';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { create } from 'services/store.service';
import { showToast } from 'utils/helpers';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getStoreTypeDetail } from 'services/store-type.service';

export default function ModalStock({ onClose }) {
  const methods = useFormContext();

  const columns = [
    {
      header: 'Tên kho',
      formatter: (_, index) => (
        <span>
          <FormInput
            style={{
              padding: '10px',
              width: '100%',
            }}
            field={`stock_list[${index}].name`}
          />
        </span>
      ),
    },
  ];

  useEffect(() => {
    getStoreTypeDetail(methods.watch('store_type_id')).then((data) => {
      methods.setValue(
        'stock_list',
        data?.stocks_type_ids.map((o) => {
          return {
            id: o?.id,
            name: methods.watch('store_code') + ' ' + methods.watch('store_name') + ' ' + o?.name,
          };
        }),
      );
    });
  }, []);

  return (
    <div className='bw_modal bw_modal_open' id='bw_confirm_modal'>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>Danh sách kho</h3>
          <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => onClose()} />
        </div>
        <div className='bw_main_modal'>
          <DataTable noPaging noSelect={true} columns={columns} data={methods?.watch('stock_list') ?? []} />
        </div>
        <div className='bw_footer_modal'>
          <button
            type='button'
            onClick={async () => {
              try {
                await create(methods.watch());
                showToast.success(`Thêm mới thành công`, {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'colored',
                });
                methods.reset({ is_active: 1 });
                onClose();
              } catch {}
            }}
            className='bw_btn bw_btn_success'>
            Xác nhận
          </button>
          <button onClick={onClose} className='bw_btn_outline bw_close_modal'>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
