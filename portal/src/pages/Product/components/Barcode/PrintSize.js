import React from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';

export default function PrintSize() {
  const methods = useFormContext();
  const field = 'size';

  React.useEffect(() => {
    methods.register(field);
  }, [methods]);

  return (
    <BWAccordion title='Khổ in' id='bw_des' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <label className='bw_radio'>
            <input
              type='radio'
              name='bw_type'
              checked={methods.watch(field) === 3}
              onChange={(e) => {
                methods.clearErrors(field);
                methods.setValue(field, 3);
              }}
            />
            <span></span>
            Mẫu giấy cuộn 1 nhãn (Khổ 35x15mm)
          </label>
        </div>
        {!methods.watch('is_qr_code') && (
          <div className='bw_col_6'>
            <label className='bw_radio'>
              <input
                type='radio'
                name='bw_type'
                checked={methods.watch(field) === 4}
                onChange={(e) => {
                  methods.clearErrors(field);
                  methods.setValue(field, 4);
                }}
              />
              <span></span>
              Mẫu giấy cuộn 3 nhãn (Khổ 35x15mm)
            </label>
          </div>
        )}

        <div className='bw_col_6'>
          <label className='bw_radio'>
            <input
              type='radio'
              name='bw_type'
              checked={methods.watch(field) === 1}
              onChange={(e) => {
                methods.clearErrors(field);
                methods.setValue(field, 1);
              }}
            />
            <span></span>
            Mẫu giấy cuộn 1 nhãn (Khổ 40x30mm)
          </label>
        </div>
        <div className='bw_col_6'>
          <label className='bw_radio'>
            <input
              type='radio'
              name='bw_type'
              checked={methods.watch(field) === 2}
              onChange={(e) => {
                methods.clearErrors(field);
                methods.setValue(field, 2);
              }}
            />
            <span></span>
            Mẫu giấy cuộn 1 nhãn (Khổ 35x22mm)
          </label>
        </div>
      </div>
    </BWAccordion>
  );
}
