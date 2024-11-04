import React from 'react';
import BWAccordion from '../../../../components/shared/BWAccordion/index';
import FormRadioGroup from '../../../../components/shared/BWFormControl/FormRadioGroup';
const StocksOutOptionType = ({ disabled, title, id }) => {
  const options = [
    { label: 'Xuất nội bộ', value: 1 },
    { label: 'Xuất bán', value: 2 },
    { label: 'Xuất đổi hàng', value: 3 },
    { label: 'Xuất bảo hành', value: 4 },
    { label: 'Xuất trả NCC', value: 5 },
    { label: 'Xuất điều chuyển', value: 6 },
    { label: 'Xuất đền bù mất hàng', value: 7 },
    { label: 'Xuất rã lấy linh kiện', value: 8 },
    { label: 'Xuất hủy', value: 9 },
    { label: 'Xuất kho công ty', value: 10 },

  ];
  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_collapse_panel'>
        <div className='bw_frm_box'>
          <FormRadioGroup field='stocks_out_type' disabled={disabled} list={options} custom={true} />
        </div>
      </div>
    </BWAccordion>
  );
};

export default StocksOutOptionType;
